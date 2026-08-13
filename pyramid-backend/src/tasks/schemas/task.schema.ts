import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
class Comment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  @Prop({ required: true })
  text: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  // Board columns / Kanban lanes
  @Prop({ enum: ['to_do', 'doing', 'completed', 'on_hold'], default: 'to_do' })
  status: string;

  @Prop({ enum: ['no_priority', 'urgent', 'high', 'medium', 'low'], default: 'no_priority' })
  priority: string;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  members: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  reporter?: Types.ObjectId;

  @Prop([String])
  labels: string[];

  @Prop([String])
  teams?: string[];

  @Prop()
  dueDate?: Date;

  @Prop({ type: Types.ObjectId, ref: 'Project' })
  project?: Types.ObjectId;

  // Subtasks reference other Task documents (self-referential)
  @Prop({ type: Types.ObjectId, ref: 'Task' })
  parentTask?: Types.ObjectId;

  @Prop({ type: [Comment], default: [] })
  comments: Comment[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId; // creator — used to scope data per guest session
}

export const TaskSchema = SchemaFactory.createForClass(Task);
