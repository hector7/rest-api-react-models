import { Schema, Model } from "../../../";
import { UserSchema } from './user'

export default new Model(Schema({
    id: { required: true, type: Number },
    name: { type: String, required: true },
    users: [{ type: UserSchema, required: true }]
}), 'id', '/api/rest')