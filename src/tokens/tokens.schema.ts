import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { User } from '../users/users.schema';
import common_utils from '../utils/common_utils';

export type TokenDocument = HydratedDocument<Token>;

@Schema({
  versionKey: false,
})
export class Token {
  @Prop({ type: String, index: { expires: '86400s' } })
  token: string;

  @Prop({ type: SchemaTypes.ObjectId, default: null })
  user: User;

  @Prop({ type: String, default: '' })
  purpose: string;

  @Prop({ type: Number, default: 0 })
  expiry_time: number;

  @Prop({ type: Boolean, default: false })
  is_expired: boolean;

  @Prop({ type: Number, default: common_utils.get_current_epoch_time() })
  created_at: number;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
