## @rest-api/react-models
[![npm version](https://img.shields.io/npm/v/@rest-api/react-models)](https://www.npmjs.com/package/@rest-api/react-models)
[![CircleCI](https://circleci.com/gh/hector7/rest-api-react-models.svg?style=shield)](https://circleci.com/gh/hector7/rest-api-react-models)
[![codecov](https://codecov.io/gh/hector7/rest-api-react-models/branch/master/graph/badge.svg)](https://codecov.io/gh/hector7/rest-api-react-models)


Make your React project easier to maintain with this package.

Benefits:

 - You will gain a more typed project (if you are using Typescript)
 - All ajax calls are stored on redux, your endpoint is only called on necessary
 - Better structure on your project

Caution: if you have some random typescript error (pex: ts2589) on creating or editing models, kill the process and restart npm start (on Visual Studio Code restart program).

## Features
 - Added nullable argument to schema fields
 - Added initialized variable for all requests (if not initialized, is not requested)
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

    import { Model, Schema } from  '@rest-api/react-models'
    
    const librarySchema = Schema({
        id: {
            type: Number,
            required: true
        },
        name: String
    })
    export  default  new  Model(librarySchema, 
        'id', // must be declared as required, string or number and not array or null
        '/api/library')

   
You can use complex objects on a Schema simplier creating subschemas:

    import { Schema } from  '@rest-api/react-models'
    
    const testSchema = Schema({
        subSchema: Schema({
            id: { type: String },
            name: String
        })
    })
    
Represent a field which can be null:

    import { Schema } from  '@rest-api/react-models'
    
    const testSchema = Schema({
        nullableField: { 
            type: String, 
            nullable: true, 
            required: true 
        }
    })

For a model with metadata, you can represent with following arguments (declaring the data that endpoint sends):

    import { Model, Schema } from  '@rest-api/react-models'
    
    const librarySchema = Schema({
        id: {
            type: Number,
            required: true
        },
        name: String
    })
    export  default  new  Model(librarySchema, 
        'id', 
        '/api/library',
	Schema({
	    count: {
	        type: Number,
		required: true
	    },
	    items: [{
	        type: librarySchema,
		required: true
	    }]
	},
	data => data.items,
	({items, ...metadata}) => metadata,
	{} //here optional opts (trailingSlash and headers)
    )
    	
And foreign keys of your model can be representated:

    import { ModelType, ModelPopulatedType, Schema, Model } from  '@rest-api/react-models'
    import libraryModel from './libraryModel'
    
    const bookSchema = Schema({
        id: { type: Number, required: true },
        name: { type: String, required: true },
        description: String,
        library: {
            type: libraryModel,
            required: true,
            idOnly: true
        }
    })
    export type BookType = ModelType<typeof bookSchema>
    export type BookPopulatedType = ModelPopulatedType<typeof bookSchema>
    export default new Model(bookSchema, 'id', '/api/book')

An option can be passed to model declaration in order to works with django "trailing slash" or pass custom headers:

    new Model(bookSchema, 'id', '/api/book', { trailingSlash: true, headers: { Authorization: "Basic xxxx" } })

### New methods of model
If you has an endpoint on a different url that represents same object, now you can use your declared model

#### getSubModelWithKey method
In order to get an object by a key (not an id, but is unique) this is your method
Simple usage:

    import bookModel from './bookModel'
    export default bookModel.getSubModelWithKey('name', '/api/book/name') 
    
    //url is optional, if not provided will be used url from bookModel

Full control on your url:

    import bookModel from './bookModel'
    import { Schema } from '@rest-api/react-models'
    const optSchema = Schema({ 
        project: { 
            type: Number, 
            required: true 
        }
    })
    export default bookModel.getSubModelWithKey(optSchema, 'name', ({project}) => `/api/book/${project}/name`)

#### getSearchSubModel method
This method is in order to work as "useGet" or "useGetPopulated", but in other url

Simple usage:

    import bookModel from './bookModel'
    export default bookModel.getSearchSubModel('api/book/hector') 


Full control on your url:

    import bookModel from './bookModel'
    import { Schema } from '@rest-api/react-models'
    const optSchema = Schema({ 
        author: { 
            type: String,
            required: true 
        }
    })
    export default bookModel.getSearchSubModel(optSchema, ({author}) => `/api/book/${author}`)

## Using on the container
### Simple usage
Once you have created a model, you can use it on a container!

Fist clean mode using Typescript, using a hook:

    import  React  from  'react'
	
	import  bookModel  from  '../models/bookModel'
	import  BookView  from  '../views/bookView'

  
	export default () => {
		const { items, loading, error, initialized } = bookModel.useGet()
        if (!initialized) <p>Request not fetched</p>
		if (error) return  <p>There are an error with the request</p>
		if (loading) return  <p>Loading...</p>
		return  <ul>{
			items.map(i  =>  <BookView  name={i.name}  />)
		}</ul>
	}


### Populate items
This feature populate foreign key if these ones aren't fetched. 
It's recommended to fetch beore this call the objects using useGet (pex: on Apps initialization). The ajax method will be called only on necessary (if there are some object not fetched).

You can populate items with a simple usage (you need to check if it's populated, if you want to use a placeholder):

	import React from 'react'

	import bookModel from '../models/bookModel'

	export default () => {
	    const { loading, error, ...result } = bookModel.useGetPopulated()

	    if (error) return <p>There are an error with the request</p>
	    if (loading) return <p>Loading...</p>
	    return <table>
		<thead>
		    <tr>
			<th>Id</th>
			<th>Name</th>
			<th>Library name</th>
		    </tr>
		</thead>
		<tbody>
		    {
			result.populated ?
			result.items.map(i => <React.Fragment key={i.id}>
			    <td>{i.id}</td>
			    <td>{i.name}</td>
			    <td>{i.library.name}</td>
			</React.Fragment>) :
			result.items.map(i => <React.Fragment key={i.id}>
			    <td>{i.id}</td>
			    <td>{i.name}</td>
			    <td>{i.library.name ?? 'Loading ...'}</td>
			</React.Fragment>)
		    }
		</tbody>
	    </table>
	}

### Use methods (POST, PUT, PATCH, DELETE)
In order to access to one of those methods, select the correct hook (usePost, usePut, usePatch or useDelete)


	import React from 'react'

    import { ModelType, HttpError } from '@rest-api/react-models'
	import bookModel from '../models/bookModel'
    import { useHistory } from 'react-router-dom'

	export default () => {
	    const post = bookModel.usePost()
        const [data, setData] = React.useState<ModelType<typeof bookModel>|null>(null)
        const history = useHistory()
        const [error, setError] = React.useState<HttpError|null>(null)
        
        function handleSubmit(ev){
            ev.preventDefault()
            if(data)
                post(data, (err, res) => {
                    if(err) //there are an error with request
                        return setError(err)
                    history.push('to the new path')
                })
        }

        return ...
	}
