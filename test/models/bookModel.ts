import { Model, ModelType, ModelPopulatedType, Schema, required } from '../..'

const bookSchema = Schema({
    id: {
        type: Number,
        required
    },
    name: String
})
export type BookType = ModelType<typeof bookSchema>
export type BookPopulatedType = ModelPopulatedType<typeof bookSchema>
export default new Model(bookSchema, 'modelName (only for debug purpose raising errors)', 'id', '/api/example')
