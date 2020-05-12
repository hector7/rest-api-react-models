import { Schema, Model, required, ModelType } from '../..'

const Faculty = Schema({
    id: { type: Number, required },
    name: { type: String, required },
    image: { type: String, required }
})

export type FacultyType = ModelType<typeof Faculty>

export default new Model(Faculty, 'faculty', 'id', '/api/faculty', { trailingSlash: true })