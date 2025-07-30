-- Ialibu Secondary School Management System Database
-- Create database
CREATE DATABASE IF NOT EXISTS ialibu_school;
USE ialibu_school;

-- Users table for authentication
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('admin', 'staff') NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students table
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    grade ENUM('Grade 9', 'Grade 10', 'Grade 11', 'Grade 12') NOT NULL,
    class ENUM('A', 'B') NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    address TEXT NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    parent_name VARCHAR(100),
    parent_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Attendance table
CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    status ENUM('Present', 'Absent', 'Late') NOT NULL,
    subject VARCHAR(50) NOT NULL,
    notes TEXT,
    recorded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (recorded_by) REFERENCES users(id),
    UNIQUE KEY unique_attendance (student_id, attendance_date, subject)
);

-- Grades table
CREATE TABLE grades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject VARCHAR(50) NOT NULL,
    assignment_name VARCHAR(100) NOT NULL,
    letter_grade ENUM('A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F') NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    term ENUM('Term 1', 'Term 2', 'Term 3') NOT NULL,
    recorded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (recorded_by) REFERENCES users(id)
);

-- Finance table
CREATE TABLE finance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    description VARCHAR(200) NOT NULL,
    status ENUM('Paid', 'Pending') NOT NULL,
    payment_method VARCHAR(50),
    recorded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (recorded_by) REFERENCES users(id)
);

-- Staff table
CREATE TABLE staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    staff_name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    department ENUM('Administration', 'Academics', 'Sports', 'Library', 'Maintenance') NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    salary DECIMAL(10,2),
    hire_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, password, user_type, full_name, email) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Administrator', 'admin@ialibu.edu'),
('staff', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'staff', 'Staff Member', 'staff@ialibu.edu');

-- Insert sample students
INSERT INTO students (student_name, grade, class, date_of_birth, gender, address, email, phone) VALUES
('John Doe', 'Grade 9', 'A', '2007-05-15', 'Male', '123 Main St, Ialibu', 'john.doe@example.com', '123-456-7890'),
('Jane Smith', 'Grade 9', 'A', '2008-03-22', 'Female', '456 Oak Ave, Ialibu', 'jane.smith@example.com', '123-456-7891'),
('Michael Johnson', 'Grade 10', 'B', '2006-11-08', 'Male', '789 Pine Rd, Ialibu', 'michael.johnson@example.com', '123-456-7892'),
('Emily Williams', 'Grade 10', 'A', '2007-07-12', 'Female', '101 Maple St, Ialibu', 'emily.williams@example.com', '123-456-7893'),
('David Brown', 'Grade 11', 'A', '2005-09-25', 'Male', '202 Elm St, Ialibu', 'david.brown@example.com', '123-456-7894'),
('Sarah Davis', 'Grade 11', 'B', '2006-01-30', 'Female', '303 Cedar St, Ialibu', 'sarah.davis@example.com', '123-456-7895');

-- Insert sample attendance
INSERT INTO attendance (student_id, attendance_date, status, subject, notes) VALUES
(1, '2024-01-15', 'Present', 'Mathematics', ''),
(2, '2024-01-15', 'Absent', 'Mathematics', 'Sick leave'),
(3, '2024-01-15', 'Late', 'Mathematics', '15 minutes late'),
(4, '2024-01-15', 'Present', 'Mathematics', ''),
(5, '2024-01-15', 'Present', 'Physics', ''),
(6, '2024-01-15', 'Present', 'Physics', '');

-- Insert sample grades
INSERT INTO grades (student_id, subject, assignment_name, letter_grade, percentage, term) VALUES
(1, 'Mathematics', 'Midterm Exam', 'A', 92.00, 'Term 1'),
(2, 'English', 'Essay Assignment', 'B', 85.00, 'Term 1'),
(3, 'Science', 'Lab Report', 'A-', 90.00, 'Term 1'),
(4, 'History', 'Research Project', 'B+', 87.00, 'Term 1'),
(5, 'Physics', 'Quiz 1', 'A', 94.00, 'Term 1'),
(6, 'Biology', 'Lab Practical', 'B+', 88.00, 'Term 1');

-- Insert sample finance records
INSERT INTO finance (student_id, amount, payment_date, description, status) VALUES
(1, 500.00, '2023-09-15', 'School Fees - Term 1', 'Paid'),
(2, 300.00, '2023-09-20', 'Book Fees', 'Pending'),
(3, 500.00, '2023-09-10', 'School Fees - Term 1', 'Paid'),
(4, 450.00, '2023-09-25', 'Uniform & Books', 'Paid'),
(5, 500.00, '2023-09-12', 'School Fees - Term 1', 'Paid'),
(6, 275.00, '2023-09-28', 'Lab Fees', 'Pending');

-- Insert sample staff
INSERT INTO staff (staff_name, position, department, email, phone, salary, hire_date) VALUES
('James Anderson', 'Principal', 'Administration', 'j.anderson@ialibu.edu', '123-456-7890', 80000.00, '2020-01-15'),
('Mary Taylor', 'Vice Principal', 'Administration', 'm.taylor@ialibu.edu', '123-456-7891', 70000.00, '2020-02-01'),
('Robert Thomas', 'Math Teacher', 'Academics', 'r.thomas@ialibu.edu', '123-456-7892', 50000.00, '2021-03-15'),
('Sarah Davis', 'English Teacher', 'Academics', 's.davis@ialibu.edu', '123-456-7893', 48000.00, '2021-08-20'),
('Michael Wilson', 'Science Teacher', 'Academics', 'm.wilson@ialibu.edu', '123-456-7894', 52000.00, '2022-01-10');
