-- Ialibu Secondary School Management System - Complete Database Schema
-- This schema supports the full authentication and dashboard functionality

-- Create database
CREATE DATABASE IF NOT EXISTS ialibu_school_management;
USE ialibu_school_management;

-- Users table for authentication and authorization
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Use bcrypt in production
    email VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    user_type ENUM('admin', 'staff') NOT NULL DEFAULT 'staff',
    department VARCHAR(100),
    position VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    permissions JSON, -- Store as JSON array for flexibility
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sessions table for managing user sessions
CREATE TABLE user_sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id INT NOT NULL,
    username VARCHAR(50) NOT NULL,
    user_type ENUM('admin', 'staff') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Students table
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    grade ENUM('Grade 9', 'Grade 10', 'Grade 11', 'Grade 12') NOT NULL,
    class VARCHAR(10) NOT NULL, -- e.g., '9A', '10B', etc.
    subjects JSON, -- Store as JSON array
    date_of_birth DATE NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    address TEXT NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    guardian_name VARCHAR(100),
    guardian_phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_grade_class (grade, class),
    INDEX idx_active (is_active)
);

-- Attendance records
CREATE TABLE attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL,
    student_id INT NOT NULL,
    student_name VARCHAR(100) NOT NULL, -- Denormalized for easier queries
    status ENUM('Present', 'Absent', 'Late') NOT NULL,
    subject VARCHAR(100) NOT NULL,
    notes TEXT,
    recorded_by INT NOT NULL, -- User ID of who recorded it
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (recorded_by) REFERENCES users(id),
    INDEX idx_date_student (date, student_id),
    INDEX idx_student_subject (student_id, subject),
    UNIQUE KEY unique_attendance (date, student_id, subject)
);

-- Grades table with array-based assessment system
CREATE TABLE grades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    student_name VARCHAR(100) NOT NULL, -- Denormalized for easier queries
    class VARCHAR(10) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    weekly_tests JSON, -- Array of scores
    projects JSON, -- Array of scores
    assignments JSON, -- Array of scores
    take_home_tests JSON, -- Array of scores
    open_book_tests JSON, -- Array of scores
    end_of_term_tests JSON, -- Array of scores
    total_marks DECIMAL(5,2) NOT NULL,
    letter_grade CHAR(2) NOT NULL, -- D, C, UP, P, F
    term ENUM('Term 1', 'Term 2', 'Term 3', 'Term 4') NOT NULL,
    academic_year VARCHAR(9) DEFAULT '2024', -- e.g., '2024'
    recorded_by INT NOT NULL, -- User ID of who recorded it
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (recorded_by) REFERENCES users(id),
    INDEX idx_student_subject_term (student_id, subject, term),
    INDEX idx_class_subject (class, subject),
    UNIQUE KEY unique_grade (student_id, subject, term, academic_year)
);

-- Finance records
CREATE TABLE finance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    student_name VARCHAR(100) NOT NULL, -- Denormalized for easier queries
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    status ENUM('Paid', 'Pending', 'Overdue') NOT NULL DEFAULT 'Pending',
    description TEXT NOT NULL,
    payment_method ENUM('Cash', 'Bank Transfer', 'Cheque', 'Other'),
    receipt_number VARCHAR(50),
    recorded_by INT NOT NULL, -- User ID of who recorded it
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (recorded_by) REFERENCES users(id),
    INDEX idx_student_status (student_id, status),
    INDEX idx_date_status (date, status)
);

-- Staff members table (separate from users for additional staff info)
CREATE TABLE staff (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL, -- Link to users table if they have system access
    name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    salary DECIMAL(10,2),
    hire_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_department (department),
    INDEX idx_active (is_active)
);

-- Student reports for comprehensive report cards
CREATE TABLE student_reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    student_name VARCHAR(100) NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    grade ENUM('Grade 9', 'Grade 10', 'Grade 11', 'Grade 12') NOT NULL,
    class VARCHAR(10) NOT NULL,
    student_number VARCHAR(20) NOT NULL,
    term ENUM('Term 1', 'Term 2', 'Term 3', 'Term 4') NOT NULL,
    academic_year VARCHAR(9) NOT NULL,
    
    -- Financial Status
    financial_status ENUM('Clear', 'Not Cleared') DEFAULT 'Not Cleared',
    outstanding_amount DECIMAL(10,2) DEFAULT 0,
    
    -- Academic Performance
    gpa DECIMAL(3,2),
    class_rank INT,
    grade_rank INT,
    
    -- Attendance Record
    total_school_days INT DEFAULT 0,
    days_absent INT DEFAULT 0,
    days_present INT DEFAULT 0,
    attendance_percentage DECIMAL(5,2) DEFAULT 0,
    
    -- Comments and Signatures
    teacher_comments TEXT,
    class_teacher_signature VARCHAR(100),
    principal_signature VARCHAR(100),
    school_stamp BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_by INT NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_student_term_year (student_id, term, academic_year),
    INDEX idx_grade_class_term (grade, class, term),
    UNIQUE KEY unique_report (student_id, term, academic_year)
);

-- Audit log for tracking system changes
CREATE TABLE audit_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    username VARCHAR(50) NOT NULL,
    action ENUM('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT') NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_action (user_id, action),
    INDEX idx_table_record (table_name, record_id),
    INDEX idx_created_at (created_at)
);

-- Insert default admin user (password should be hashed in production)
INSERT INTO users (username, password_hash, email, first_name, last_name, user_type, department, position, permissions) VALUES
('admin', '$2b$10$example_hash_here', 'admin@ialibu.edu.pg', 'System', 'Administrator', 'admin', 'Administration', 'System Administrator', '["all"]'),
('staff', '$2b$10$example_hash_here', 'staff@ialibu.edu.pg', 'Demo', 'Teacher', 'staff', 'Academic', 'Teacher', '["students", "attendance", "grades", "reports"]');

-- Insert sample students data
INSERT INTO students (name, grade, class, subjects, date_of_birth, gender, address, email, phone, guardian_name, guardian_phone) VALUES
('John Doe', 'Grade 9', '9A', '["Mathematics", "English", "Science", "Social Science", "Business Studies", "Personal Development", "Religious Education", "Arts"]', '2007-05-15', 'Male', '123 Main St, Ialibu', 'john.doe@example.com', '123-456-7890', 'Robert Doe', '+675-234-5678'),
('Jane Smith', 'Grade 9', '9A', '["Mathematics", "English", "Science", "Social Science", "Information Technology", "Personal Development", "Arts", "Family and Consumer Studies"]', '2008-03-22', 'Female', '456 Oak Ave, Ialibu', 'jane.smith@example.com', '123-456-7891', 'Mary Smith', '+675-345-6789'),
('Michael Johnson', 'Grade 9', '9B', '["Mathematics", "English", "Science", "Business Studies", "Technology & Industrial Arts", "Personal Development", "Arts"]', '2006-11-08', 'Male', '789 Pine Rd, Ialibu', 'michael.johnson@example.com', '123-456-7892', 'James Johnson', '+675-456-7890');

-- Insert sample staff data
INSERT INTO staff (name, position, department, email, phone, salary) VALUES
('James Anderson', 'Principal', 'Administration', 'j.anderson@ialibu.edu.pg', '123-456-7890', 80000),
('Mary Taylor', 'Vice Principal', 'Administration', 'm.taylor@ialibu.edu.pg', '123-456-7891', 70000),
('Robert Thomas', 'Math Teacher', 'Science', 'r.thomas@ialibu.edu.pg', '123-456-7892', 50000);

-- Create views for common queries
CREATE VIEW active_students AS
SELECT * FROM students WHERE is_active = TRUE;

CREATE VIEW current_attendance AS
SELECT a.*, s.grade, s.class 
FROM attendance a 
JOIN students s ON a.student_id = s.id 
WHERE s.is_active = TRUE;

CREATE VIEW student_performance AS
SELECT 
    s.id,
    s.name,
    s.grade,
    s.class,
    COUNT(g.id) as total_subjects,
    AVG(g.total_marks) as average_score,
    COUNT(CASE WHEN g.letter_grade = 'D' THEN 1 END) as distinctions,
    COUNT(CASE WHEN g.letter_grade = 'C' THEN 1 END) as credits
FROM students s
LEFT JOIN grades g ON s.id = g.student_id
WHERE s.is_active = TRUE
GROUP BY s.id, s.name, s.grade, s.class;

-- Indexes for performance optimization
CREATE INDEX idx_students_grade_active ON students(grade, is_active);
CREATE INDEX idx_attendance_date_status ON attendance(date, status);
CREATE INDEX idx_grades_term_year ON grades(term, academic_year);
CREATE INDEX idx_finance_status_date ON finance(status, date);

-- Stored procedures for common operations

-- Procedure to calculate student GPA
DELIMITER //
CREATE PROCEDURE CalculateStudentGPA(IN student_id INT, IN term_name VARCHAR(10), IN academic_year VARCHAR(9))
BEGIN
    DECLARE total_points DECIMAL(10,2) DEFAULT 0;
    DECLARE total_subjects INT DEFAULT 0;
    DECLARE final_gpa DECIMAL(3,2);
    
    SELECT 
        SUM(CASE 
            WHEN letter_grade = 'D' THEN 4.0
            WHEN letter_grade = 'C' THEN 3.0
            WHEN letter_grade = 'UP' THEN 2.0
            WHEN letter_grade = 'P' THEN 1.0
            ELSE 0
        END) * COUNT(*),
        COUNT(*)
    INTO total_points, total_subjects
    FROM grades 
    WHERE student_id = student_id AND term = term_name AND academic_year = academic_year;
    
    IF total_subjects > 0 THEN
        SET final_gpa = total_points / total_subjects;
    ELSE
        SET final_gpa = 0;
    END IF;
    
    SELECT final_gpa as gpa, total_subjects;
END //
DELIMITER ;

-- Function to get letter grade from percentage
DELIMITER //
CREATE FUNCTION GetLetterGrade(percentage DECIMAL(5,2)) 
RETURNS CHAR(2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE grade CHAR(2);
    
    IF percentage >= 85 THEN
        SET grade = 'D';
    ELSEIF percentage >= 70 THEN
        SET grade = 'C';
    ELSEIF percentage >= 55 THEN
        SET grade = 'UP';
    ELSEIF percentage >= 40 THEN
        SET grade = 'P';
    ELSE
        SET grade = 'F';
    END IF;
    
    RETURN grade;
END //
DELIMITER ;
