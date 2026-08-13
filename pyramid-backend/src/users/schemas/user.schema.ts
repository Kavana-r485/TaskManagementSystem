import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, enum: ['guest', 'google'], default: 'guest' })
  provider: string;

  @Prop({ default: 'Guest' })
  fullName: string;

  @Prop()
  email?: string;

  @Prop()
  title?: string; // job title, shown on Settings > Profile

  @Prop()
  username?: string;

  @Prop()
  avatarUrl?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
