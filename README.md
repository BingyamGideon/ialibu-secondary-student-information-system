# Ialibu Secondary School Management System

A comprehensive school management system built with PHP, MySQL, HTML, CSS, and JavaScript using XAMPP.

## 🚀 Features

- **User Authentication**: Admin and Staff login with role-based access
- **Student Management**: Complete student records with personal information
- **Attendance Tracking**: Record and monitor student attendance
- **Grade Management**: Track academic performance and assessments
- **Financial Records**: Manage school fees and payments (Kina currency)
- **Staff Administration**: Manage staff information and roles
- **Reports**: Generate and export various reports
- **Search Functionality**: Search across all modules
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: PHP 7.4+
- **Database**: MySQL 5.7+
- **Server**: Apache (XAMPP)
- **Icons**: Font Awesome 6.4.0

## 📋 Requirements

- XAMPP (Apache + MySQL + PHP)
- Web browser (Chrome, Firefox, Safari, Edge)
- Minimum 512MB RAM
- 100MB disk space

## 🔧 Installation Instructions

### Step 1: Install XAMPP

1. Download XAMPP from [https://www.apachefriends.org/](https://www.apachefriends.org/)
2. Install XAMPP on your computer
3. Start Apache and MySQL services from XAMPP Control Panel

### Step 2: Setup the Application

1. **Copy Project Files**:
   - Extract the project files to `C:\xampp\htdocs\ialibu_school\` (Windows)
   - Or `/Applications/XAMPP/htdocs/ialibu_school/` (Mac)
   - Or `/opt/lampp/htdocs/ialibu_school/` (Linux)

2. **Create Database**:
   - Open phpMyAdmin in your browser: `http://localhost/phpmyadmin`
   - Create a new database named `ialibu_school`
   - Import the SQL file: `database/school_management.sql`

3. **Configure Database Connection**:
   - Open `config/database.php`
   - Update database settings if needed (default XAMPP settings should work):
     ```php
     define('DB_HOST', 'localhost');
     define('DB_USERNAME', 'root');
     define('DB_PASSWORD', ''); // Empty for XAMPP
     define('DB_NAME', 'ialibu_school');
     ```

### Step 3: Access the Application

1. Open your web browser
2. Navigate to: `http://localhost/ialibu_school/`
3. You will be redirected to the login page

## 🔐 Default Login Credentials

### Administrator Access:
- **Username**: `admin`
- **Password**: `admin123`

### Staff Access:
- **Username**: `staff`
- **Password**: `staff123`

## 📁 Project Structure

```
ialibu_school/
├── config/
│   └── database.php          # Database configuration
├── assets/
│   ├── css/
│   │   └── style.css         # Main stylesheet
│   └── js/
│       ├── main.js           # Core JavaScript functions
│       └── admin.js          # Admin-specific functions
├── actions/
│   ├── save_student.php      # Student CRUD operations
│   ├── save_attendance.php   # Attendance operations
│   ├── save_grade.php        # Grade operations
│   ├── save_finance.php      # Finance operations
│   └── save_staff.php        # Staff operations
├── modals/
│   ├── student_modal.php     # Student form modal
│   ├── attendance_modal.php  # Attendance form modal
│   ├── grade_modal.php       # Grade form modal
│   ├── finance_modal.php     # Finance form modal
│   └── staff_modal.php       # Staff form modal
├── database/
│   └── school_management.sql # Database schema and sample data
├── login.php                 # Login/Registration page
├── admin_dashboard.php       # Administrator dashboard
├── staff_dashboard.php       # Staff dashboard
├── logout.php                # Logout functionality
├── .htaccess                 # Apache configuration
└── README.md                 # This file
```

## 🔑 User Roles & Permissions

### Administrator Access:
- ✅ All student records
- ✅ All attendance records
- ✅ All academic grades
- ✅ **Financial management (Finance section)**
- ✅ **Staff administration (Staff section)**
- ✅ Comprehensive reports
- ✅ System settings

### Staff Access:
- ✅ Student records (view/edit)
- ✅ Attendance tracking
- ✅ Grade management
- ✅ Student reports
- ❌ Financial records (restricted)
- ❌ Staff management (restricted)

## 💰 Currency Configuration

The system uses **Kina (K)** as the default currency for all financial transactions:
- Payment records display as "K500.00"
- Financial reports show Kina amounts
- All monetary inputs accept Kina values

## 🔍 Key Features

### Search Functionality
- Real-time search across all data tables
- Multi-field search (name, grade, class, status, etc.)
- Instant filtering of results

### CRUD Operations
- **Create**: Add new records via modal forms
- **Read**: View data in organized tables
- **Update**: Edit existing records with pre-populated forms
- **Delete**: Remove records with confirmation

### Reports & Export
- Export data to CSV format
- Print-friendly report layouts
- Comprehensive student performance reports
- Attendance summaries
- Financial reports

## 🚨 Troubleshooting

### Common Issues:

1. **Database Connection Error**:
   - Ensure MySQL is running in XAMPP
   - Check database credentials in `config/database.php`
   - Verify database `ialibu_school` exists

2. **Permission Denied**:
   - Check file permissions in htdocs folder
   - Ensure Apache has read/write access

3. **Login Not Working**:
   - Verify users table has sample data
   - Check password hashing in database

4. **Styles Not Loading**:
   - Check file paths in HTML files
   - Ensure CSS files are in correct location
   - Clear browser cache

### Database Reset:

If you need to reset the database:
1. Drop the `ialibu_school` database in phpMyAdmin
2. Create a new database with the same name
3. Re-import `database/school_management.sql`

## 🔐 Security Features

- Password hashing using PHP's `password_hash()`
- Session-based authentication
- Role-based access control
- SQL injection prevention with prepared statements
- XSS protection with `htmlspecialchars()`
- CSRF protection for forms

## 📱 Mobile Responsiveness

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern web browsers

## 🎨 Customization

### Changing School Information:
1. Edit the school name in login page headers
2. Update welcome text and descriptions
3. Modify color scheme in `assets/css/style.css`

### Adding New Subjects:
1. Update subject dropdowns in modal files
2. No database changes required

### Modifying User Roles:
1. Update database enum values if needed
2. Modify access control in `config/database.php`

## 📞 Support

For technical support or questions about the system:
1. Check the troubleshooting section above
2. Review the code comments for implementation details
3. Test with the provided sample data first

## 📄 License

This project is for educational purposes. Please ensure you have proper licensing for any production use.

---

**Ialibu Secondary School Management System** - Built with ❤️ using PHP, MySQL, HTML, CSS & JavaScript
