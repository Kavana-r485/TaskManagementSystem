import { Priority } from './task';

export interface Project {
  _id: string;
  name: string;
  priority: Priority;
  lead?: { _id: string; fullName: string };
  dueDate?: string;
  createdAt: string;
}
