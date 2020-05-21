import { Schema, Model, required } from '../..'

const ServiceSchema = Schema({
    id: { type: Number, required },
    name: { type: String, required }
})

export default new Model(ServiceSchema, 'id', '/api/service', { trailingSlash: true })