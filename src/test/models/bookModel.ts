import { Model, ModelType, PopulatedModelType, FullPopulatedModelType, Schema, required } from '../../..'
import libraryModel from './libraryModel'

const bookSchema = Schema({
    id: {
        type: Number,
        required
    },
    name: String,
    library: { type: libraryModel, required, idOnly: true }
})
export type BookType = ModelType<typeof bookSchema>
export type BookPopulatedType = PopulatedModelType<typeof bookSchema>
export type BookFullPopulatedType = FullPopulatedModelType<typeof bookSchema>
export default new Model(bookSchema, 'id', '/api/example')
