import { Schema, Model, required, ModelType } from '../..'
import Faculty from './Faculty'
import Level from './Level'
import Category from './Category'

const ExerciseSchema = Schema({
    id: { type: Number, required },
    name: { type: String, required },
    faculty: { type: Faculty, required },
    category: { type: Category },
    level: { type: Level, required },
    questions: [Schema({
        images: [String],
        correct: { type: String, required }
    })],
    responses: [String],
    action: { type: String, required },
    instruction: { type: String, required },
    intent_1: { type: String, required },
    intent_2: { type: String, required },
    action_name: { type: String },
    instruction_name: { type: String },
    intent_1_name: { type: String },
    intent_2_name: { type: String },
    horizontal: { type: Boolean },  
    type: { type: String, required },
})
export type ExerciseType = ModelType<typeof ExerciseSchema>
export default new Model(ExerciseSchema, 'id', '/api/exercise', { trailingSlash: true })