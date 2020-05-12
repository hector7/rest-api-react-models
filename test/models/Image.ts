import { Schema, Model, required, ModelType } from '../..'

const Image = Schema({
    id: { type: Number, required },
    filename: { type: String, required },
    name: { type: String, required },
})
export type ImageType = ModelType<typeof Image>
export default new Model(Image, 'Image', 'id', '/api/image', { trailingSlash: true })