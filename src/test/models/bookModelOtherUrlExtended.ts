import model from './bookModel'
import { Schema } from '../../..'

export default model.getSearchSubModel(Schema({ project: { type: String, required: true } }), ({ project }) => `/api/extended/${project}`)