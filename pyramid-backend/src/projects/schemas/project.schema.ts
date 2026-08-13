import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  name: string;

  @Prop({ enum: ['no_priority', 'urgent', 'high', 'medium', 'low'], default: 'no_priority' })
  priority: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  lead?: Types.ObjectId;

  @Prop()
  dueDate?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId; // who created it — used for guest-scoped data
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
