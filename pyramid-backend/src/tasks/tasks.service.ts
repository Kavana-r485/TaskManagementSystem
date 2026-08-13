import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AddCommentDto } from './dto/add-comment.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  create(dto: CreateTaskDto, ownerId: string) {
    return this.taskModel.create({ ...dto, owner: ownerId, reporter: ownerId });
  }

  // Supports the Board view (group by status client-side) and the List
  // view (same data, different rendering) from one endpoint, plus
  // optional filters mirroring the Fields/Filter dropdowns in the design.
  findAll(filters: { status?: string; priority?: string; project?: string; search?: string }) {
    const query: Record<string, unknown> = { parentTask: null };

    if (filters.status) query.status = filters.status;
    if (filters.priority) query.priority = filters.priority;
    if (filters.project) query.project = filters.project;
    if (filters.search) query.title = { $regex: filters.search, $options: 'i' };

    return this.taskModel
      .find(query)
      .populate('members reporter')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string) {
    const task = await this.taskModel
      .findById(id)
      .populate('members reporter comments.author')
      .exec();
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  findSubtasks(parentId: string) {
    return this.taskModel.find({ parentTask: parentId }).populate('members').exec();
  }

  async update(id: string, dto: UpdateTaskDto) {
    const task = await this.taskModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async remove(id: string) {
    const task = await this.taskModel.findByIdAndDelete(id).exec();
    if (!task) throw new NotFoundException('Task not found');
    return { deleted: true };
  }

  async addComment(id: string, dto: AddCommentDto, authorId: string) {
    const task = await this.taskModel.findById(id);
    if (!task) throw new NotFoundException('Task not found');
    task.comments.push({ author: authorId as any, text: dto.text, createdAt: new Date() });
    await task.save();
    return task;
  }
}
