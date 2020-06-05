## @rest-api/react-models

Make your React project easier to maintain with this package.

Benefits:

 - You will gain a more typed project (if you are using Typescript)
 - All ajax calls are stored on redux, your endpoint is only called on necessary
 - Better structure on your project

Caution: if you have some random typescript error (pex: ts2589) on creating or editing models, kill the process and restart npm start (on Visual Studio Code restart program).

## Major changes
### From v1
 - Upgraded typescript version and needs your proyect version >=3.9.3 (and react-scripts >= 3.4.1, if you don't eject your project)
 - Required and idOnly don't need to import from library since upgraded typescript version
 - A model on a schema represents the schema of model (for represent the primary key, needs to pass idOnly argument)
 - Connect methods deleted (deprecated on v1)
 - Added more flexibility on models generation adding methods ("getSubModelWithKey" and "getSearchSubModel") to models
### From v0
 - On model creation don't need to pass a model name. This major includes a refactor and some bug fixes and features.

## File structure
This code examples follows this src structure:
```
src
└-- models
|   └-- bookModel.ts
|   └-- libraryModel.ts
└-- containers
|   └-- bookContainer.tsx
|   └-- libraryContainer.tsx
└-- views
|   └-- bookView.tsx
|   └-- libraryContainer.tsx
└-- index.tsx
```
## Provider
First of all you need to insert on your index.tsx the provider from application.

    ...
    import { getProvider } from  '@rest-api/react-models';
	
	const ReactModelsProvider = getProvider();


	ReactDOM.render(<ReactModelsProvider>
			<App />
		</ReactModelsProvider>, document.getElementById('root'));

## Declaring models
Declare the models of your application, given a Schema, an id (need to be required field) and a base url:

    import  React  from  'react'
    
    import { Model, Schema, required } from  '@rest-api/react-models'
    
    const librarySchema = Schema({
        id: {
    	    type: Number,
    	    required
        },
        name: String
    })
    export  default  new  Model(librarySchema, 
	    'id', 
	    '/api/library')

   
You can use complex objects on a Schema simplier creating subschemas:

    import { Schema } from  '@rest-api/react-models'
    
    const testSchema = Schema({
	    subSchema: Schema({
	    	id: { type: String },
	    	name: String
    	})
	})
And foreign keys of your model can be representated:

    import { ModelType, ModelPopulatedType, Schema, Model, required } from  '@rest-api/react-models'
    import libraryModel from './libraryModel'
    
    const bookSchema = Schema({
	    id: { type: Number, required },
	    name: { type: String, required },
	    description: String,
	    library: {
		    type: libraryModel,
		    required
	    }
    })
    export type BookType = ModelType<typeof bookSchema>
	export type BookPopulatedType = ModelPopulatedType<typeof bookSchema>
	export default new Model(bookSchema, 'id', '/api/book')

An option can be passed to model declaration in order to works with django "trailing slash" or pass custom headers:

	new Model(bookSchema, 'id', '/api/book', { trailingSlash: true, headers: { Authorization: "Basic xxxx" } })


## Using on the container
### Simple usage
Once you have created a model, you can use it on a container!

Fist clean mode using Typescript, using a hook:

    import  React  from  'react'
	
	import  bookModel  from  '../models/bookModel'
	import  BookView  from  '../views/bookView'

  
	export default () => {
		const { items, loading, error } = bookModel.useGet()
		if (error) return  <p>There are an error with the request</p>
		if (loading) return  <p>Loading...</p>
		return  <ul>{
			items.map(i  =>  <BookView  name={i.name}  />)
		}</ul>
	}

And the "connect" way as a redux container (Note that will be removed on future and it's deprecated):

    import  React  from  'react'

	import  bookModel, { BookType }  from  '../models/bookModel'
	import  BookView  from  '../views/bookView'
	import { HttpError } from  '@rest-api/redux'

	class  BookContainer  extends  React.Component<{ 
		error: HttpError | null, 
		loading: boolean, 
		items: BookType[] 
	}>{
		render() {
			const { items, loading, error } = this.props
			if (error) return  <p>There are an error with the request</p>
			if (loading) return  <p>Loading...</p>
			return  <ul>{
				items.map(i  =>  <BookView  name={i.name}  />)
			}</ul>
		}
	}
	export default bookModel.connectGet()(BookContainer)

### Populate items
You can populate items with a simple usage (you need to check if it's populated):

	import React from 'react'

	import bookModel from '../models/bookmodel'
	
	export default () => {
		const {loading, error, ...result} = bookModel.useGetPopulated()

		if (error) return  <p>There are an error with the request</p>
		if (loading) return  <p>Loading...</p>
		if(result.populated)
			return  <table>
				<thead>
					<tr>
						<th>Id</th>
						<th>Name</th>
						<th>Library name</th>
					</tr>
				</thead>
				<tbody>
				{
					result.items.map(i  =>  <React.Fragment key={i.id}>
						<td>{i.id}</td>
						<td>{i.name}</td>
						<td>{i.library.name}</td>
					</React.Fragment>
				}
				</tbody>
			</table>
		return  <table>
			<thead>
				<tr>
					<th>Id</th>
					<th>Name</th>
					<th>Library name</th>
				</tr>
			</thead>
			<tbody>
			{
				result.items.map(i  =>  <React.Fragment key={i.id}>
					<td>{i.id}</td>
					<td>{i.name}</td>
					<td>{i.library.name ? i.library.name : Loading ...}</td>
				</React.Fragment>
			}
			</tbody>
		</table>
	}