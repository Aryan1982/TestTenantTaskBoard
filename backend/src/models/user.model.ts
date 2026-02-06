import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Task } from './task.model';

@Table({
  tableName: 'Users',
  timestamps: true,
})
export class User extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'Id',
  })
  Id: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
    field: 'Username',
  })
  Username: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
    field: 'Email',
  })
  Email: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'PasswordHash',
  })
  PasswordHash: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: 'User',
    field: 'Role',
  })
  Role: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'TenantId',
  })
  TenantId: number;

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

  @HasMany(() => Task, {
    foreignKey: 'CreatedBy',
    as: 'Tasks',
  })
  Tasks: Task[];
}