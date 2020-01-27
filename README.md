﻿Caution: This library are not fully tested, not use in production.
Will be tested on a near future. Please, use it and open issues for bugs or improvements!
## @rest-api/react-models

Make your React project easier to maintain with this package.

Benefits:

 - You will gain a more typed project (if you are using Typescript)
 - All ajax calls are stored on redux, your endpoint is only called on necessary
 - Better structure on your project

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
	    'model name (only for debug purpose raising errors)', 
	    'id', 
	    '/api/library')

   
You can use complex objects on a Schema simplier creating subschemas:

    import { Schema } from  '@rest-api/react-models'
    
    const testSchema = Schema({
	    subSchema: Schema({
	    	id: {
	    	    type: String,
			},
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
	export default new Model(bookSchema, 'books', 'id', '/api/book')


## Using on the container

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

And the "connect" way as a redux container:

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

## Next steps
A better documentation and fully tested package!