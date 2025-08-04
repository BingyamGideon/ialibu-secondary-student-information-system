# Ialibu Secondary School Management System

A comprehensive school management system built with React TypeScript, featuring authentication, student management, grade tracking, attendance management, and administrative tools designed specifically for Papua New Guinea secondary schools.

## 🎓 Features

### **Authentication & User Management**
- Secure login/registration system
- Role-based access (Admin & Staff)
- Session management with automatic expiry
- User profile management

### **Student Management**
- Complete student records (Grades 9-12, Classes A-H)
- Student enrollment and profile management
- Guardian/parent contact information
- Subject assignment and tracking

### **Advanced Grade Management**
- Papua New Guinea education standards (D: 85-100, C: 70-84, UP: 55-69, P: 40-54, F: <40)
- Comprehensive assessment system:
  - Weekly Tests (20%)
  - Projects (25%) 
  - Assignments (20%)
  - Take-Home Tests (15%)
  - Open-Book Tests (10%)
  - End-of-Term Tests (10%)
- Individual assessment score editing (CRUD operations)
- Real-time grade calculations
- Batch grade entry for entire classes

### **Attendance Management**
- Daily attendance tracking
- Class-wise attendance recording
- Attendance history and reports
- Late/absent/present status tracking

### **Administrative Features**
- Staff management
- Financial records and fee tracking
- Comprehensive reporting system
- User management (Admin only)
- Data backup and restore

## 🚀 How to Download and Setup on Your PC

### **Method 1: Download Project Files (Recommended)**

#### Step 1: Download the Project
1. If you have access to the source code repository, download it as a ZIP file
2. Extract the ZIP file to your desired location (e.g., `C:\Projects\ialibu-school-system`)

#### Step 2: Install Prerequisites
**Install Node.js:**
1. Visit [https://nodejs.org](https://nodejs.org)
2. Download and install Node.js (version 18 or higher)
3. Verify installation by opening Command Prompt/Terminal and running:
   ```bash
   node --version
   npm --version
   ```

**Install Git (Optional but recommended):**
1. Visit [https://git-scm.com](https://git-scm.com)
2. Download and install Git

#### Step 3: Setup the Project
1. Open Command Prompt or Terminal
2. Navigate to your project folder:
   ```bash
   cd C:\Projects\ialibu-school-system
   ```
   (Replace with your actual path)

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and go to: `http://localhost:5173`

### **Method 2: Clone from Repository (If Available)**

If the project is in a Git repository:

```bash
# Clone the repository
git clone [repository-url]

# Navigate to project folder
cd ialibu-school-system

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📁 Project Structure

```
ialibu-school-system/
├── client/                     # Frontend React application
│   ├── components/             # Reusable UI components
│   │   └── ui/                # UI component library
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.ts         # Authentication hook
│   │   ├── useDataStore.ts    # Data management hook
│   │   └── use-toast.ts       # Toast notification hook
│   ├── lib/                   # Utility libraries
│   │   ├── authStore.ts       # Authentication management
│   │   ├── dataStore.ts       # Data storage and management
│   │   └── utils.ts           # Utility functions
│   ├── pages/                 # Page components
│   │   ├── Index.tsx          # Login/Registration page
│   │   ├── AdminDashboard.tsx # Administrator dashboard
│   │   ├── StaffDashboard.tsx # Staff member dashboard
│   │   └── NotFound.tsx       # 404 error page
│   ├── App.tsx                # Main application component
│   └── global.css             # Global styles
├── database/                  # Database schema and setup
│   ├── full_schema.sql        # Complete database schema
│   └── school_management.sql  # Basic database structure
├── public/                    # Static assets
├── package.json               # Dependencies and scripts
├── vite.config.ts            # Vite configuration
├── tailwind.config.ts        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## 🔧 Development Setup

### **Available Scripts**

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

### **Environment Configuration**

Create a `.env` file in the project root for environment variables:

```env
# Database Configuration (for future backend integration)
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=ialibu_school_management

# Application Settings
NODE_ENV=development
PORT=5173
```

## 👥 Default User Accounts

### **Administrator Account**
- **Username:** `admin`
- **Password:** `admin123`
- **Access:** Full system access, user management, all reports

### **Staff Account**
- **Username:** `staff`
- **Password:** `staff123`
- **Access:** Students, attendance, grades, reports

## 📚 How to Use the System

### **For Staff Members:**
1. **Login** with staff credentials
2. **View Students** - See all students in your assigned classes
3. **Take Attendance** - Record daily attendance for your classes
4. **Manage Grades** - Enter and edit assessment scores:
   - Use individual grade entry for single students
   - Use batch entry for entire classes
   - Edit existing grades by clicking the pencil icon
   - Add/remove individual assessment scores
5. **Generate Reports** - Create student report cards

### **For Administrators:**
1. **Login** with admin credentials
2. **User Management** - Create, edit, delete system users
3. **Student Management** - Manage all student records
4. **Staff Management** - Manage staff information
5. **Financial Management** - Track fees and payments
6. **System Reports** - Generate comprehensive reports
7. **Data Management** - Backup and restore system data

## 🎯 Grade Management Features

### **Assessment Components:**
- **Weekly Tests (20%)** - Regular classroom assessments
- **Projects (25%)** - Long-term assignments and projects  
- **Assignments (20%)** - Homework and class assignments
- **Take-Home Tests (15%)** - Tests completed at home
- **Open-Book Tests (10%)** - Reference-allowed assessments
- **End-of-Term Tests (10%)** - Final examinations

### **Grade Editing Features:**
- **Individual Score Management** - Add, edit, remove individual assessment scores
- **Real-time Calculations** - Automatic total and letter grade updates
- **Flexible Assessment Numbers** - Support 1-10 assessments per component
- **Visual Feedback** - Color-coded components and progress indicators

## 🗄️ Data Storage

### **Current Implementation:**
- **localStorage** - Client-side data storage for development
- **Real-time sync** - Data synchronized across browser tabs
- **Data persistence** - Survives browser restarts

### **Production Ready:**
- **Database Schema** - Complete SQL schema provided
- **API Integration Points** - Ready for backend implementation
- **Authentication System** - Scalable user management

## 🔒 Security Features

- **Session Management** - Automatic session expiry
- **Role-based Access** - Different permissions for Admin/Staff
- **Input Validation** - Form validation and data sanitization
- **Password Requirements** - Minimum 6 characters
- **Audit Ready** - Tracking system for user actions

## 🚀 Deployment Options

### **Local Development:**
```bash
npm run dev
# Access at http://localhost:5173
```

### **Production Build:**
```bash
npm run build
# Creates optimized build in 'dist' folder
```

### **Web Hosting:**
- Upload the `dist` folder to any web hosting service
- Works with Netlify, Vercel, GitHub Pages, etc.

## 🔧 Troubleshooting

### **Common Issues:**

**1. Node.js Version Error:**
- Ensure Node.js version 18 or higher is installed
- Run `node --version` to check

**2. Dependencies Installation Failed:**
- Delete `node_modules` folder and `package-lock.json`
- Run `npm install` again

**3. Port Already in Use:**
- The development server will automatically find an available port
- Or specify a different port: `npm run dev -- --port 3000`

**4. Data Not Loading:**
- Click "Reload Sample Data" button in the dashboard header
- This will restore all sample data including students, grades, etc.

**5. Browser Compatibility:**
- Use modern browsers (Chrome, Firefox, Safari, Edge)
- Enable JavaScript if disabled

## 📞 Support

### **Getting Help:**
1. Check this README for common solutions
2. Review the database schema in `database/full_schema.sql`
3. Check the browser console for error messages
4. Ensure all dependencies are properly installed

### **System Requirements:**
- **Node.js:** Version 18 or higher
- **RAM:** Minimum 4GB recommended
- **Browser:** Modern browser with JavaScript enabled
- **Storage:** ~500MB for development setup

## 📈 Future Enhancements

- **Backend Integration** - REST API with database
- **Real-time Notifications** - WebSocket implementation
- **Mobile App** - React Native version
- **Advanced Reporting** - PDF generation and email
- **Backup System** - Automated data backups
- **Multi-language Support** - Local language options

---

## 🎉 Quick Start Summary

1. **Download** the project files
2. **Install Node.js** from nodejs.org
3. **Open Terminal/Command Prompt**
4. **Navigate** to project folder: `cd your-project-path`
5. **Install dependencies:** `npm install`
6. **Start server:** `npm run dev`
7. **Open browser:** Go to `http://localhost:5173`
8. **Login:** Use `admin/admin123` or `staff/staff123`

**That's it! You now have the complete school management system running on your PC.**

## 📄 License

This project is designed specifically for Ialibu Secondary School and follows Papua New Guinea education standards.

---

**Note:** This system uses localStorage for development. For production use with multiple users, implement the provided database schema and backend API integration points.
