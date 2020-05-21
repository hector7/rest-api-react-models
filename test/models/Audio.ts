import { Schema, Model, required, ModelType } from '../..'

const Audio = Schema({
    id: { type: Number, required },
    name: { type: String, required },
    filename: { type: String, required },
})
export type AudioType = ModelType<typeof Audio>
export default new Model(Audio, 'id', '/api/audio', { trailingSlash: true })