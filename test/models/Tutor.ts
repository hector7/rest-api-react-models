import CenterModel from './Center'
import { Schema, Model, required } from '../..'

const TutorSchema = Schema({
    id: { type: Number, required },
    email: { type: String, required },
    first_name: { type: String, required },
    last_name: { type: String, required },
    center: { type: CenterModel, required },
    admin: { type: Boolean, required }
})

export default new Model(TutorSchema, 'tutor', 'id', '/api/tutor', { trailingSlash: true })