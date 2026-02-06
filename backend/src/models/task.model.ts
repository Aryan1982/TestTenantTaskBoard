import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from './user.model';

export enum TaskStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'InProgress',
  DONE = 'Done',
}

@Table({
  tableName: 'Tasks',
  timestamps: true,
})
export class Task extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'Id',
  })
  Id: number;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
    field: 'Title',
  })
  Title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'Description',
  })
  Description: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: TaskStatus.PENDING,
    field: 'Status',
    validate: {
      isIn: [[TaskStatus.PENDING, TaskStatus.IN_PROGRESS, TaskStatus.DONE]],
    },
  })
  Status: TaskStatus;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'TenantId',
  })
  TenantId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'CreatedBy',
  })
  CreatedBy: number;

  @CreatedAt
  @Column({
    field: 'CreatedAt',
  })
  CreatedAt: Date;

  @UpdatedAt
  @Column({
    field: 'UpdatedAt',
  })
  UpdatedAt: Date;

  @BelongsTo(() => User, {
    foreignKey: 'CreatedBy',
    as: 'Creator',
  })
  Creator: User;
}