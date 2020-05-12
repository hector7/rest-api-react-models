import { Schema, Model, required } from '../..'

const DiagnosisSchema = Schema({
    id: { type: Number, required },
    name: { type: String, required }
})

export default new Model(DiagnosisSchema, 'diagnosis', 'id', '/api/diagnosis', { trailingSlash: true })