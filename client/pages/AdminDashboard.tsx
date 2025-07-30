import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  UserCheck, 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  UserCog,
  FileText,
  Home,
  Edit,
  Trash2,
  Search,
  Plus,
  CalendarDays
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Student {
  id: number;
  name: string;
  grade: string;
  class: string;
  dob: string;
  gender: string;
  address: string;
  email?: string;
  phone?: string;
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

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('dashboard');

  // Search states
  const [studentSearch, setStudentSearch] = useState('');
  const [attendanceSearch, setAttendanceSearch] = useState('');
  const [gradeSearch, setGradeSearch] = useState('');
  const [financeSearch, setFinanceSearch] = useState('');
  const [staffSearch, setStaffSearch] = useState('');

  // Student filter states
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');

  // Modal states
  const [studentModal, setStudentModal] = useState({ open: false, mode: 'add', data: null as Student | null });
  const [attendanceModal, setAttendanceModal] = useState({ open: false, mode: 'add', data: null as Attendance | null });
  const [gradeModal, setGradeModal] = useState({ open: false, mode: 'add', data: null as Grade | null });
  const [financeModal, setFinanceModal] = useState({ open: false, mode: 'add', data: null as Finance | null });
  const [staffModal, setStaffModal] = useState({ open: false, mode: 'add', data: null as Staff | null });

  // Sample data
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: 'John Doe', grade: 'Grade 9', class: 'A', dob: '2007-05-15', gender: 'Male', address: '123 Main St, Ialibu', email: 'john.doe@example.com', phone: '123-456-7890' },
    { id: 2, name: 'Jane Smith', grade: 'Grade 9', class: 'A', dob: '2008-03-22', gender: 'Female', address: '456 Oak Ave, Ialibu', email: 'jane.smith@example.com', phone: '123-456-7891' },
    { id: 3, name: 'Michael Johnson', grade: 'Grade 10', class: 'B', dob: '2006-11-08', gender: 'Male', address: '789 Pine Rd, Ialibu', email: 'michael.johnson@example.com', phone: '123-456-7892' },
    { id: 4, name: 'Emily Williams', grade: 'Grade 10', class: 'A', dob: '2007-07-12', gender: 'Female', address: '101 Maple St, Ialibu', email: 'emily.williams@example.com', phone: '123-456-7893' },
  ]);

  const [attendance, setAttendance] = useState<Attendance[]>([
    { id: 1, date: '2024-01-15', studentId: 1, studentName: 'John Doe', status: 'Present', subject: 'Mathematics', notes: '' },
    { id: 2, date: '2024-01-15', studentId: 2, studentName: 'Jane Smith', status: 'Absent', subject: 'Mathematics', notes: 'Sick leave' },
    { id: 3, date: '2024-01-15', studentId: 3, studentName: 'Michael Johnson', status: 'Late', subject: 'Mathematics', notes: '15 minutes late' },
    { id: 4, date: '2024-01-15', studentId: 4, studentName: 'Emily Williams', status: 'Present', subject: 'Mathematics', notes: '' },
  ]);

  const [grades, setGrades] = useState<Grade[]>([
    { id: 1, studentId: 1, studentName: 'John Doe', subject: 'Mathematics', score: 'A', percentage: 92, term: 'Term 1', assignment: 'Midterm Exam' },
    { id: 2, studentId: 2, studentName: 'Jane Smith', subject: 'English', score: 'B', percentage: 85, term: 'Term 1', assignment: 'Essay Assignment' },
    { id: 3, studentId: 3, studentName: 'Michael Johnson', subject: 'Science', score: 'A-', percentage: 90, term: 'Term 1', assignment: 'Lab Report' },
    { id: 4, studentId: 4, studentName: 'Emily Williams', subject: 'History', score: 'B+', percentage: 87, term: 'Term 1', assignment: 'Research Project' },
  ]);

  const [finance, setFinance] = useState<Finance[]>([
    { id: 1, studentId: 1, studentName: 'John Doe', amount: 500, date: '2023-09-15', status: 'Paid', description: 'School Fees - Term 1' },
    { id: 2, studentId: 2, studentName: 'Jane Smith', amount: 300, date: '2023-09-20', status: 'Pending', description: 'Book Fees' },
    { id: 3, studentId: 3, studentName: 'Michael Johnson', amount: 500, date: '2023-09-10', status: 'Paid', description: 'School Fees - Term 1' },
    { id: 4, studentId: 4, studentName: 'Emily Williams', amount: 450, date: '2023-09-25', status: 'Paid', description: 'Uniform & Books' },
  ]);

  const [staff, setStaff] = useState<Staff[]>([
    { id: 1, name: 'James Anderson', position: 'Principal', department: 'Administration', email: 'j.anderson@ialibu.edu', phone: '123-456-7890', salary: 80000 },
    { id: 2, name: 'Mary Taylor', position: 'Vice Principal', department: 'Administration', email: 'm.taylor@ialibu.edu', phone: '123-456-7891', salary: 70000 },
    { id: 3, name: 'Robert Thomas', position: 'Math Teacher', department: 'Academics', email: 'r.thomas@ialibu.edu', phone: '123-456-7892', salary: 50000 },
    { id: 4, name: 'Sarah Davis', position: 'English Teacher', department: 'Academics', email: 's.davis@ialibu.edu', phone: '123-456-7893', salary: 48000 },
  ]);

  // Calculate stats dynamically
  const stats = {
    totalStudents: students.length,
    avgGrade: grades.reduce((sum, grade) => sum + grade.percentage, 0) / grades.length || 0,
    totalRevenue: finance.filter(f => f.status === 'Paid').reduce((sum, f) => sum + f.amount, 0),
    attendanceRate: attendance.length > 0 ? (attendance.filter(a => a.status === 'Present').length / attendance.length) * 100 : 0,
    totalStaff: staff.length,
    pendingPayments: finance.filter(f => f.status === 'Pending').length
  };

  const handleLogout = () => {
    navigate('/');
  };

  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: UserCheck },
    { id: 'grades', label: 'Grades', icon: TrendingUp },
    { id: 'finance', label: 'Finance', icon: CreditCard },
    { id: 'staff', label: 'Staff', icon: UserCog },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  // CRUD Functions for Students
  const handleAddStudent = (student: Omit<Student, 'id'>) => {
    const newStudent = { ...student, id: Math.max(...students.map(s => s.id)) + 1 };
    setStudents(prev => [...prev, newStudent]);
    toast({ title: 'Success', description: 'Student added successfully' });
    setStudentModal({ open: false, mode: 'add', data: null });
  };

  const handleUpdateStudent = (student: Student) => {
    setStudents(prev => prev.map(s => s.id === student.id ? student : s));
    toast({ title: 'Success', description: 'Student updated successfully' });
    setStudentModal({ open: false, mode: 'add', data: null });
  };

  const handleDeleteStudent = (studentId: number) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
    toast({ title: 'Success', description: 'Student deleted successfully' });
  };

  // CRUD Functions for Attendance
  const handleAddAttendance = (attendanceData: Omit<Attendance, 'id'>) => {
    const newAttendance = { ...attendanceData, id: Math.max(...attendance.map(a => a.id)) + 1 };
    setAttendance(prev => [...prev, newAttendance]);
    toast({ title: 'Success', description: 'Attendance recorded successfully' });
    setAttendanceModal({ open: false, mode: 'add', data: null });
  };

  const handleUpdateAttendance = (attendance: Attendance) => {
    setAttendance(prev => prev.map(a => a.id === attendance.id ? attendance : a));
    toast({ title: 'Success', description: 'Attendance updated successfully' });
    setAttendanceModal({ open: false, mode: 'add', data: null });
  };

  const handleDeleteAttendance = (attendanceId: number) => {
    setAttendance(prev => prev.filter(a => a.id !== attendanceId));
    toast({ title: 'Success', description: 'Attendance record deleted successfully' });
  };

  // CRUD Functions for Grades
  const handleAddGrade = (grade: Omit<Grade, 'id'>) => {
    const newGrade = { ...grade, id: Math.max(...grades.map(g => g.id)) + 1 };
    setGrades(prev => [...prev, newGrade]);
    toast({ title: 'Success', description: 'Grade added successfully' });
    setGradeModal({ open: false, mode: 'add', data: null });
  };

  const handleUpdateGrade = (grade: Grade) => {
    setGrades(prev => prev.map(g => g.id === grade.id ? grade : g));
    toast({ title: 'Success', description: 'Grade updated successfully' });
    setGradeModal({ open: false, mode: 'add', data: null });
  };

  const handleDeleteGrade = (gradeId: number) => {
    setGrades(prev => prev.filter(g => g.id !== gradeId));
    toast({ title: 'Success', description: 'Grade deleted successfully' });
  };

  // CRUD Functions for Finance
  const handleAddFinance = (finance: Omit<Finance, 'id'>) => {
    const newFinance = { ...finance, id: Math.max(...finance.map(f => f.id)) + 1 };
    setFinance(prev => [...prev, newFinance]);
    toast({ title: 'Success', description: 'Payment record added successfully' });
    setFinanceModal({ open: false, mode: 'add', data: null });
  };

  const handleUpdateFinance = (finance: Finance) => {
    setFinance(prev => prev.map(f => f.id === finance.id ? finance : f));
    toast({ title: 'Success', description: 'Payment record updated successfully' });
    setFinanceModal({ open: false, mode: 'add', data: null });
  };

  const handleDeleteFinance = (financeId: number) => {
    setFinance(prev => prev.filter(f => f.id !== financeId));
    toast({ title: 'Success', description: 'Payment record deleted successfully' });
  };

  // CRUD Functions for Staff
  const handleAddStaff = (staff: Omit<Staff, 'id'>) => {
    const newStaff = { ...staff, id: Math.max(...staff.map(s => s.id)) + 1 };
    setStaff(prev => [...prev, newStaff]);
    toast({ title: 'Success', description: 'Staff member added successfully' });
    setStaffModal({ open: false, mode: 'add', data: null });
  };

  const handleUpdateStaff = (staff: Staff) => {
    setStaff(prev => prev.map(s => s.id === staff.id ? staff : s));
    toast({ title: 'Success', description: 'Staff member updated successfully' });
    setStaffModal({ open: false, mode: 'add', data: null });
  };

  const handleDeleteStaff = (staffId: number) => {
    setStaff(prev => prev.filter(s => s.id !== staffId));
    toast({ title: 'Success', description: 'Staff member deleted successfully' });
  };

  // Generate class options based on selected grade
  const getClassOptions = (grade: string) => {
    if (grade === 'all') return [];
    const gradeNumber = grade.replace('Grade ', '');
    return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(letter => `${gradeNumber}${letter}`);
  };

  // Filter functions
  const filteredStudents = students.filter(student => {
    // Apply text search filter
    const matchesSearch = student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      student.grade.toLowerCase().includes(studentSearch.toLowerCase()) ||
      student.class.toLowerCase().includes(studentSearch.toLowerCase());

    // Apply grade filter
    const matchesGrade = selectedGrade === 'all' || student.grade === selectedGrade;

    // Apply class filter
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;

    return matchesSearch && matchesGrade && matchesClass;
  });

  const filteredAttendance = attendance.filter(record => 
    record.studentName.toLowerCase().includes(attendanceSearch.toLowerCase()) ||
    record.date.includes(attendanceSearch) ||
    record.status.toLowerCase().includes(attendanceSearch.toLowerCase())
  );

  const filteredGrades = grades.filter(grade => 
    grade.studentName.toLowerCase().includes(gradeSearch.toLowerCase()) ||
    grade.subject.toLowerCase().includes(gradeSearch.toLowerCase()) ||
    grade.assignment.toLowerCase().includes(gradeSearch.toLowerCase())
  );

  const filteredFinance = finance.filter(payment => 
    payment.studentName.toLowerCase().includes(financeSearch.toLowerCase()) ||
    payment.description.toLowerCase().includes(financeSearch.toLowerCase()) ||
    payment.status.toLowerCase().includes(financeSearch.toLowerCase())
  );

  const filteredStaff = staff.filter(member => 
    member.name.toLowerCase().includes(staffSearch.toLowerCase()) ||
    member.position.toLowerCase().includes(staffSearch.toLowerCase()) ||
    member.department.toLowerCase().includes(staffSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-900 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Ialibu Secondary School - Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-white/20 text-white">
              Administrator Dashboard
            </Badge>
            <Button variant="outline" size="sm" onClick={handleLogout} className="text-blue-900 border-white hover:bg-white">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-blue-900 text-white min-h-screen p-4">
          <div className="space-y-2">
            {adminMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    activeSection === item.id 
                      ? 'bg-white/20 text-white' 
                      : 'hover:bg-white/10'
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeSection === 'dashboard' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard Overview</h2>
              
              {/* Admin Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalStudents}</div>
                    <p className="text-xs text-muted-foreground">Across all grades</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.avgGrade.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">School-wide average</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">K{stats.totalRevenue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">This academic year</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.attendanceRate.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                    <UserCog className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalStaff}</div>
                    <p className="text-xs text-muted-foreground">Active staff members</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.pendingPayments}</div>
                    <p className="text-xs text-muted-foreground">Require attention</p>
                  </CardContent>
                </Card>
              </div>

              {/* Admin Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Student Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Manage student records, enrollments, and academic information.
                    </p>
                    <Button onClick={() => setActiveSection('students')} className="w-full">
                      Manage Students
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Financial Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Track payments, fees, and financial records for all students.
                    </p>
                    <Button onClick={() => setActiveSection('finance')} className="w-full">
                      Manage Finances
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCog className="h-5 w-5" />
                      Staff Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Manage staff records, roles, and administrative functions.
                    </p>
                    <Button onClick={() => setActiveSection('staff')} className="w-full">
                      Manage Staff
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5" />
                      Attendance Tracking
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Monitor and manage student attendance across all grades.
                    </p>
                    <Button onClick={() => setActiveSection('attendance')} className="w-full">
                      View Attendance
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Academic Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Track grades, assessments, and academic progress.
                    </p>
                    <Button onClick={() => setActiveSection('grades')} className="w-full">
                      View Grades
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Reports & Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Generate comprehensive reports and analytics.
                    </p>
                    <Button onClick={() => setActiveSection('reports')} className="w-full">
                      View Reports
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeSection === 'students' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Student Management</h2>
                <Dialog open={studentModal.open} onOpenChange={(open) => setStudentModal(prev => ({ ...prev, open }))}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setStudentModal({ open: true, mode: 'add', data: null })}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Student
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>{studentModal.mode === 'add' ? 'Add New Student' : 'Edit Student'}</DialogTitle>
                    </DialogHeader>
                    <AdminStudentForm
                      mode={studentModal.mode}
                      student={studentModal.data}
                      selectedGrade={selectedGrade !== 'all' ? selectedGrade : ''}
                      selectedClass={selectedClass !== 'all' ? selectedClass : ''}
                      onSave={(student) => {
                        if (studentModal.mode === 'add') {
                          handleAddStudent(student);
                        } else {
                          handleUpdateStudent(student as Student);
                        }
                      }}
                      onCancel={() => setStudentModal({ open: false, mode: 'add', data: null })}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="mb-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search students by name, grade, or class..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Grade and Class Filter Row */}
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium whitespace-nowrap">Filter by:</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select
                      value={selectedGrade}
                      onValueChange={(value) => {
                        setSelectedGrade(value);
                        setSelectedClass('all'); // Reset class when grade changes
                      }}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="All Students" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Students</SelectItem>
                        <SelectItem value="Grade 9">Grade 9</SelectItem>
                        <SelectItem value="Grade 10">Grade 10</SelectItem>
                        <SelectItem value="Grade 11">Grade 11</SelectItem>
                        <SelectItem value="Grade 12">Grade 12</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedGrade !== 'all' && (
                    <div className="flex items-center gap-2">
                      <Select
                        value={selectedClass}
                        onValueChange={setSelectedClass}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="All Classes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Classes</SelectItem>
                          {getClassOptions(selectedGrade).map((classOption) => (
                            <SelectItem key={classOption} value={classOption}>
                              {classOption}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {(selectedGrade !== 'all' || selectedClass !== 'all') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedGrade('all');
                        setSelectedClass('all');
                      }}
                      className="text-xs"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>

              <Card>
                <CardContent className="p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Date of Birth</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>{student.id}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.grade}</TableCell>
                          <TableCell>{student.class}</TableCell>
                          <TableCell>{student.dob}</TableCell>
                          <TableCell>{student.gender}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setStudentModal({ open: true, mode: 'edit', data: student })}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteStudent(student.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'attendance' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Attendance Records</h2>
                <Dialog open={attendanceModal.open} onOpenChange={(open) => setAttendanceModal(prev => ({ ...prev, open }))}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setAttendanceModal({ open: true, mode: 'add', data: null })}>
                      <CalendarDays className="mr-2 h-4 w-4" />
                      Record Attendance
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>{attendanceModal.mode === 'add' ? 'Record Attendance' : 'Edit Attendance'}</DialogTitle>
                    </DialogHeader>
                    <AttendanceForm 
                      mode={attendanceModal.mode}
                      attendance={attendanceModal.data}
                      students={students}
                      onSave={(attendance) => {
                        if (attendanceModal.mode === 'add') {
                          handleAddAttendance(attendance);
                        } else {
                          handleUpdateAttendance(attendance as Attendance);
                        }
                      }}
                      onCancel={() => setAttendanceModal({ open: false, mode: 'add', data: null })}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by student name, date, or status..."
                    value={attendanceSearch}
                    onChange={(e) => setAttendanceSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Card>
                <CardContent className="p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAttendance.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.date}</TableCell>
                          <TableCell>{record.studentName}</TableCell>
                          <TableCell>{record.subject}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                record.status === 'Present' ? 'default' : 
                                record.status === 'Absent' ? 'destructive' : 
                                'secondary'
                              }
                            >
                              {record.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{record.notes}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setAttendanceModal({ open: true, mode: 'edit', data: record })}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteAttendance(record.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'grades' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Academic Performance</h2>
                <Dialog open={gradeModal.open} onOpenChange={(open) => setGradeModal(prev => ({ ...prev, open }))}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setGradeModal({ open: true, mode: 'add', data: null })}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Grade
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>{gradeModal.mode === 'add' ? 'Add Grade' : 'Edit Grade'}</DialogTitle>
                    </DialogHeader>
                    <GradeForm 
                      mode={gradeModal.mode}
                      grade={gradeModal.data}
                      students={students}
                      onSave={(grade) => {
                        if (gradeModal.mode === 'add') {
                          handleAddGrade(grade);
                        } else {
                          handleUpdateGrade(grade as Grade);
                        }
                      }}
                      onCancel={() => setGradeModal({ open: false, mode: 'add', data: null })}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by student name, subject, or assignment..."
                    value={gradeSearch}
                    onChange={(e) => setGradeSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Card>
                <CardContent className="p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Assignment</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Percentage</TableHead>
                        <TableHead>Term</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredGrades.map((grade) => (
                        <TableRow key={grade.id}>
                          <TableCell>{grade.studentName}</TableCell>
                          <TableCell>{grade.subject}</TableCell>
                          <TableCell>{grade.assignment}</TableCell>
                          <TableCell>{grade.score}</TableCell>
                          <TableCell>{grade.percentage}%</TableCell>
                          <TableCell>{grade.term}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setGradeModal({ open: true, mode: 'edit', data: grade })}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteGrade(grade.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'finance' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Financial Records</h2>
                <Dialog open={financeModal.open} onOpenChange={(open) => setFinanceModal(prev => ({ ...prev, open }))}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setFinanceModal({ open: true, mode: 'add', data: null })}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Payment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>{financeModal.mode === 'add' ? 'Add Payment' : 'Edit Payment'}</DialogTitle>
                    </DialogHeader>
                    <FinanceForm 
                      mode={financeModal.mode}
                      finance={financeModal.data}
                      students={students}
                      onSave={(finance) => {
                        if (financeModal.mode === 'add') {
                          handleAddFinance(finance);
                        } else {
                          handleUpdateFinance(finance as Finance);
                        }
                      }}
                      onCancel={() => setFinanceModal({ open: false, mode: 'add', data: null })}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by student name, description, or status..."
                    value={financeSearch}
                    onChange={(e) => setFinanceSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Card>
                <CardContent className="p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFinance.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{payment.studentName}</TableCell>
                          <TableCell>{payment.description}</TableCell>
                          <TableCell>K{payment.amount.toFixed(2)}</TableCell>
                          <TableCell>{payment.date}</TableCell>
                          <TableCell>
                            <Badge variant={payment.status === 'Paid' ? 'default' : 'secondary'}>
                              {payment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setFinanceModal({ open: true, mode: 'edit', data: payment })}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteFinance(payment.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'staff' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Staff Management</h2>
                <Dialog open={staffModal.open} onOpenChange={(open) => setStaffModal(prev => ({ ...prev, open }))}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setStaffModal({ open: true, mode: 'add', data: null })}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Staff
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>{staffModal.mode === 'add' ? 'Add Staff Member' : 'Edit Staff Member'}</DialogTitle>
                    </DialogHeader>
                    <StaffForm 
                      mode={staffModal.mode}
                      staff={staffModal.data}
                      onSave={(staff) => {
                        if (staffModal.mode === 'add') {
                          handleAddStaff(staff);
                        } else {
                          handleUpdateStaff(staff as Staff);
                        }
                      }}
                      onCancel={() => setStaffModal({ open: false, mode: 'add', data: null })}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name, position, or department..."
                    value={staffSearch}
                    onChange={(e) => setStaffSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Card>
                <CardContent className="p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStaff.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>{member.id}</TableCell>
                          <TableCell>{member.name}</TableCell>
                          <TableCell>{member.position}</TableCell>
                          <TableCell>{member.department}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>{member.phone}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setStaffModal({ open: true, mode: 'edit', data: member })}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteStaff(member.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'reports' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Student Reports</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Generate Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Generate comprehensive reports for students, attendance, grades, and financial records.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline">Student Performance Report</Button>
                    <Button variant="outline">Attendance Summary</Button>
                    <Button variant="outline">Financial Report</Button>
                    <Button variant="outline">Staff Report</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Admin Student Form Component (with more fields than staff version)
function AdminStudentForm({
  mode,
  student,
  selectedGrade,
  selectedClass,
  onSave,
  onCancel
}: {
  mode: 'add' | 'edit';
  student: Student | null;
  selectedGrade?: string;
  selectedClass?: string;
  onSave: (student: Omit<Student, 'id'> | Student) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Student>>(
    student || {
      name: '',
      grade: selectedGrade || '',
      class: selectedClass || '',
      dob: '',
      gender: '',
      address: '',
      email: '',
      phone: '',
    }
  );

  // Generate class options based on selected grade in form
  const getFormClassOptions = (grade: string) => {
    if (!grade) return [];
    const gradeNumber = grade.replace('Grade ', '');
    return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(letter => `${gradeNumber}${letter}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.grade && formData.class && formData.dob && formData.gender && formData.address) {
      onSave(mode === 'edit' ? formData as Student : formData as Omit<Student, 'id'>);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Student Name</Label>
        <Input
          id="name"
          value={formData.name || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="grade">Grade</Label>
          <Select
            value={formData.grade || ''}
            onValueChange={(value) => setFormData(prev => ({ ...prev, grade: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Grade 9">Grade 9</SelectItem>
              <SelectItem value="Grade 10">Grade 10</SelectItem>
              <SelectItem value="Grade 11">Grade 11</SelectItem>
              <SelectItem value="Grade 12">Grade 12</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="class">Class</Label>
          <Select
            value={formData.class || ''}
            onValueChange={(value) => setFormData(prev => ({ ...prev, class: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              {formData.grade ? (
                getFormClassOptions(formData.grade).map((classOption) => (
                  <SelectItem key={classOption} value={classOption}>
                    {classOption}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>
                  Select Grade First
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dob">Date of Birth</Label>
          <Input
            id="dob"
            type="date"
            value={formData.dob || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, dob: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={formData.gender || ''}
            onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formData.address || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formData.phone || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {mode === 'add' ? 'Add Student' : 'Update Student'}
        </Button>
      </div>
    </form>
  );
}

// Attendance Form Component (reused from staff dashboard)
function AttendanceForm({ 
  mode, 
  attendance, 
  students,
  onSave, 
  onCancel 
}: { 
  mode: 'add' | 'edit'; 
  attendance: Attendance | null; 
  students: Student[];
  onSave: (attendance: Omit<Attendance, 'id'> | Attendance) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState<Partial<Attendance>>(
    attendance || {
      date: new Date().toISOString().split('T')[0],
      studentId: 0,
      studentName: '',
      status: 'Present',
      subject: 'Mathematics',
      notes: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.date && formData.studentId && formData.status && formData.subject) {
      const selectedStudent = students.find(s => s.id === formData.studentId);
      const attendanceData = {
        ...formData,
        studentName: selectedStudent?.name || '',
      };
      onSave(mode === 'edit' ? attendanceData as Attendance : attendanceData as Omit<Attendance, 'id'>);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="student">Student</Label>
        <Select
          value={formData.studentId?.toString() || ''}
          onValueChange={(value) => setFormData(prev => ({ ...prev, studentId: parseInt(value) }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Student" />
          </SelectTrigger>
          <SelectContent>
            {students.map((student) => (
              <SelectItem key={student.id} value={student.id.toString()}>
                {student.name} ({student.grade} {student.class})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status || ''}
          onValueChange={(value: 'Present' | 'Absent' | 'Late') => setFormData(prev => ({ ...prev, status: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Present">Present</SelectItem>
            <SelectItem value="Absent">Absent</SelectItem>
            <SelectItem value="Late">Late</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="subject">Subject</Label>
        <Select
          value={formData.subject || ''}
          onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Mathematics">Mathematics</SelectItem>
            <SelectItem value="Physics">Physics</SelectItem>
            <SelectItem value="Chemistry">Chemistry</SelectItem>
            <SelectItem value="Biology">Biology</SelectItem>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="History">History</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Input
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Additional notes..."
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {mode === 'add' ? 'Record Attendance' : 'Update Attendance'}
        </Button>
      </div>
    </form>
  );
}

// Grade Form Component (reused from staff dashboard)
function GradeForm({ 
  mode, 
  grade, 
  students,
  onSave, 
  onCancel 
}: { 
  mode: 'add' | 'edit'; 
  grade: Grade | null; 
  students: Student[];
  onSave: (grade: Omit<Grade, 'id'> | Grade) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState<Partial<Grade>>(
    grade || {
      studentId: 0,
      studentName: '',
      subject: 'Mathematics',
      score: '',
      percentage: 0,
      term: 'Term 1',
      assignment: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.studentId && formData.subject && formData.score && formData.percentage && formData.term && formData.assignment) {
      const selectedStudent = students.find(s => s.id === formData.studentId);
      const gradeData = {
        ...formData,
        studentName: selectedStudent?.name || '',
      };
      onSave(mode === 'edit' ? gradeData as Grade : gradeData as Omit<Grade, 'id'>);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="student">Student</Label>
        <Select
          value={formData.studentId?.toString() || ''}
          onValueChange={(value) => setFormData(prev => ({ ...prev, studentId: parseInt(value) }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Student" />
          </SelectTrigger>
          <SelectContent>
            {students.map((student) => (
              <SelectItem key={student.id} value={student.id.toString()}>
                {student.name} ({student.grade} {student.class})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="subject">Subject</Label>
        <Select
          value={formData.subject || ''}
          onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Mathematics">Mathematics</SelectItem>
            <SelectItem value="Physics">Physics</SelectItem>
            <SelectItem value="Chemistry">Chemistry</SelectItem>
            <SelectItem value="Biology">Biology</SelectItem>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="History">History</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="assignment">Assignment/Exam</Label>
        <Input
          id="assignment"
          value={formData.assignment || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, assignment: e.target.value }))}
          placeholder="e.g., Midterm Exam, Quiz 1, Final Project"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="score">Letter Grade</Label>
          <Select
            value={formData.score || ''}
            onValueChange={(value) => setFormData(prev => ({ ...prev, score: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A">A</SelectItem>
              <SelectItem value="A-">A-</SelectItem>
              <SelectItem value="B+">B+</SelectItem>
              <SelectItem value="B">B</SelectItem>
              <SelectItem value="B-">B-</SelectItem>
              <SelectItem value="C+">C+</SelectItem>
              <SelectItem value="C">C</SelectItem>
              <SelectItem value="C-">C-</SelectItem>
              <SelectItem value="D">D</SelectItem>
              <SelectItem value="F">F</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="percentage">Percentage</Label>
          <Input
            id="percentage"
            type="number"
            min="0"
            max="100"
            value={formData.percentage || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, percentage: parseInt(e.target.value) }))}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="term">Term</Label>
        <Select
          value={formData.term || ''}
          onValueChange={(value) => setFormData(prev => ({ ...prev, term: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Term" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Term 1">Term 1</SelectItem>
            <SelectItem value="Term 2">Term 2</SelectItem>
            <SelectItem value="Term 3">Term 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {mode === 'add' ? 'Add Grade' : 'Update Grade'}
        </Button>
      </div>
    </form>
  );
}

// Finance Form Component
function FinanceForm({ 
  mode, 
  finance, 
  students,
  onSave, 
  onCancel 
}: { 
  mode: 'add' | 'edit'; 
  finance: Finance | null; 
  students: Student[];
  onSave: (finance: Omit<Finance, 'id'> | Finance) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState<Partial<Finance>>(
    finance || {
      studentId: 0,
      studentName: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      description: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.studentId && formData.amount && formData.date && formData.status && formData.description) {
      const selectedStudent = students.find(s => s.id === formData.studentId);
      const financeData = {
        ...formData,
        studentName: selectedStudent?.name || '',
      };
      onSave(mode === 'edit' ? financeData as Finance : financeData as Omit<Finance, 'id'>);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="student">Student</Label>
        <Select
          value={formData.studentId?.toString() || ''}
          onValueChange={(value) => setFormData(prev => ({ ...prev, studentId: parseInt(value) }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Student" />
          </SelectTrigger>
          <SelectContent>
            {students.map((student) => (
              <SelectItem key={student.id} value={student.id.toString()}>
                {student.name} ({student.grade} {student.class})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="e.g., School Fees - Term 1, Book Fees"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="amount">Amount (K)</Label>
          <Input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            value={formData.amount || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status || ''}
          onValueChange={(value: 'Paid' | 'Pending') => setFormData(prev => ({ ...prev, status: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {mode === 'add' ? 'Add Payment' : 'Update Payment'}
        </Button>
      </div>
    </form>
  );
}

// Staff Form Component
function StaffForm({ 
  mode, 
  staff, 
  onSave, 
  onCancel 
}: { 
  mode: 'add' | 'edit'; 
  staff: Staff | null; 
  onSave: (staff: Omit<Staff, 'id'> | Staff) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState<Partial<Staff>>(
    staff || {
      name: '',
      position: '',
      department: '',
      email: '',
      phone: '',
      salary: 0,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.position && formData.department && formData.email && formData.phone) {
      onSave(mode === 'edit' ? formData as Staff : formData as Omit<Staff, 'id'>);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={formData.name || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="position">Position</Label>
        <Input
          id="position"
          value={formData.position || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
          placeholder="e.g., Math Teacher, Principal"
          required
        />
      </div>

      <div>
        <Label htmlFor="department">Department</Label>
        <Select
          value={formData.department || ''}
          onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Administration">Administration</SelectItem>
            <SelectItem value="Academics">Academics</SelectItem>
            <SelectItem value="Sports">Sports</SelectItem>
            <SelectItem value="Library">Library</SelectItem>
            <SelectItem value="Maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formData.phone || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="salary">Salary (K)</Label>
        <Input
          id="salary"
          type="number"
          min="0"
          value={formData.salary || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, salary: parseFloat(e.target.value) }))}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {mode === 'add' ? 'Add Staff Member' : 'Update Staff Member'}
        </Button>
      </div>
    </form>
  );
}
