import { Schema, Model, required } from '../..'

const Center = Schema({
    id: { type: Number, required },
    name: { type: String, required },
})

export default new Model(Center, 'id', '/api/center', { trailingSlash: true })