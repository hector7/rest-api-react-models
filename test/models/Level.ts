import { Schema, Model, required, ModelType } from '../..'

const Level = Schema({
    id: { type: Number, required },
    name: { type: String, required },
    position: { type: Number, required },
})

export type LevelType = ModelType<typeof Level>
export default new Model(Level, 'id', '/api/level', { trailingSlash: true })