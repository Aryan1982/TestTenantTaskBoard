import { IsString, IsNotEmpty, MaxLength, IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '../../models/task.model';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsNotEmpty()
  status: TaskStatus;
}