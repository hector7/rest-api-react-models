import { Schema, Model, required } from '../..'

const DiagnosisSchema = Schema({
    id: { type: Number, required },
    name: { type: String, required }
})

export default new Model(DiagnosisSchema, 'id', '/api/diagnosis', { trailingSlash: true })