import CenterModel from './Center'
import { Schema, Model, required } from '../..'
import Tutor from './Tutor'
import Diagnosis from './Diagnosis'
import Service from './Service'

const TutorSchema = Schema({
    id: { type: Number, required },
    tutor: { type: Tutor, required },
    service: { type: Service, required },
    name: { type: String, required },
    diagnosis: { type: Diagnosis, required },
    birth_year: { type: Number, required },
})

export default new Model(TutorSchema, 'id', '/api/user', { trailingSlash: true })