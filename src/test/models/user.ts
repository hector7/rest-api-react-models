import { Schema, Model } from "../../../";
import GroupModel from './group'

export const UserSchema = Schema({
    id: { required: true, type: Number },
    name: { type: String, required: true },
});

export default new Model(UserSchema.updateSchema({
    groups: [{ type: GroupModel.hiddeFields('users'), required: true }]
}), 'id', '/api/rest')