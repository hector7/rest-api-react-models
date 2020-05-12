import CenterModel from './Center'
import { Schema, Model, required, ModelType, ModelPopulatedType } from '../..'
import Faculty from './Faculty'
import Level from './Level'
const levelSchema = Schema({
    faculty: { type: Number, required },
    faculty_name: String,
    level: { type: Number, required },
    level_name: String
})
const UserHasLevelSchema = Schema({
    id: { type: Number, required },
    name: { type: String },
    levels: [levelSchema]
})

export type UserHasLevelType = ModelType<typeof UserHasLevelSchema>
export type UserHasLevelPopulatedType = ModelPopulatedType<typeof UserHasLevelSchema>
export default new Model(UserHasLevelSchema, 'user_has_level', 'id', '/api/user_has_level', { trailingSlash: true })