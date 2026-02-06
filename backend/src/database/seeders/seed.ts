import { Sequelize } from "sequelize-typescript";
import * as dotenv from "dotenv";
import * as bcrypt from "bcrypt";
import { User } from "../../models/user.model";
import { Task, TaskStatus } from "../../models/task.model";

// Load environment variables
dotenv.config();

async function seed() {
  // Initialize Sequelize
  const sequelize = new Sequelize({
    dialect: "mssql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "1433"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    models: [User, Task],
    logging: false,
    dialectOptions: {
      options: {
        encrypt: true,
        trustServerCertificate: true,
      },
    },
  });

  try {
    // Test connection
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    // Sync database (create tables if they don't exist)
    await sequelize.sync({ force: true });
    console.log("✅ Database synchronized.");

    // Clear existing data (optional - comment out if you want to keep existing data)
    await Task.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });

    console.log("✅ Existing data cleared.");

    // Hash password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // -------- TENANT 1 USER --------
    const adminUser = await User.create({
      Username: "admin",
      Email: "admin@acme.com",
      PasswordHash: hashedPassword,
      Role: "admin",
      TenantId: 1,
    });

    // -------- TENANT 2 USER --------
    const memberUser = await User.create({
      Username: "user",
      Email: "user@beta.com",
      PasswordHash: hashedPassword,
      Role: "member",
      TenantId: 2,
    });

    console.log("✅ Users created");

    console.log("✅ Admin user created:");
    console.log("   Username: admin");
    console.log("   Password: admin123");
    console.log("   Tenant ID: 1");
    console.log("   Role: Admin");

    // Create sample tasks
    const tasks = [
      // -------- TENANT 1 TASKS --------
      {
        Title: "Fix login bug",
        Status: TaskStatus.IN_PROGRESS,
        CreatedBy: adminUser.Id,
        TenantId: 1,
      },
      {
        Title: "Write unit tests",
        Status: TaskStatus.PENDING,
        CreatedBy: adminUser.Id,
        TenantId: 1,
      },
      {
        Title: "Deploy v2",
        Status: TaskStatus.DONE,
        CreatedBy: adminUser.Id,
        TenantId: 1,
      },

      // -------- TENANT 2 TASKS --------
      {
        Title: "Design landing page",
        Status: TaskStatus.PENDING,
        CreatedBy: memberUser.Id,
        TenantId: 2,
      },
      {
        Title: "Set up CI pipeline",
        Status: TaskStatus.IN_PROGRESS,
        CreatedBy: memberUser.Id,
        TenantId: 2,
      },
    ];

    await Task.bulkCreate(tasks);

    console.log(`✅ ${tasks.length} tasks created across 2 tenants`);

    for (const taskData of tasks) {
      await Task.create(taskData);
    }

    console.log(`✅ ${tasks.length} sample tasks created.`);

    console.log("\n✨ Database seeding completed successfully!");
    console.log("\nYou can now login with:");
    console.log("  POST http://localhost:3001/api/auth/login");
    console.log('  Body: { "username": "admin", "password": "admin123" }');
    console.log("  Header: x-tenant-id: 1");

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    await sequelize.close();
    process.exit(1);
  }
}

seed();
