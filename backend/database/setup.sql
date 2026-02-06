-- =============================================
-- NestJS Tasks Backend - Database Setup Script
-- For Microsoft SQL Server
-- =============================================

-- Create database if it doesn't exist
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'TasksDB')
BEGIN
    CREATE DATABASE TasksDB;
    PRINT 'Database TasksDB created successfully.';
END
GO

USE TasksDB;
GO

-- =============================================
-- Create Users Table
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Username NVARCHAR(100) NOT NULL UNIQUE,
        Email NVARCHAR(255) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(255) NOT NULL,
        Role NVARCHAR(50) NOT NULL DEFAULT 'User',
        TenantId INT NOT NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE()
    );
    
    CREATE INDEX IX_Users_TenantId ON Users(TenantId);
    CREATE INDEX IX_Users_Username ON Users(Username);
    
    PRINT 'Users table created successfully.';
END
GO

-- =============================================
-- Create Tasks Table
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Tasks')
BEGIN
    CREATE TABLE Tasks (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Title NVARCHAR(200) NOT NULL,
        Description NVARCHAR(MAX) NULL,
        Status NVARCHAR(50) NOT NULL DEFAULT 'Pending',
        TenantId INT NOT NULL,
        CreatedBy INT NOT NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
        
        CONSTRAINT FK_Tasks_CreatedBy FOREIGN KEY (CreatedBy) 
            REFERENCES Users(Id),
        CONSTRAINT CHK_Tasks_Status CHECK (Status IN ('Pending', 'InProgress', 'Done'))
    );
    
    CREATE INDEX IX_Tasks_TenantId ON Tasks(TenantId);
    CREATE INDEX IX_Tasks_CreatedBy ON Tasks(CreatedBy);
    CREATE INDEX IX_Tasks_Status ON Tasks(Status);
    
    PRINT 'Tasks table created successfully.';
END
GO

-- =============================================
-- Seed Data
-- =============================================

-- Insert admin user (password: admin123)
-- Note: This is a bcrypt hash of "admin123"
IF NOT EXISTS (SELECT * FROM Users WHERE Username = 'admin')
BEGIN
    INSERT INTO Users (Username, Email, PasswordHash, Role, TenantId, CreatedAt, UpdatedAt)
    VALUES (
        'admin',
        'admin@example.com',
        '$2b$10$YourBcryptHashHere', -- Replace with actual bcrypt hash from seed script
        'Admin',
        1,
        GETDATE(),
        GETDATE()
    );
    
    PRINT 'Admin user created. Username: admin, Password: admin123';
END
GO

-- Insert sample tasks
DECLARE @AdminUserId INT = (SELECT Id FROM Users WHERE Username = 'admin');

IF @AdminUserId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT * FROM Tasks WHERE Title = 'Complete project setup')
    BEGIN
        INSERT INTO Tasks (Title, Description, Status, CreatedBy, TenantId, CreatedAt, UpdatedAt)
        VALUES 
        (
            'Complete project setup',
            'Set up the NestJS backend with MSSQL and Sequelize',
            'Done',
            @AdminUserId,
            1,
            GETDATE(),
            GETDATE()
        ),
        (
            'Implement authentication',
            'Add JWT-based authentication with bcrypt password hashing',
            'Done',
            @AdminUserId,
            1,
            GETDATE(),
            GETDATE()
        ),
        (
            'Create task management endpoints',
            'Build CRUD endpoints for task management with tenant filtering',
            'InProgress',
            @AdminUserId,
            1,
            GETDATE(),
            GETDATE()
        ),
        (
            'Add validation and error handling',
            'Implement proper validation using class-validator and error responses',
            'Pending',
            @AdminUserId,
            1,
            GETDATE(),
            GETDATE()
        ),
        (
            'Write API documentation',
            'Document all API endpoints with examples and response formats',
            'Pending',
            @AdminUserId,
            1,
            GETDATE(),
            GETDATE()
        );
        
        PRINT 'Sample tasks created successfully.';
    END
END
GO

-- =============================================
-- Verify Data
-- =============================================
PRINT 'Database setup completed!';
PRINT '';
PRINT 'Users count: ' + CAST((SELECT COUNT(*) FROM Users) AS NVARCHAR(10));
PRINT 'Tasks count: ' + CAST((SELECT COUNT(*) FROM Tasks) AS NVARCHAR(10));
PRINT '';
PRINT 'Login credentials:';
PRINT '  Username: admin';
PRINT '  Password: admin123';
PRINT '  Tenant ID: 1';
GO

-- =============================================
-- Query Examples
-- =============================================

-- View all users
-- SELECT * FROM Users;

-- View all tasks with creator information
-- SELECT 
--     t.Id,
--     t.Title,
--     t.Description,
--     t.Status,
--     t.TenantId,
--     u.Username AS CreatedByUsername,
--     t.CreatedAt
-- FROM Tasks t
-- INNER JOIN Users u ON t.CreatedBy = u.Id
-- WHERE t.TenantId = 1
-- ORDER BY t.CreatedAt DESC;