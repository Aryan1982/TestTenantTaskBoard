import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../models/user.model';
import { Task } from '../models/task.model';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dialect: 'mssql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        models: [User, Task],
        autoLoadModels: true,
        synchronize: true, // Set to false in production
        dialectOptions: {
          options: {
            encrypt: false, // Set to true if using Azure SQL
            trustServerCertificate: true, // Set to false in production
          },
        },
        logging: configService.get<string>('NODE_ENV') === 'development' ? console.log : false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}