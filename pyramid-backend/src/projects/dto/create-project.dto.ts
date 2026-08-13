import { IsDateString, IsEnum, IsMongoId, IsOptional, IsString, MinLength } from 'class-validator';
import { TaskPriority } from '../../tasks/dto/create-task.dto';

export class CreateProjectDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsMongoId()
  lead?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
