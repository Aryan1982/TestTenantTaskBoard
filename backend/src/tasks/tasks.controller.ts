import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantId } from '../common/decorators/tenant-id.decorator';
import {
  CurrentUser,
  JwtPayload,
} from '../common/decorators/current-user.decorator';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@TenantId() tenantId: number) {
    return this.tasksService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @TenantId() tenantId: number) {
    return this.tasksService.findOne(id, tenantId);
  }

  @Post()
  create(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: JwtPayload,
    @TenantId() tenantId: number,
  ) {
    return this.tasksService.create(createTaskDto, user.userId, tenantId);
  }

  @Patch(':id')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @TenantId() tenantId: number,
  ) {
    return this.tasksService.updateStatus(id, updateTaskStatusDto, tenantId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @TenantId() tenantId: number) {
    return this.tasksService.remove(id, tenantId);
  }
}