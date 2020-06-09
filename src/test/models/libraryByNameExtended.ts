import Library from './libraryModel'
import { Schema } from '../../..'

export default Library.getSubModelWithKey(Schema({ project: { type: String, required: true } }), 'name', ({ project }) => `/api/libraryByName/${project}`)