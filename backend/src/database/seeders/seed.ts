import { Sequelize } from 'sequelize-typescript';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { User } from '../../models/user.model';
import { Task, TaskStatus } from '../../models/task.model';

// Load environment variables
dotenv.config();

async function seed() {
  // Initialize Sequelize
  const sequelize = new Sequelize({
    dialect: 'mssql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '1433'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    models: [User, Task],
    logging: false,
    dialectOptions: {
     options: {
        encrypt: true,
        trustServerCertificate: true
      }
    },
  });

  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync database (create tables if they don't exist)
    await sequelize.sync({ force: true });
    console.log('✅ Database synchronized.');

    // Clear existing data (optional - comment out if you want to keep existing data)
    await Task.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });
 
    console.log('✅ Existing data cleared.');

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user for tenant 1
    const adminUser = await User.create({
      Username: 'admin',
      Email: 'admin@example.com',
      PasswordHash: hashedPassword,
      Role: 'Admin',
      TenantId: 1,
    });

    console.log('✅ Admin user created:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   Tenant ID: 1');
    console.log('   Role: Admin');

    // Create sample tasks
    const tasks = [
      {
        Title: 'Complete project setup',
        Description: 'Set up the NestJS backend with MSSQL and Sequelize',
        Status: TaskStatus.DONE,
        CreatedBy: adminUser.Id,
        TenantId: 1,
      },
      {
        Title: 'Implement authentication',
        Description: 'Add JWT-based authentication with bcrypt password hashing',
        Status: TaskStatus.DONE,
        CreatedBy: adminUser.Id,
        TenantId: 1,
      },
      {
        Title: 'Create task management endpoints',
        Description: 'Build CRUD endpoints for task management with tenant filtering',
        Status: TaskStatus.IN_PROGRESS,
        CreatedBy: adminUser.Id,
        TenantId: 1,
      },
      {
        Title: 'Add validation and error handling',
        Description: 'Implement proper validation using class-validator and error responses',
        Status: TaskStatus.PENDING,
        CreatedBy: adminUser.Id,
        TenantId: 1,
      },
      {
        Title: 'Write API documentation',
        Description: 'Document all API endpoints with examples and response formats',
        Status: TaskStatus.PENDING,
        CreatedBy: adminUser.Id,
        TenantId: 1,
      },
    ];

    for (const taskData of tasks) {
      await Task.create(taskData);
    }

    console.log(`✅ ${tasks.length} sample tasks created.`);

    console.log('\n✨ Database seeding completed successfully!');
    console.log('\nYou can now login with:');
    console.log('  POST http://localhost:3001/api/auth/login');
    console.log('  Body: { "username": "admin", "password": "admin123" }');
    console.log('  Header: x-tenant-id: 1');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await sequelize.close();
    process.exit(1);
  }
}

seed();