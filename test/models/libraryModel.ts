import { Model, ModelType, ModelPopulatedType, Schema, required } from '../..'

const librarySchema = Schema({
    id: {
        type: Number,
        required
    },
    name: String,
})
export type LibraryType = ModelType<typeof librarySchema>
export type LibraryPopulatedType = ModelPopulatedType<typeof librarySchema>
export default new Model(librarySchema, 'id', '/api/library')
