import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({
    required: true,
    type: String,
  })
  name: string;

  @Prop({
    required: true,
    type: String,
  })
  email: string;

  @Prop({
    required: true,
    type: String,
  })
  phone: string;

  @Prop({
    required: true,
    type: String,
  })
  address: string;

  @Prop({
    required: true,
    type: Number,
  })
  age: number;

  @Prop()
  status: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
