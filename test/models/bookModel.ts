import { Model, ModelType, ModelPopulatedType, Schema, required } from '../..'
import libraryModel from './libraryModel'

const bookSchema = Schema({
    id: {
        type: Number,
        required
    },
    name: String,
    library: libraryModel
})
export type BookType = ModelType<typeof bookSchema>
export type BookPopulatedType = ModelPopulatedType<typeof bookSchema>
export default new Model(bookSchema, 'id', '/api/example')
