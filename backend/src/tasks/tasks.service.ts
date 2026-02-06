import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from '../models/task.model';
import { User } from '../models/user.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task)
    private taskModel: typeof Task,
  ) {}

  async findAll(tenantId: number): Promise<Task[]> {
    return this.taskModel.findAll({
      where: { TenantId: tenantId },
      include: [
        {
          model: User,
          as: 'Creator',
          attributes: ['Id', 'Username', 'Email'],
        },
      ],
      order: [['CreatedAt', 'DESC']],
    });
  }

  async findOne(id: number, tenantId: number): Promise<Task> {
    const task = await this.taskModel.findOne({
      where: {
        Id: id,
        TenantId: tenantId,
      },
      include: [
        {
          model: User,
          as: 'Creator',
          attributes: ['Id', 'Username', 'Email'],
        },
      ],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async create(
    createTaskDto: CreateTaskDto,
    userId: number,
    tenantId: number,
  ): Promise<Task> {
    const task = await this.taskModel.create({
      Title: createTaskDto.title,
      Description: createTaskDto.description,
      Status: createTaskDto.status,
      CreatedBy: userId,
      TenantId: tenantId,
    });

    return this.findOne(task.Id, tenantId);
  }

  async updateStatus(
    id: number,
    updateTaskStatusDto: UpdateTaskStatusDto,
    tenantId: number,
  ): Promise<Task> {
    const task = await this.findOne(id, tenantId);

    await task.update({
      Status: updateTaskStatusDto.status,
    });

    return this.findOne(id, tenantId);
  }

  async remove(id: number, tenantId: number): Promise<void> {
    const task = await this.findOne(id, tenantId);
    await task.destroy();
  }
}