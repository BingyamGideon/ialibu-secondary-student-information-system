import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Users,
  UserCheck,
  TrendingUp,
  FileText,
  Home,
  Edit,
  Trash2,
  Search,
  Plus,
  CalendarDays,
  Calendar as CalendarIcon,
  Check,
  X,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface Student {
  id: number;
  name: string;
  grade: string;
  class: string;
  subject: string;
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

export default function StaffDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('dashboard');

  // Search states
  const [studentSearch, setStudentSearch] = useState('');
  const [attendanceSearch, setAttendanceSearch] = useState('');
  const [gradeSearch, setGradeSearch] = useState('');

  // Student filter states
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');

  // Attendance interface states
  const [attendanceDate, setAttendanceDate] = useState<Date>(new Date());
  const [attendanceGrade, setAttendanceGrade] = useState('all');
  const [attendanceClass, setAttendanceClass] = useState('all');
  const [attendanceRecords, setAttendanceRecords] = useState<{[studentId: number]: {status: 'Present' | 'Absent' | 'Late', notes: string}}>({});
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Modal states
  const [studentModal, setStudentModal] = useState({ open: false, mode: 'add', data: null as Student | null });
  const [attendanceModal, setAttendanceModal] = useState({ open: false, mode: 'add', data: null as Attendance | null });
  const [gradeModal, setGradeModal] = useState({ open: false, mode: 'add', data: null as Grade | null });

  // Sample data for staff dashboard (limited access - only their assigned students)
  const [myStudents, setMyStudents] = useState<Student[]>([
    { id: 1, name: 'John Doe', grade: 'Grade 9', class: '9A', subject: 'Mathematics', email: 'john.doe@example.com', phone: '123-456-7890' },
    { id: 2, name: 'Jane Smith', grade: 'Grade 9', class: '9A', subject: 'Mathematics', email: 'jane.smith@example.com', phone: '123-456-7891' },
    { id: 3, name: 'Peter Wilson', grade: 'Grade 9', class: '9B', subject: 'Mathematics', email: 'peter.wilson@example.com', phone: '123-456-7899' },
    { id: 4, name: 'Emily Williams', grade: 'Grade 10', class: '10A', subject: 'Mathematics', email: 'emily.williams@example.com', phone: '123-456-7892' },
    { id: 5, name: 'Michael Brown', grade: 'Grade 10', class: '10A', subject: 'Mathematics', email: 'michael.brown@example.com', phone: '123-456-7893' },
    { id: 6, name: 'Sarah Johnson', grade: 'Grade 11', class: '11A', subject: 'Mathematics', email: 'sarah.johnson@example.com', phone: '123-456-7894' },
    { id: 7, name: 'David Lee', grade: 'Grade 12', class: '12B', subject: 'Mathematics', email: 'david.lee@example.com', phone: '123-456-7895' },
  ]);

  const [myAttendance, setMyAttendance] = useState<Attendance[]>([
    { id: 1, date: '2024-01-15', studentId: 1, studentName: 'John Doe', status: 'Present', subject: 'Mathematics', notes: '' },
    { id: 2, date: '2024-01-15', studentId: 2, studentName: 'Jane Smith', status: 'Absent', subject: 'Mathematics', notes: 'Sick leave' },
    { id: 3, date: '2024-01-15', studentId: 3, studentName: 'Peter Wilson', status: 'Late', subject: 'Mathematics', notes: '10 minutes late' },
    { id: 4, date: '2024-01-15', studentId: 4, studentName: 'Emily Williams', status: 'Present', subject: 'Mathematics', notes: '' },
    { id: 5, date: '2024-01-15', studentId: 5, studentName: 'Michael Brown', status: 'Present', subject: 'Mathematics', notes: '' },
    { id: 6, date: '2024-01-15', studentId: 6, studentName: 'Sarah Johnson', status: 'Present', subject: 'Mathematics', notes: '' },
    { id: 7, date: '2024-01-15', studentId: 7, studentName: 'David Lee', status: 'Absent', subject: 'Mathematics', notes: 'Medical appointment' },
  ]);

  const [myGrades, setMyGrades] = useState<Grade[]>([
    { id: 1, studentId: 1, studentName: 'John Doe', subject: 'Mathematics', score: 'A', percentage: 92, term: 'Term 1', assignment: 'Midterm Exam' },
    { id: 2, studentId: 2, studentName: 'Jane Smith', subject: 'Mathematics', score: 'B', percentage: 85, term: 'Term 1', assignment: 'Midterm Exam' },
    { id: 3, studentId: 3, studentName: 'Peter Wilson', subject: 'Mathematics', score: 'B+', percentage: 87, term: 'Term 1', assignment: 'Midterm Exam' },
    { id: 4, studentId: 4, studentName: 'Emily Williams', subject: 'Mathematics', score: 'A-', percentage: 90, term: 'Term 1', assignment: 'Midterm Exam' },
    { id: 5, studentId: 5, studentName: 'Michael Brown', subject: 'Mathematics', score: 'B+', percentage: 88, term: 'Term 1', assignment: 'Midterm Exam' },
    { id: 6, studentId: 6, studentName: 'Sarah Johnson', subject: 'Mathematics', score: 'A', percentage: 94, term: 'Term 1', assignment: 'Midterm Exam' },
    { id: 7, studentId: 7, studentName: 'David Lee', subject: 'Mathematics', score: 'A-', percentage: 91, term: 'Term 1', assignment: 'Midterm Exam' },
  ]);

  // Calculate stats dynamically
  const stats = {
    myStudents: myStudents.length,
    avgGrade: myGrades.reduce((sum, grade) => sum + grade.percentage, 0) / myGrades.length || 0,
    attendanceRate: myAttendance.length > 0 ? (myAttendance.filter(a => a.status === 'Present').length / myAttendance.length) * 100 : 0,
    assignedClasses: 3
  };

  const handleLogout = () => {
    navigate('/');
  };

  const staffMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'attendance', label: 'Take Attendance', icon: UserCheck },
    { id: 'attendance-records', label: 'Attendance Records', icon: CalendarDays },
    { id: 'grades', label: 'Grades', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  // CRUD Functions for Students
  const handleAddStudent = (student: Omit<Student, 'id'>) => {
    const newStudent = { ...student, id: Math.max(...myStudents.map(s => s.id)) + 1 };
    setMyStudents(prev => [...prev, newStudent]);
    toast({ title: 'Success', description: 'Student added successfully' });
    setStudentModal({ open: false, mode: 'add', data: null });
  };

  const handleUpdateStudent = (student: Student) => {
    setMyStudents(prev => prev.map(s => s.id === student.id ? student : s));
    toast({ title: 'Success', description: 'Student updated successfully' });
    setStudentModal({ open: false, mode: 'add', data: null });
  };

  const handleDeleteStudent = (studentId: number) => {
    setMyStudents(prev => prev.filter(s => s.id !== studentId));
    toast({ title: 'Success', description: 'Student removed from your classes' });
  };

  // CRUD Functions for Attendance
  const handleAddAttendance = (attendance: Omit<Attendance, 'id'>) => {
    const newAttendance = { ...attendance, id: Math.max(...myAttendance.map(a => a.id)) + 1 };
    setMyAttendance(prev => [...prev, newAttendance]);
    toast({ title: 'Success', description: 'Attendance recorded successfully' });
    setAttendanceModal({ open: false, mode: 'add', data: null });
  };

  const handleUpdateAttendance = (attendance: Attendance) => {
    setMyAttendance(prev => prev.map(a => a.id === attendance.id ? attendance : a));
    toast({ title: 'Success', description: 'Attendance updated successfully' });
    setAttendanceModal({ open: false, mode: 'add', data: null });
  };

  const handleDeleteAttendance = (attendanceId: number) => {
    setMyAttendance(prev => prev.filter(a => a.id !== attendanceId));
    toast({ title: 'Success', description: 'Attendance record deleted successfully' });
  };

  // CRUD Functions for Grades
  const handleAddGrade = (grade: Omit<Grade, 'id'>) => {
    const newGrade = { ...grade, id: Math.max(...myGrades.map(g => g.id)) + 1 };
    setMyGrades(prev => [...prev, newGrade]);
    toast({ title: 'Success', description: 'Grade added successfully' });
    setGradeModal({ open: false, mode: 'add', data: null });
  };

  const handleUpdateGrade = (grade: Grade) => {
    setMyGrades(prev => prev.map(g => g.id === grade.id ? grade : g));
    toast({ title: 'Success', description: 'Grade updated successfully' });
    setGradeModal({ open: false, mode: 'add', data: null });
  };

  const handleDeleteGrade = (gradeId: number) => {
    setMyGrades(prev => prev.filter(g => g.id !== gradeId));
    toast({ title: 'Success', description: 'Grade deleted successfully' });
  };

  // New attendance functions
  const handleAttendanceStatusChange = (studentId: number, status: 'Present' | 'Absent' | 'Late') => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: {
        status,
        notes: prev[studentId]?.notes || ''
      }
    }));
  };

  const handleAttendanceNotesChange = (studentId: number, notes: string) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: {
        status: prev[studentId]?.status || 'Present',
        notes
      }
    }));
  };

  const handleSubmitAttendance = () => {
    const dateStr = format(attendanceDate, 'yyyy-MM-dd');
    const newAttendanceRecords = Object.entries(attendanceRecords).map(([studentId, record]) => {
      const student = myStudents.find(s => s.id === parseInt(studentId));
      return {
        id: Math.max(...myAttendance.map(a => a.id), 0) + Math.random(),
        date: dateStr,
        studentId: parseInt(studentId),
        studentName: student?.name || '',
        status: record.status,
        subject: 'Mathematics', // Default subject for staff
        notes: record.notes
      };
    });

    setMyAttendance(prev => [...prev.filter(a => a.date !== dateStr), ...newAttendanceRecords]);
    setAttendanceRecords({});
    toast({
      title: 'Success',
      description: `Attendance recorded for ${format(attendanceDate, 'MMMM d, yyyy')}`
    });
  };

  // Get students for selected class in attendance
  const getAttendanceStudents = () => {
    if (attendanceGrade === 'all' || attendanceClass === 'all') return [];
    return myStudents.filter(student =>
      student.grade === attendanceGrade && student.class === attendanceClass
    );
  };

  // Generate class options based on selected grade
  const getClassOptions = (grade: string) => {
    if (grade === 'all') return [];
    const gradeNumber = grade.replace('Grade ', '');
    return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(letter => `${gradeNumber}${letter}`);
  };

  // Filter functions
  const filteredStudents = myStudents.filter(student => {
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

  const filteredAttendance = myAttendance.filter(record => 
    record.studentName.toLowerCase().includes(attendanceSearch.toLowerCase()) ||
    record.date.includes(attendanceSearch) ||
    record.status.toLowerCase().includes(attendanceSearch.toLowerCase())
  );

  const filteredGrades = myGrades.filter(grade => 
    grade.studentName.toLowerCase().includes(gradeSearch.toLowerCase()) ||
    grade.subject.toLowerCase().includes(gradeSearch.toLowerCase()) ||
    grade.assignment.toLowerCase().includes(gradeSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-900 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Ialibu Secondary School - Staff Dashboard</h1>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-white/20 text-white">
              Staff Dashboard
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
            {staffMenuItems.map((item) => {
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
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Staff Dashboard Overview</h2>
              
              {/* Staff Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">My Students</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.myStudents}</div>
                    <p className="text-xs text-muted-foreground">Students assigned to you</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.avgGrade.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">Your classes average</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.attendanceRate.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">Your classes this month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Assigned Classes</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.assignedClasses}</div>
                    <p className="text-xs text-muted-foreground">Classes you teach</p>
                  </CardContent>
                </Card>
              </div>

              {/* Staff Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      My Students
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      View and manage information for students in your assigned classes.
                    </p>
                    <Button onClick={() => setActiveSection('students')} className="w-full">
                      View My Students
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5" />
                      Attendance Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Record and track attendance for your assigned classes.
                    </p>
                    <Button onClick={() => setActiveSection('attendance')} className="w-full">
                      Manage Attendance
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Grade Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Enter and update grades for students in your classes.
                    </p>
                    <Button onClick={() => setActiveSection('grades')} className="w-full">
                      Manage Grades
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Student Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Generate reports for your students and classes.
                    </p>
                    <Button onClick={() => setActiveSection('reports')} className="w-full">
                      View Reports
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Access Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Today's Schedule</h3>
                      <p className="text-sm text-gray-600">
                        Grade 10A - Mathematics<br />
                        Grade 11B - Physics<br />
                        Grade 9A - General Science
                      </p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Recent Activity</h3>
                      <p className="text-sm text-gray-600">
                        {myGrades.length} grades entered<br />
                        {myAttendance.length} attendance records<br />
                        2 student reports generated
                      </p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Upcoming Tasks</h3>
                      <p className="text-sm text-gray-600">
                        Submit Term 2 grades<br />
                        Parent-teacher meetings<br />
                        Prepare exam materials
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'students' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Students</h2>
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
                    <StudentForm
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
                        <TableHead>Subject</TableHead>
                        <TableHead>Email</TableHead>
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
                          <TableCell>{student.subject}</TableCell>
                          <TableCell>{student.email}</TableCell>
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
                      students={myStudents}
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
                <h2 className="text-2xl font-bold text-gray-800">Grade Management</h2>
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
                      students={myStudents}
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

          {activeSection === 'reports' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Student Reports</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Generate Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Generate reports for your assigned students and classes.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline">My Students Performance</Button>
                    <Button variant="outline">Class Attendance Summary</Button>
                    <Button variant="outline">Grade Distribution</Button>
                    <Button variant="outline">Student Progress Report</Button>
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

// Student Form Component
function StudentForm({
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
      subject: 'Mathematics',
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
    if (formData.name && formData.grade && formData.class && formData.subject) {
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

// Attendance Form Component
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

// Grade Form Component
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
