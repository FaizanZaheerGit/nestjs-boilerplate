import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, HydratedDocument } from 'mongoose';
import common_utils from '../utils/common_utils';

export type UserDocument = HydratedDocument<User>;

@Schema({
    versionKey: false,
})
export class User {
    @Prop({type: String, default: ''})
    name: string;

    @Prop({type: String, required: true, unique: true, lowercase: true})
    email_address: string;

    @Prop({type: String, default: ''})
    phone_number: string;

    @Prop({type: String, default: ''})
    password: string;

    @Prop({type: String, default: ''})
    password_salt: string;

    @Prop({type: String, default: ''})
    display_picture: string;

    @Prop({type: SchemaTypes.ObjectId, ref: 'User', default: null})
    created_by: User;

    @Prop({type: SchemaTypes.ObjectId, ref: 'User', default: null})
    updated_by: User;

    @Prop({type: Number, default: common_utils.get_current_epoch_time()})
    created_at: Number;

    @Prop({type: Number, default: common_utils.get_current_epoch_time()})
    updated_at: Number;
}

export const UserSchema = SchemaFactory.createForClass(User);
