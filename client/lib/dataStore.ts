// Shared data store for real-time synchronization between dashboards
interface Student {
  id: number;
  name: string;
  grade: string;
  class: string;
  subjects: string[];
  dob: string;
  gender: string;
  address: string;
  email?: string;
  phone?: string;
  guardianName?: string;
  guardianPhone?: string;
}

interface Attendance {
  id: number;
  date: string;
  studentId: number;
  studentName: string;
  status: 'Present' | 'Absent' | 'Late';
  subject: string;
  notes?: string;
}

interface Grade {
  id: number;
  studentId: number;
  studentName: string;
  subject: string;
  score: string;
  percentage: number;
  term: string;
  assignment: string;
}

interface Finance {
  id: number;
  studentId: number;
  studentName: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending';
  description: string;
}

interface Staff {
  id: number;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  salary?: number;
}

interface StudentReport {
  id: number;
  studentId: number;
  studentName: string;
  gender: string;
  grade: string;
  class: string;
  studentID: string;
  term: string;
  academicYear: string;
  // Financial Status
  financialStatus: 'Clear' | 'Not Cleared';
  outstandingAmount: number;
  // Academic Performance
  gpa: number;
  // Attendance Record
  totalSchoolDays: number;
  daysAbsent: number;
  daysPresent: number;
  attendancePercentage: number;
  // Comments and Signatures
  teacherComments: string;
  classTeacherSignature: string;
  principalSignature: string;
  schoolStamp: boolean;
  createdBy: string;
  createdDate: string;
  lastModified: string;
}

interface DataState {
  students: Student[];
  attendance: Attendance[];
  grades: Grade[];
  finance: Finance[];
  staff: Staff[];
  reports: StudentReport[];
  lastUpdated: string;
  version: number;
}

type DataChangeListener = (data: DataState) => void;

class DataStore {
  private data: DataState;
  private listeners: DataChangeListener[] = [];
  private storageKey = 'school_management_data';

  constructor() {
    this.data = this.loadFromStorage();
    
    // Listen for storage changes from other tabs/windows
    window.addEventListener('storage', (e) => {
      if (e.key === this.storageKey) {
        const newData = this.loadFromStorage();
        if (newData.version > this.data.version) {
          this.data = newData;
          this.notifyListeners();
        }
      }
    });
  }

  private loadFromStorage(): DataState {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading data from storage:', error);
    }

    // Default data if nothing in storage
    return {
      students: [
        { id: 1, name: 'John Doe', grade: 'Grade 9', class: '9A', subjects: ['Mathematics', 'English', 'Science', 'Social Science', 'Business Studies', 'Personal Development', 'Religious Education', 'Arts'], dob: '2007-05-15', gender: 'Male', address: '123 Main St, Ialibu', email: 'john.doe@example.com', phone: '123-456-7890', guardianName: 'Robert Doe', guardianPhone: '+675-234-5678' },
        { id: 2, name: 'Jane Smith', grade: 'Grade 9', class: '9A', subjects: ['Mathematics', 'English', 'Science', 'Social Science', 'Information Technology', 'Personal Development', 'Arts', 'Family and Consumer Studies'], dob: '2008-03-22', gender: 'Female', address: '456 Oak Ave, Ialibu', email: 'jane.smith@example.com', phone: '123-456-7891', guardianName: 'Mary Smith', guardianPhone: '+675-345-6789' },
        { id: 3, name: 'Michael Johnson', grade: 'Grade 9', class: '9B', subjects: ['Mathematics', 'English', 'Science', 'Business Studies', 'Technology & Industrial Arts', 'Personal Development', 'Arts'], dob: '2006-11-08', gender: 'Male', address: '789 Pine Rd, Ialibu', email: 'michael.johnson@example.com', phone: '123-456-7892', guardianName: 'James Johnson', guardianPhone: '+675-456-7890' },
        { id: 4, name: 'Emily Williams', grade: 'Grade 10', class: '10A', subjects: ['Mathematics', 'English', 'Science', 'Social Science', 'Business Studies', 'Information Technology', 'Arts', 'Personal Development'], dob: '2007-07-12', gender: 'Female', address: '101 Maple St, Ialibu', email: 'emily.williams@example.com', phone: '123-456-7893', guardianName: 'Patricia Williams', guardianPhone: '+675-567-8901' },
        { id: 5, name: 'David Brown', grade: 'Grade 10', class: '10B', subjects: ['Mathematics', 'English', 'Science', 'Social Science', 'Technology & Industrial Arts', 'Personal Development', 'Family and Consumer Studies'], dob: '2006-09-20', gender: 'Male', address: '202 Cedar Ln, Ialibu', email: 'david.brown@example.com', phone: '123-456-7894', guardianName: 'Susan Brown', guardianPhone: '+675-678-9012' },
        { id: 6, name: 'Sarah Davis', grade: 'Grade 11', class: '11A', subjects: ['Language and Literature', 'General Mathematics', 'Biology', 'Chemistry', 'Physics', 'Economics', 'Geography', 'Personal Development'], dob: '2005-12-03', gender: 'Female', address: '303 Birch St, Ialibu', email: 'sarah.davis@example.com', phone: '123-456-7895', guardianName: 'Mark Davis', guardianPhone: '+675-789-0123' },
        { id: 7, name: 'Chris Wilson', grade: 'Grade 11', class: '11C', subjects: ['Language and Literature', 'General Mathematics', 'Chemistry', 'Biology', 'Economics', 'History', 'Legal Studies', 'Personal Development'], dob: '2005-08-17', gender: 'Male', address: '404 Elm Ave, Ialibu', email: 'chris.wilson@example.com', phone: '123-456-7896', guardianName: 'Linda Wilson', guardianPhone: '+675-890-1234' },
        { id: 8, name: 'Lisa Anderson', grade: 'Grade 12', class: '12A', subjects: ['Language and Literature', 'Advanced Mathematics', 'Biology', 'Chemistry', 'Physics', 'Economics', 'Business Studies', 'Accounting'], dob: '2004-04-25', gender: 'Female', address: '505 Spruce Rd, Ialibu', email: 'lisa.anderson@example.com', phone: '123-456-7897', guardianName: 'Karen Anderson', guardianPhone: '+675-901-2345' },
        { id: 9, name: 'Kevin Taylor', grade: 'Grade 12', class: '12B', subjects: ['Language and Literature', 'Advanced Mathematics', 'Physics', 'Chemistry', 'Economics', 'Business Studies', 'Computer Studies', 'Tourism Studies'], dob: '2004-07-10', gender: 'Male', address: '606 Willow St, Ialibu', email: 'kevin.taylor@example.com', phone: '123-456-7898', guardianName: 'Michelle Taylor', guardianPhone: '+675-012-3456' },
        { id: 10, name: 'Amy Martinez', grade: 'Grade 9', class: '9C', subjects: ['Mathematics', 'English', 'Science', 'Social Science', 'Arts', 'Personal Development', 'Religious Education', 'Information Technology'], dob: '2007-02-14', gender: 'Female', address: '707 Oak Hill, Ialibu', email: 'amy.martinez@example.com', phone: '123-456-7899', guardianName: 'Carlos Martinez', guardianPhone: '+675-123-4567' },
      ],
      attendance: [
        { id: 1, date: '2024-01-15', studentId: 1, studentName: 'John Doe', status: 'Present', subject: 'Mathematics', notes: '' },
        { id: 2, date: '2024-01-15', studentId: 2, studentName: 'Jane Smith', status: 'Absent', subject: 'Mathematics', notes: 'Sick leave' },
        { id: 3, date: '2024-01-15', studentId: 3, studentName: 'Michael Johnson', status: 'Late', subject: 'Mathematics', notes: '15 minutes late' },
        { id: 4, date: '2024-01-15', studentId: 4, studentName: 'Emily Williams', status: 'Present', subject: 'Mathematics', notes: '' },
        { id: 5, date: '2024-01-15', studentId: 5, studentName: 'David Brown', status: 'Present', subject: 'English', notes: '' },
        { id: 6, date: '2024-01-15', studentId: 6, studentName: 'Sarah Davis', status: 'Present', subject: 'Physics', notes: '' },
        { id: 7, date: '2024-01-15', studentId: 7, studentName: 'Chris Wilson', status: 'Absent', subject: 'Chemistry', notes: 'Medical appointment' },
        { id: 8, date: '2024-01-15', studentId: 8, studentName: 'Lisa Anderson', status: 'Present', subject: 'Biology', notes: '' },
      ],
      grades: [
        { id: 1, studentId: 1, studentName: 'John Doe', subject: 'Mathematics', score: 'D', percentage: 92, term: 'Term 1', assignment: 'Midterm Exam' },
        { id: 2, studentId: 2, studentName: 'Jane Smith', subject: 'English', score: 'C', percentage: 85, term: 'Term 1', assignment: 'Essay Assignment' },
        { id: 3, studentId: 3, studentName: 'Michael Johnson', subject: 'Mathematics', score: 'P', percentage: 90, term: 'Term 1', assignment: 'Lab Report' },
        { id: 4, studentId: 4, studentName: 'Emily Williams', subject: 'History', score: 'UP', percentage: 87, term: 'Term 1', assignment: 'Research Project' },
        { id: 5, studentId: 5, studentName: 'David Brown', subject: 'English', score: 'UP', percentage: 88, term: 'Term 1', assignment: 'Literature Analysis' },
        { id: 6, studentId: 6, studentName: 'Sarah Davis', subject: 'Physics', score: 'P', percentage: 91, term: 'Term 1', assignment: 'Physics Lab' },
        { id: 7, studentId: 7, studentName: 'Chris Wilson', subject: 'Chemistry', score: 'C', percentage: 84, term: 'Term 1', assignment: 'Chemical Reactions' },
        { id: 8, studentId: 8, studentName: 'Lisa Anderson', subject: 'Biology', score: 'D', percentage: 96, term: 'Term 1', assignment: 'Cell Biology Project' },
        { id: 9, studentId: 1, studentName: 'John Doe', subject: 'English', score: 'C', percentage: 78, term: 'Term 4', assignment: 'Final Exam' },
        { id: 10, studentId: 2, studentName: 'Jane Smith', subject: 'Science', score: 'UP', percentage: 82, term: 'Term 4', assignment: 'Final Project' },
        { id: 11, studentId: 3, studentName: 'Michael Johnson', subject: 'Mathematics', score: 'D', percentage: 89, term: 'Term 4', assignment: 'Final Exam' },
        { id: 12, studentId: 4, studentName: 'Emily Williams', subject: 'History', score: 'P', percentage: 85, term: 'Term 4', assignment: 'Year-end Assessment' },
      ],
      finance: [
        { id: 1, studentId: 1, studentName: 'John Doe', amount: 500, date: '2023-09-15', status: 'Paid', description: 'School Fees - Term 1' },
        { id: 2, studentId: 2, studentName: 'Jane Smith', amount: 300, date: '2023-09-20', status: 'Pending', description: 'Book Fees' },
        { id: 3, studentId: 3, studentName: 'Michael Johnson', amount: 500, date: '2023-09-10', status: 'Paid', description: 'School Fees - Term 1' },
        { id: 4, studentId: 4, studentName: 'Emily Williams', amount: 450, date: '2023-09-25', status: 'Paid', description: 'Uniform & Books' },
        { id: 5, studentId: 5, studentName: 'David Brown', amount: 520, date: '2023-09-12', status: 'Paid', description: 'School Fees - Term 1' },
        { id: 6, studentId: 6, studentName: 'Sarah Davis', amount: 380, date: '2023-09-18', status: 'Pending', description: 'Lab Equipment Fee' },
        { id: 7, studentId: 7, studentName: 'Chris Wilson', amount: 500, date: '2023-09-14', status: 'Paid', description: 'School Fees - Term 1' },
        { id: 8, studentId: 8, studentName: 'Lisa Anderson', amount: 600, date: '2023-09-08', status: 'Paid', description: 'Final Year Fee' },
      ],
      staff: [
        { id: 1, name: 'James Anderson', position: 'Principal', department: 'Admin', email: 'j.anderson@ialibu.edu', phone: '123-456-7890', salary: 80000 },
        { id: 2, name: 'Mary Taylor', position: 'Vice Principal', department: 'Admin', email: 'm.taylor@ialibu.edu', phone: '123-456-7891', salary: 70000 },
        { id: 3, name: 'Robert Thomas', position: 'Math Teacher', department: 'Science', email: 'r.thomas@ialibu.edu', phone: '123-456-7892', salary: 50000 },
        { id: 4, name: 'Sarah Davis', position: 'Chemistry Teacher', department: 'Science', email: 's.davis@ialibu.edu', phone: '123-456-7893', salary: 48000 },
        { id: 5, name: 'Michael Johnson', position: 'History Teacher', department: 'Social Science', email: 'm.johnson@ialibu.edu', phone: '123-456-7894', salary: 47000 },
        { id: 6, name: 'Lisa Wilson', position: 'Geography Teacher', department: 'Social Science', email: 'l.wilson@ialibu.edu', phone: '123-456-7895', salary: 46000 },
        { id: 7, name: 'David Martinez', position: 'Business Studies Teacher', department: 'Business', email: 'd.martinez@ialibu.edu', phone: '123-456-7896', salary: 49000 },
        { id: 8, name: 'Emma Thompson', position: 'Economics Teacher', department: 'Business', email: 'e.thompson@ialibu.edu', phone: '123-456-7897', salary: 48500 },
      ],
      reports: [
        {
          id: 1,
          studentId: 1,
          studentName: 'John Doe',
          grade: 'Grade 9',
          class: '9A',
          term: 'Term 1',
          academicYear: '2024',
          attendance: 'Good - 95% attendance rate',
          academicPerformance: 'Above average performance in Mathematics and Science. Shows strong analytical skills.',
          behaviorConduct: 'Excellent behavior. Respectful to teachers and peers. Shows leadership qualities.',
          extracurricularActivities: 'Active member of the Science Club and Soccer team.',
          areasOfStrength: 'Mathematics, Science, Problem-solving, Leadership',
          areasForImprovement: 'English writing skills, Time management during examinations',
          teacherComments: 'John is a dedicated student who consistently performs well. He demonstrates good understanding of concepts and helps other students.',
          recommendations: 'Continue current study habits. Consider additional English writing practice. Encourage participation in academic competitions.',
          parentMeetingNotes: 'Parents are supportive. Discussed study schedule and career guidance.',
          createdBy: 'Staff Dashboard',
          createdDate: new Date().toISOString(),
          lastModified: new Date().toISOString()
        }
      ],
      lastUpdated: new Date().toISOString(),
      version: 1
    };
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (error) {
      console.error('Error saving data to storage:', error);
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.data));
  }

  private updateVersion(): void {
    this.data.version += 1;
    this.data.lastUpdated = new Date().toISOString();
  }

  // Subscribe to data changes
  subscribe(listener: DataChangeListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Get current data
  getData(): DataState {
    return { ...this.data };
  }

  // Student operations
  addStudent(student: Omit<Student, 'id'>): Student {
    const newStudent = {
      ...student,
      id: this.data.students && this.data.students.length > 0
        ? Math.max(...this.data.students.map(s => s.id), 0) + 1
        : 1
    };
    if (!this.data.students) {
      this.data.students = [];
    }
    this.data.students.push(newStudent);
    this.updateVersion();
    this.saveToStorage();
    this.notifyListeners();
    return newStudent;
  }

  updateStudent(student: Student): void {
    const index = this.data.students.findIndex(s => s.id === student.id);
    if (index !== -1) {
      this.data.students[index] = student;
      this.updateVersion();
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  deleteStudent(id: number): void {
    this.data.students = this.data.students.filter(s => s.id !== id);
    this.updateVersion();
    this.saveToStorage();
    this.notifyListeners();
  }

  // Attendance operations
  addAttendance(attendance: Omit<Attendance, 'id'>): Attendance {
    const newAttendance = {
      ...attendance,
      id: this.data.attendance && this.data.attendance.length > 0
        ? Math.max(...this.data.attendance.map(a => a.id), 0) + 1
        : 1
    };
    if (!this.data.attendance) {
      this.data.attendance = [];
    }
    this.data.attendance.push(newAttendance);
    this.updateVersion();
    this.saveToStorage();
    this.notifyListeners();
    return newAttendance;
  }

  updateAttendance(attendance: Attendance): void {
    const index = this.data.attendance.findIndex(a => a.id === attendance.id);
    if (index !== -1) {
      this.data.attendance[index] = attendance;
      this.updateVersion();
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  deleteAttendance(id: number): void {
    this.data.attendance = this.data.attendance.filter(a => a.id !== id);
    this.updateVersion();
    this.saveToStorage();
    this.notifyListeners();
  }

  // Grade operations
  addGrade(grade: Omit<Grade, 'id'>): Grade {
    const newGrade = {
      ...grade,
      id: this.data.grades && this.data.grades.length > 0
        ? Math.max(...this.data.grades.map(g => g.id), 0) + 1
        : 1
    };
    if (!this.data.grades) {
      this.data.grades = [];
    }
    this.data.grades.push(newGrade);
    this.updateVersion();
    this.saveToStorage();
    this.notifyListeners();
    return newGrade;
  }

  updateGrade(grade: Grade): void {
    const index = this.data.grades.findIndex(g => g.id === grade.id);
    if (index !== -1) {
      this.data.grades[index] = grade;
      this.updateVersion();
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  deleteGrade(id: number): void {
    this.data.grades = this.data.grades.filter(g => g.id !== id);
    this.updateVersion();
    this.saveToStorage();
    this.notifyListeners();
  }

  // Finance operations
  addFinance(finance: Omit<Finance, 'id'>): Finance {
    const newFinance = {
      ...finance,
      id: this.data.finance && this.data.finance.length > 0
        ? Math.max(...this.data.finance.map(f => f.id), 0) + 1
        : 1
    };
    if (!this.data.finance) {
      this.data.finance = [];
    }
    this.data.finance.push(newFinance);
    this.updateVersion();
    this.saveToStorage();
    this.notifyListeners();
    return newFinance;
  }

  updateFinance(finance: Finance): void {
    const index = this.data.finance.findIndex(f => f.id === finance.id);
    if (index !== -1) {
      this.data.finance[index] = finance;
      this.updateVersion();
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  deleteFinance(id: number): void {
    this.data.finance = this.data.finance.filter(f => f.id !== id);
    this.updateVersion();
    this.saveToStorage();
    this.notifyListeners();
  }

  // Staff operations
  addStaff(staff: Omit<Staff, 'id'>): Staff {
    const newStaff = {
      ...staff,
      id: this.data.staff && this.data.staff.length > 0
        ? Math.max(...this.data.staff.map(s => s.id), 0) + 1
        : 1
    };
    if (!this.data.staff) {
      this.data.staff = [];
    }
    this.data.staff.push(newStaff);
    this.updateVersion();
    this.saveToStorage();
    this.notifyListeners();
    return newStaff;
  }

  updateStaff(staff: Staff): void {
    const index = this.data.staff.findIndex(s => s.id === staff.id);
    if (index !== -1) {
      this.data.staff[index] = staff;
      this.updateVersion();
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  deleteStaff(id: number): void {
    this.data.staff = this.data.staff.filter(s => s.id !== id);
    this.updateVersion();
    this.saveToStorage();
    this.notifyListeners();
  }

  // Report operations
  addReport(report: Omit<StudentReport, 'id'>): StudentReport {
    const newReport = {
      ...report,
      id: this.data.reports && this.data.reports.length > 0
        ? Math.max(...this.data.reports.map(r => r.id), 0) + 1
        : 1
    };
    if (!this.data.reports) {
      this.data.reports = [];
    }
    this.data.reports.push(newReport);
    this.updateVersion();
    this.saveToStorage();
    this.notifyListeners();
    return newReport;
  }

  updateReport(report: StudentReport): void {
    if (!this.data.reports) {
      this.data.reports = [];
    }
    const index = this.data.reports.findIndex(r => r.id === report.id);
    if (index !== -1) {
      this.data.reports[index] = { ...report, lastModified: new Date().toISOString() };
      this.updateVersion();
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  deleteReport(id: number): void {
    if (!this.data.reports) {
      this.data.reports = [];
    }
    this.data.reports = this.data.reports.filter(r => r.id !== id);
    this.updateVersion();
    this.saveToStorage();
    this.notifyListeners();
  }

  getStudentReports(studentId: number): StudentReport[] {
    if (!this.data.reports) {
      this.data.reports = [];
    }
    return this.data.reports.filter(r => r.studentId === studentId);
  }
}

// Create a singleton instance
export const dataStore = new DataStore();
export type { Student, Attendance, Grade, Finance, Staff, StudentReport, DataState };
