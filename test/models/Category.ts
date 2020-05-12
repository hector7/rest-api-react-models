import { Schema, Model, required, ModelType } from '../..'
import Faculty from './Faculty'

const Category = Schema({
    id: { type: Number, required },
    name: { type: String, required },
    image: { type: String, required },
    faculty: Faculty
})


export default new Model(Category, 'faculty', 'id', '/api/category', { trailingSlash: true })