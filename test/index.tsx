import  React  from  'react'
    
import { Model, Schema, required } from  '..'

const nameSchema = Schema({
    id: {
        type: String,
        required
    },
    name: String
})

export default new Model(nameSchema, 'model naem', 'id', '/api/example')
