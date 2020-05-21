import { Model, Schema, required } from '..'

const nameSchema = Schema({
    id: {
        type: String,
        required
    },
    name: String
})

export default new Model(nameSchema, 'id', '/api/example', { trailingSlash: true, headers: { Authorization: 'Basic xxxxxx' } })
