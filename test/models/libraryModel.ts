import { Model, ModelType, PopulatedModelType, FullPopulatedModelType, Schema, required } from '../..'
import {} from '@rest-api/redux'
const librarySchema = Schema({
    id: {
        type: Number,
        required
    },
    name: { type: String, required },
})
export type LibraryType = ModelType<typeof librarySchema>
export type LibraryPopulatedType = PopulatedModelType<typeof librarySchema>
export type LibraryFullPopulatedType = FullPopulatedModelType<typeof librarySchema>
export default new Model(librarySchema, 'id', '/api/library')
