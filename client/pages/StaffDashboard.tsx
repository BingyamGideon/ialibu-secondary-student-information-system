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
import { useDataStore } from '@/hooks/useDataStore';
import { type Student, type Attendance, type Grade } from '@/lib/dataStore';
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
  Clock,
  Download,
  Mail,
  Printer,
  BarChart3,
  PieChart,
  FileBarChart,
  BookOpen,
  GraduationCap,
  Sync
} from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function StaffDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dataStore = useDataStore();
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
  const [showHistory, setShowHistory] = useState(false);
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState<number | null>(null);

  // Grade filter states
  const [gradeFilterGrade, setGradeFilterGrade] = useState('all');
  const [gradeFilterClass, setGradeFilterClass] = useState('all');
  const [selectedStudentForGrade, setSelectedStudentForGrade] = useState<number | null>(null);

  // Subject management states
  const [subjectModal, setSubjectModal] = useState({ open: false, student: null as Student | null });
  const [selectedStudentSubjects, setSelectedStudentSubjects] = useState<string[]>([]);

  // Get available subjects based on grade
  const getAvailableSubjects = (grade: string) => {
    const gradeNumber = parseInt(grade.replace('Grade ', ''));
    if (gradeNumber >= 9 && gradeNumber <= 10) {
      return lowerSecondarySubjects;
    } else if (gradeNumber >= 11 && gradeNumber <= 12) {
      return upperSecondarySubjects;
    }
    return [];
  };

  // Report states
  const [selectedReportType, setSelectedReportType] = useState<string | null>(null);
  const [reportGrade, setReportGrade] = useState('all');
  const [reportClass, setReportClass] = useState('all');
  const [emailAddress, setEmailAddress] = useState('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Modal states
  const [studentModal, setStudentModal] = useState({ open: false, mode: 'add', data: null as Student | null });
  const [attendanceModal, setAttendanceModal] = useState({ open: false, mode: 'add', data: null as Attendance | null });
  const [gradeModal, setGradeModal] = useState({ open: false, mode: 'add', data: null as Grade | null });

  // Subject definitions by grade level
  const lowerSecondarySubjects = [
    'English',
    'Mathematics',
    'Science',
    'Social Science',
    'Business Studies',
    'Personal Development',
    'Religious Education',
    'Arts',
    'Information Technology',
    'Technology & Industrial Arts',
    'Family and Consumer Studies'
  ];

  const upperSecondarySubjects = [
    'Language and Literature',
    'General Mathematics',
    'Personal Development',
    'Religious Education',
    'Biology',
    'Chemistry',
    'Physics',
    'Geology',
    'Applied Science',
    'Advanced Mathematics',
    'Economics',
    'Geography',
    'History',
    'Environment',
    'Political Science',
    'Legal Studies',
    'Business Studies',
    'Accounting',
    'Tourism Studies',
    'Information and Communication Technology (ICT)',
    'Computer Studies',
    'Design and Technology',
    'Construction',
    'Food Technology',
    'Textile Technology'
  ];

  // Sample data for staff dashboard (limited access - only their assigned students)
  const [myStudents, setMyStudents] = useState<Student[]>([
    { id: 1, name: 'John Doe', grade: 'Grade 9', class: '9A', subjects: ['Mathematics', 'English', 'Science', 'Social Science', 'Business Studies', 'Personal Development', 'Arts'], email: 'john.doe@example.com', phone: '123-456-7890' },
    { id: 2, name: 'Jane Smith', grade: 'Grade 9', class: '9A', subjects: ['Mathematics', 'English', 'Science', 'Social Science', 'Information Technology', 'Personal Development', 'Arts', 'Family and Consumer Studies'], email: 'jane.smith@example.com', phone: '123-456-7891' },
    { id: 3, name: 'Peter Wilson', grade: 'Grade 9', class: '9B', subjects: ['Mathematics', 'English', 'Science', 'Business Studies', 'Technology & Industrial Arts', 'Personal Development', 'Arts'], email: 'peter.wilson@example.com', phone: '123-456-7899' },
    { id: 4, name: 'Emily Williams', grade: 'Grade 10', class: '10A', subjects: ['Mathematics', 'English', 'Science', 'Social Science', 'Business Studies', 'Information Technology', 'Arts', 'Personal Development'], email: 'emily.williams@example.com', phone: '123-456-7892' },
    { id: 5, name: 'Michael Brown', grade: 'Grade 10', class: '10A', subjects: ['Mathematics', 'English', 'Science', 'Social Science', 'Technology & Industrial Arts', 'Personal Development', 'Family and Consumer Studies'], email: 'michael.brown@example.com', phone: '123-456-7893' },
    { id: 6, name: 'Sarah Johnson', grade: 'Grade 11', class: '11A', subjects: ['Language and Literature', 'General Mathematics', 'Biology', 'Chemistry', 'Physics', 'Economics', 'Geography', 'Personal Development'], email: 'sarah.johnson@example.com', phone: '123-456-7894' },
    { id: 7, name: 'David Lee', grade: 'Grade 12', class: '12B', subjects: ['Language and Literature', 'Advanced Mathematics', 'Physics', 'Chemistry', 'Economics', 'Business Studies', 'Accounting', 'Computer Studies'], email: 'david.lee@example.com', phone: '123-456-7895' },
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
    { id: 1, studentId: 1, studentName: 'John Doe', subject: 'Mathematics', score: 'D', percentage: 92, term: 'Term 1', assignment: 'Midterm Exam' },
    { id: 2, studentId: 2, studentName: 'Jane Smith', subject: 'Mathematics', score: 'C', percentage: 85, term: 'Term 1', assignment: 'Midterm Exam' },
    { id: 3, studentId: 3, studentName: 'Peter Wilson', subject: 'Mathematics', score: 'UP', percentage: 87, term: 'Term 1', assignment: 'Midterm Exam' },
    { id: 4, studentId: 4, studentName: 'Emily Williams', subject: 'Mathematics', score: 'P', percentage: 90, term: 'Term 1', assignment: 'Midterm Exam' },
    { id: 5, studentId: 5, studentName: 'Michael Brown', subject: 'Mathematics', score: 'UP', percentage: 88, term: 'Term 1', assignment: 'Midterm Exam' },
    { id: 6, studentId: 6, studentName: 'Sarah Johnson', subject: 'Mathematics', score: 'D', percentage: 94, term: 'Term 1', assignment: 'Midterm Exam' },
    { id: 7, studentId: 7, studentName: 'David Lee', subject: 'Mathematics', score: 'P', percentage: 91, term: 'Term 1', assignment: 'Midterm Exam' },
    { id: 8, studentId: 1, studentName: 'John Doe', subject: 'English', score: 'C', percentage: 78, term: 'Term 4', assignment: 'Final Exam' },
    { id: 9, studentId: 2, studentName: 'Jane Smith', subject: 'Science', score: 'UP', percentage: 82, term: 'Term 4', assignment: 'Final Project' },
    { id: 10, studentId: 3, studentName: 'Peter Wilson', subject: 'Mathematics', score: 'D', percentage: 89, term: 'Term 4', assignment: 'Final Exam' },
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

  // Subject management functions
  const handleUpdateStudentSubjects = (studentId: number, newSubjects: string[]) => {
    if (newSubjects.length > 10) {
      toast({ title: 'Error', description: 'Maximum 10 subjects allowed per student' });
      return;
    }

    if (newSubjects.length < 7) {
      toast({ title: 'Warning', description: 'Students should have at least 7 subjects' });
    }

    setMyStudents(prev => prev.map(student =>
      student.id === studentId
        ? { ...student, subjects: newSubjects }
        : student
    ));

    toast({
      title: 'Success',
      description: `Student subjects updated. Total: ${newSubjects.length} subjects`
    });
    setSubjectModal({ open: false, student: null });
  };

  const openSubjectModal = (student: Student) => {
    setSelectedStudentSubjects([...student.subjects]);
    setSubjectModal({ open: true, student });
  };

  const toggleSubject = (subject: string) => {
    setSelectedStudentSubjects(prev => {
      if (prev.includes(subject)) {
        return prev.filter(s => s !== subject);
      } else {
        if (prev.length >= 10) {
          toast({ title: 'Limit Reached', description: 'Maximum 10 subjects allowed' });
          return prev;
        }
        return [...prev, subject];
      }
    });
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

  // Calculate attendance statistics for a student
  const getStudentAttendanceStats = (studentId: number) => {
    const studentRecords = myAttendance.filter(record => record.studentId === studentId);
    const totalDays = studentRecords.length;
    const presentDays = studentRecords.filter(record => record.status === 'Present').length;
    const absentDays = studentRecords.filter(record => record.status === 'Absent').length;
    const lateDays = studentRecords.filter(record => record.status === 'Late').length;
    const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    return {
      totalDays,
      presentDays,
      absentDays,
      lateDays,
      attendanceRate: Math.round(attendanceRate * 10) / 10
    };
  };

  // Get detailed attendance history for a student
  const getStudentAttendanceHistory = (studentId: number) => {
    return myAttendance
      .filter(record => record.studentId === studentId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  // Get students for grade filtering
  const getGradeFilteredStudents = () => {
    if (gradeFilterGrade === 'all' || gradeFilterClass === 'all') return [];
    return myStudents.filter(student =>
      student.grade === gradeFilterGrade && student.class === gradeFilterClass
    );
  };

  // Calculate ranking for students in a class and subject
  const getStudentRanking = (studentId: number, subject: string, term: string) => {
    const classStudents = getGradeFilteredStudents();
    const subjectGrades = myGrades.filter(grade =>
      grade.subject === subject &&
      grade.term === term &&
      classStudents.some(student => student.id === grade.studentId)
    );

    // Sort by percentage descending
    const sortedGrades = subjectGrades.sort((a, b) => b.percentage - a.percentage);
    const position = sortedGrades.findIndex(grade => grade.studentId === studentId) + 1;

    if (position === 0) return null;

    const suffix = position === 1 ? 'st' : position === 2 ? 'nd' : position === 3 ? 'rd' : 'th';
    return `${position}${suffix}`;
  };

  // Get grades for a specific student
  const getStudentGrades = (studentId: number) => {
    return myGrades.filter(grade => grade.studentId === studentId)
      .sort((a, b) => new Date(b.term).getTime() - new Date(a.term).getTime());
  };

  // Report generation functions
  const generateStudentPerformanceReport = () => {
    const reportStudents = reportGrade !== 'all' && reportClass !== 'all'
      ? myStudents.filter(s => s.grade === reportGrade && s.class === reportClass)
      : myStudents;

    return reportStudents.map(student => {
      const studentGrades = getStudentGrades(student.id);
      const attendanceStats = getStudentAttendanceStats(student.id);
      const avgPercentage = studentGrades.length > 0
        ? studentGrades.reduce((sum, grade) => sum + grade.percentage, 0) / studentGrades.length
        : 0;

      return {
        ...student,
        averageGrade: Math.round(avgPercentage * 10) / 10,
        totalGrades: studentGrades.length,
        attendanceRate: attendanceStats.attendanceRate,
        totalDays: attendanceStats.totalDays,
        presentDays: attendanceStats.presentDays,
        grades: studentGrades
      };
    });
  };

  const generateGradeDistribution = () => {
    const allGrades = myGrades.filter(grade =>
      reportGrade === 'all' || myStudents.find(s => s.id === grade.studentId)?.grade === reportGrade
    );

    const distribution = {
      'D': allGrades.filter(g => g.score === 'D').length,
      'C': allGrades.filter(g => g.score === 'C').length,
      'UP': allGrades.filter(g => g.score === 'UP').length,
      'P': allGrades.filter(g => g.score === 'P').length,
      'F': allGrades.filter(g => g.score === 'F').length,
    };

    return { distribution, total: allGrades.length };
  };

  const handleEmailReport = async (reportType: string) => {
    if (!emailAddress) {
      toast({ title: 'Error', description: 'Please enter an email address' });
      return;
    }

    setIsGeneratingReport(true);
    // Simulate email sending
    setTimeout(() => {
      setIsGeneratingReport(false);
      toast({
        title: 'Success',
        description: `${reportType} report has been sent to ${emailAddress}`
      });
    }, 2000);
  };

  const handlePrintReport = (reportType: string) => {
    // In a real implementation, this would generate and print the report
    toast({
      title: 'Printing',
      description: `${reportType} report is being prepared for printing`
    });
    window.print();
  };

  const handleDownloadReport = (reportType: string) => {
    // In a real implementation, this would generate and download a PDF
    toast({
      title: 'Download Started',
      description: `${reportType} report is being downloaded as PDF`
    });
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
                        <TableHead>Subjects</TableHead>
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
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {student.subjects.slice(0, 3).map((subject, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {subject.length > 12 ? subject.substring(0, 12) + '...' : subject}
                                  </Badge>
                                ))}
                                {student.subjects.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{student.subjects.length - 3} more
                                  </Badge>
                                )}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openSubjectModal(student)}
                                className="ml-2"
                              >
                                <BookOpen className="h-3 w-3 mr-1" />
                                Manage
                              </Button>
                            </div>
                          </TableCell>
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

              {/* Subject Management Modal */}
              <Dialog open={subjectModal.open} onOpenChange={(open) => setSubjectModal(prev => ({ ...prev, open }))}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Manage Subjects for {subjectModal.student?.name}
                    </DialogTitle>
                  </DialogHeader>

                  {subjectModal.student && (
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Student Information</h4>
                          <Badge variant="outline">
                            {subjectModal.student.grade} {subjectModal.student.class}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Currently enrolled in {selectedStudentSubjects.length} subjects
                          (Recommended: 7-9 subjects, Maximum: 10 subjects)
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">
                          Available Subjects for {subjectModal.student.grade}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {getAvailableSubjects(subjectModal.student.grade).map((subject) => (
                            <div
                              key={subject}
                              className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                selectedStudentSubjects.includes(subject)
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => toggleSubject(subject)}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{subject}</span>
                                {selectedStudentSubjects.includes(subject) && (
                                  <Check className="h-4 w-4 text-blue-600" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Selected Subjects ({selectedStudentSubjects.length})</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedStudentSubjects.map((subject, idx) => (
                            <Badge key={idx} variant="default" className="flex items-center gap-1">
                              {subject}
                              <X
                                className="h-3 w-3 cursor-pointer hover:bg-white/20 rounded"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSubject(subject);
                                }}
                              />
                            </Badge>
                          ))}
                        </div>
                        {selectedStudentSubjects.length < 7 && (
                          <p className="text-sm text-yellow-600 mt-2">
                            ⚠️ Students should have at least 7 subjects
                          </p>
                        )}
                        {selectedStudentSubjects.length === 10 && (
                          <p className="text-sm text-red-600 mt-2">
                            ⚠️ Maximum subject limit reached (10 subjects)
                          </p>
                        )}
                      </div>

                      <div className="flex justify-end gap-2 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setSubjectModal({ open: false, student: null })}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => subjectModal.student && handleUpdateStudentSubjects(subjectModal.student.id, selectedStudentSubjects)}
                          disabled={selectedStudentSubjects.length === 0}
                        >
                          Update Subjects ({selectedStudentSubjects.length})
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          )}

          {activeSection === 'attendance' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Take Attendance</h2>

              {/* Date Selection */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Label className="text-sm font-medium">Select Date:</Label>
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(attendanceDate, 'EEEE, MMMM d, yyyy')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={attendanceDate}
                          onSelect={(date) => {
                            if (date) {
                              setAttendanceDate(date);
                              setIsCalendarOpen(false);
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </CardContent>
              </Card>

              {/* Grade and Class Selection */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium whitespace-nowrap">Select Class:</Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Select
                        value={attendanceGrade}
                        onValueChange={(value) => {
                          setAttendanceGrade(value);
                          setAttendanceClass('all');
                          setAttendanceRecords({});
                        }}
                      >
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="Select Grade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Select Grade</SelectItem>
                          <SelectItem value="Grade 9">Grade 9</SelectItem>
                          <SelectItem value="Grade 10">Grade 10</SelectItem>
                          <SelectItem value="Grade 11">Grade 11</SelectItem>
                          <SelectItem value="Grade 12">Grade 12</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {attendanceGrade !== 'all' && (
                      <div className="flex items-center gap-2">
                        <Select
                          value={attendanceClass}
                          onValueChange={(value) => {
                            setAttendanceClass(value);
                            setAttendanceRecords({});
                          }}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Select Class" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Select Class</SelectItem>
                            {getClassOptions(attendanceGrade).map((classOption) => (
                              <SelectItem key={classOption} value={classOption}>
                                {classOption}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Student Attendance List */}
              {attendanceGrade !== 'all' && attendanceClass !== 'all' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Students in {attendanceGrade} {attendanceClass}</span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowHistory(!showHistory)}
                        >
                          {showHistory ? 'Hide History' : 'View History'}
                        </Button>
                        <Button
                          onClick={handleSubmitAttendance}
                          disabled={Object.keys(attendanceRecords).length === 0}
                        >
                          Save Attendance
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {!showHistory ? (
                      <div className="space-y-4">
                        {getAttendanceStudents().map((student) => (
                          <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-medium">{student.name}</h4>
                              <p className="text-sm text-gray-500">{student.grade} {student.class}</p>
                            </div>

                            {/* Attendance Status Circles */}
                            <div className="flex items-center gap-3 mr-4">
                              <button
                                onClick={() => handleAttendanceStatusChange(student.id, 'Present')}
                                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                                  attendanceRecords[student.id]?.status === 'Present'
                                    ? 'bg-green-500 border-green-500 text-white'
                                    : 'border-green-300 hover:border-green-500'
                                }`}
                                title="Present"
                              >
                                <Check className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleAttendanceStatusChange(student.id, 'Absent')}
                                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                                  attendanceRecords[student.id]?.status === 'Absent'
                                    ? 'bg-red-500 border-red-500 text-white'
                                    : 'border-red-300 hover:border-red-500'
                                }`}
                                title="Absent"
                              >
                                <X className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleAttendanceStatusChange(student.id, 'Late')}
                                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                                  attendanceRecords[student.id]?.status === 'Late'
                                    ? 'bg-yellow-500 border-yellow-500 text-white'
                                    : 'border-yellow-300 hover:border-yellow-500'
                                }`}
                                title="Late"
                              >
                                <Clock className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Notes Input */}
                            <div className="w-64">
                              <Textarea
                                placeholder="Notes (optional)"
                                value={attendanceRecords[student.id]?.notes || ''}
                                onChange={(e) => handleAttendanceNotesChange(student.id, e.target.value)}
                                rows={2}
                                className="text-sm"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800">Attendance History - {attendanceGrade} {attendanceClass}</h3>

                        {getAttendanceStudents().map((student) => {
                          const stats = getStudentAttendanceStats(student.id);
                          const history = getStudentAttendanceHistory(student.id);

                          return (
                            <div key={student.id} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <h4 className="font-medium">{student.name}</h4>
                                  <p className="text-sm text-gray-500">{student.grade} {student.class}</p>
                                </div>

                                {/* Attendance Statistics */}
                                <div className="flex gap-6 text-sm">
                                  <div className="text-center">
                                    <div className="font-semibold text-lg">{stats.totalDays}</div>
                                    <div className="text-gray-500">Total Days</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-semibold text-lg text-green-600">{stats.presentDays}</div>
                                    <div className="text-gray-500">Present</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-semibold text-lg text-red-600">{stats.absentDays}</div>
                                    <div className="text-gray-500">Absent</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-semibold text-lg text-yellow-600">{stats.lateDays}</div>
                                    <div className="text-gray-500">Late</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-semibold text-lg text-blue-600">{stats.attendanceRate}%</div>
                                    <div className="text-gray-500">Rate</div>
                                  </div>
                                </div>
                              </div>

                              {/* Recent Attendance Records */}
                              <div className="mt-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedStudentForHistory(
                                    selectedStudentForHistory === student.id ? null : student.id
                                  )}
                                >
                                  {selectedStudentForHistory === student.id ? 'Hide Details' : 'View Details'}
                                </Button>

                                {selectedStudentForHistory === student.id && (
                                  <div className="mt-4 max-h-60 overflow-y-auto">
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Date</TableHead>
                                          <TableHead>Status</TableHead>
                                          <TableHead>Notes</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {history.slice(0, 10).map((record) => (
                                          <TableRow key={record.id}>
                                            <TableCell>{record.date}</TableCell>
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
                                            <TableCell>{record.notes || '-'}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                    {history.length > 10 && (
                                      <p className="text-sm text-gray-500 mt-2 text-center">
                                        Showing last 10 records of {history.length} total
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}



          {activeSection === 'grades' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Grade Management</h2>
              </div>

              <div className="mb-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by student name, subject, or assignment..."
                    value={gradeSearch}
                    onChange={(e) => setGradeSearch(e.target.value)}
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
                      value={gradeFilterGrade}
                      onValueChange={(value) => {
                        setGradeFilterGrade(value);
                        setGradeFilterClass('all');
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

                  {gradeFilterGrade !== 'all' && (
                    <div className="flex items-center gap-2">
                      <Select
                        value={gradeFilterClass}
                        onValueChange={setGradeFilterClass}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="All Classes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Classes</SelectItem>
                          {getClassOptions(gradeFilterGrade).map((classOption) => (
                            <SelectItem key={classOption} value={classOption}>
                              {classOption}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {(gradeFilterGrade !== 'all' || gradeFilterClass !== 'all') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setGradeFilterGrade('all');
                        setGradeFilterClass('all');
                      }}
                      className="text-xs"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>

              {/* Student-based Grade View */}
              {gradeFilterGrade !== 'all' && gradeFilterClass !== 'all' ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Students in {gradeFilterGrade} {gradeFilterClass}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {getGradeFilteredStudents().map((student) => {
                        const studentGrades = getStudentGrades(student.id);
                        return (
                          <div key={student.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h4 className="font-medium">{student.name}</h4>
                                <p className="text-sm text-gray-500">{student.grade} {student.class}</p>
                              </div>

                              <div className="flex gap-2">
                                <Dialog open={gradeModal.open} onOpenChange={(open) => setGradeModal(prev => ({ ...prev, open }))}>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      onClick={() => setGradeModal({
                                        open: true,
                                        mode: 'add',
                                        data: { studentId: student.id, studentName: student.name } as any
                                      })}
                                    >
                                      <Plus className="mr-1 h-3 w-3" />
                                      Add Grade
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-md">
                                    <DialogHeader>
                                      <DialogTitle>Add Grade for {student.name}</DialogTitle>
                                    </DialogHeader>
                                    <GradeForm
                                      mode="add"
                                      grade={null}
                                      preselectedStudent={student}
                                      students={myStudents}
                                      onSave={(grade) => {
                                        handleAddGrade(grade);
                                      }}
                                      onCancel={() => setGradeModal({ open: false, mode: 'add', data: null })}
                                    />
                                  </DialogContent>
                                </Dialog>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedStudentForGrade(
                                    selectedStudentForGrade === student.id ? null : student.id
                                  )}
                                >
                                  {selectedStudentForGrade === student.id ? 'Hide Grades' : 'View Grades'}
                                </Button>
                              </div>
                            </div>

                            {selectedStudentForGrade === student.id && (
                              <div className="mt-4">
                                {studentGrades.length > 0 ? (
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Assignment</TableHead>
                                        <TableHead>Score</TableHead>
                                        <TableHead>Percentage</TableHead>
                                        <TableHead>Ranking</TableHead>
                                        <TableHead>Term</TableHead>
                                        <TableHead>Actions</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {studentGrades.map((grade) => (
                                        <TableRow key={grade.id}>
                                          <TableCell>{grade.subject}</TableCell>
                                          <TableCell>{grade.assignment}</TableCell>
                                          <TableCell>{grade.score}</TableCell>
                                          <TableCell>{grade.percentage}%</TableCell>
                                          <TableCell>
                                            <Badge variant="outline">
                                              {getStudentRanking(student.id, grade.subject, grade.term) || 'N/A'}
                                            </Badge>
                                          </TableCell>
                                          <TableCell>{grade.term}</TableCell>
                                          <TableCell>
                                            <div className="flex gap-1">
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setGradeModal({ open: true, mode: 'edit', data: grade })}
                                              >
                                                <Edit className="h-3 w-3" />
                                              </Button>
                                              <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDeleteGrade(grade.id)}
                                              >
                                                <Trash2 className="h-3 w-3" />
                                              </Button>
                                            </div>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                ) : (
                                  <p className="text-gray-500 text-center py-4">No grades recorded for this student</p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ) : (
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
              )}
            </div>
          )}

          {activeSection === 'reports' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Student Reports</h2>

              {/* Report Filters */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Report Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium whitespace-nowrap">Filter by:</Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Select
                        value={reportGrade}
                        onValueChange={(value) => {
                          setReportGrade(value);
                          setReportClass('all');
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

                    {reportGrade !== 'all' && (
                      <div className="flex items-center gap-2">
                        <Select
                          value={reportClass}
                          onValueChange={setReportClass}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="All Classes" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Classes</SelectItem>
                            {getClassOptions(reportGrade).map((classOption) => (
                              <SelectItem key={classOption} value={classOption}>
                                {classOption}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Report Types */}
              <div className="grid gap-6">
                {/* Student Performance Report */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Student Performance Report
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-gray-600 mb-4">
                        Comprehensive performance analysis for {reportGrade !== 'all' && reportClass !== 'all' ? `${reportGrade} ${reportClass}` : 'all assigned students'}.
                      </p>

                      {selectedReportType === 'performance' ? (
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-3">Performance Summary</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {generateStudentPerformanceReport().map((student) => (
                                <div key={student.id} className="bg-white p-3 rounded border">
                                  <h5 className="font-medium">{student.name}</h5>
                                  <p className="text-sm text-gray-600">{student.grade} {student.class}</p>
                                  <div className="mt-2 space-y-1">
                                    <div className="flex justify-between text-sm">
                                      <span>Average Grade:</span>
                                      <span className="font-medium">{student.averageGrade}%</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span>Total Assessments:</span>
                                      <span>{student.totalGrades}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span>Attendance Rate:</span>
                                      <span>{student.attendanceRate}%</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-2 items-center">
                            <Input
                              placeholder="Enter email address"
                              value={emailAddress}
                              onChange={(e) => setEmailAddress(e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              onClick={() => handleEmailReport('Student Performance')}
                              disabled={isGeneratingReport}
                            >
                              <Mail className="mr-1 h-4 w-4" />
                              Email
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleDownloadReport('Student Performance')}
                            >
                              <Download className="mr-1 h-4 w-4" />
                              Download PDF
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handlePrintReport('Student Performance')}
                            >
                              <Printer className="mr-1 h-4 w-4" />
                              Print
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setSelectedReportType('performance')}
                          className="w-full"
                        >
                          Generate Performance Report
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Grade Distribution Report */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Grade Distribution Report
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-gray-600 mb-4">
                        Distribution of grades across {reportGrade !== 'all' ? reportGrade : 'all grades'}.
                      </p>

                      {selectedReportType === 'distribution' ? (
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-3">Grade Distribution</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {Object.entries(generateGradeDistribution().distribution).map(([grade, count]) => (
                                <div key={grade} className="bg-white p-3 rounded border text-center">
                                  <div className="font-semibold text-lg">{count}</div>
                                  <div className="text-sm text-gray-600">Grade {grade}</div>
                                  <div className="text-xs text-gray-500">
                                    {generateGradeDistribution().total > 0
                                      ? Math.round((count / generateGradeDistribution().total) * 100)
                                      : 0}%
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 text-center">
                              <span className="text-sm text-gray-600">
                                Total Assessments: {generateGradeDistribution().total}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2 items-center">
                            <Input
                              placeholder="Enter email address"
                              value={emailAddress}
                              onChange={(e) => setEmailAddress(e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              onClick={() => handleEmailReport('Grade Distribution')}
                              disabled={isGeneratingReport}
                            >
                              <Mail className="mr-1 h-4 w-4" />
                              Email
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleDownloadReport('Grade Distribution')}
                            >
                              <Download className="mr-1 h-4 w-4" />
                              Download PDF
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handlePrintReport('Grade Distribution')}
                            >
                              <Printer className="mr-1 h-4 w-4" />
                              Print
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setSelectedReportType('distribution')}
                          className="w-full"
                        >
                          Generate Distribution Report
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Attendance Summary Report */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5" />
                      Attendance Summary Report
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-gray-600 mb-4">
                        Detailed attendance analysis for {reportGrade !== 'all' && reportClass !== 'all' ? `${reportGrade} ${reportClass}` : 'all students'}.
                      </p>

                      {selectedReportType === 'attendance' ? (
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-3">Attendance Overview</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {generateStudentPerformanceReport().map((student) => (
                                <div key={student.id} className="bg-white p-3 rounded border">
                                  <h5 className="font-medium">{student.name}</h5>
                                  <p className="text-sm text-gray-600">{student.grade} {student.class}</p>
                                  <div className="mt-2 space-y-1">
                                    <div className="flex justify-between text-sm">
                                      <span>Attendance Rate:</span>
                                      <span className={`font-medium ${
                                        student.attendanceRate >= 90 ? 'text-green-600' :
                                        student.attendanceRate >= 80 ? 'text-yellow-600' : 'text-red-600'
                                      }`}>{student.attendanceRate}%</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span>Present Days:</span>
                                      <span>{student.presentDays}/{student.totalDays}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-2 items-center">
                            <Input
                              placeholder="Enter email address"
                              value={emailAddress}
                              onChange={(e) => setEmailAddress(e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              onClick={() => handleEmailReport('Attendance Summary')}
                              disabled={isGeneratingReport}
                            >
                              <Mail className="mr-1 h-4 w-4" />
                              Email
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleDownloadReport('Attendance Summary')}
                            >
                              <Download className="mr-1 h-4 w-4" />
                              Download PDF
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handlePrintReport('Attendance Summary')}
                            >
                              <Printer className="mr-1 h-4 w-4" />
                              Print
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setSelectedReportType('attendance')}
                          className="w-full"
                        >
                          Generate Attendance Report
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Student Progress Report */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileBarChart className="h-5 w-5" />
                      Student Progress Report
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-gray-600 mb-4">
                        Individual progress tracking with trends and recommendations.
                      </p>

                      {selectedReportType === 'progress' ? (
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-3">Progress Analysis</h4>
                            <div className="space-y-4">
                              {generateStudentPerformanceReport().map((student) => (
                                <div key={student.id} className="bg-white p-4 rounded border">
                                  <div className="flex justify-between items-start mb-3">
                                    <div>
                                      <h5 className="font-medium">{student.name}</h5>
                                      <p className="text-sm text-gray-600">{student.grade} {student.class}</p>
                                    </div>
                                    <Badge variant={
                                      student.averageGrade >= 85 ? 'default' :
                                      student.averageGrade >= 70 ? 'secondary' : 'destructive'
                                    }>
                                      {student.averageGrade >= 85 ? 'Excellent' :
                                       student.averageGrade >= 70 ? 'Good' : 'Needs Improvement'}
                                    </Badge>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="text-gray-600">Academic Performance:</span>
                                      <div className="font-medium">{student.averageGrade}% average</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Attendance:</span>
                                      <div className="font-medium">{student.attendanceRate}%</div>
                                    </div>
                                  </div>
                                  <div className="mt-3 text-sm">
                                    <span className="text-gray-600">Recent Assessments:</span>
                                    <div className="mt-1">
                                      {student.grades.slice(0, 3).map((grade, idx) => (
                                        <span key={idx} className="inline-block mr-2 mb-1">
                                          {grade.subject}: {grade.score} ({grade.percentage}%)
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-2 items-center">
                            <Input
                              placeholder="Enter email address"
                              value={emailAddress}
                              onChange={(e) => setEmailAddress(e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              onClick={() => handleEmailReport('Student Progress')}
                              disabled={isGeneratingReport}
                            >
                              <Mail className="mr-1 h-4 w-4" />
                              Email
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleDownloadReport('Student Progress')}
                            >
                              <Download className="mr-1 h-4 w-4" />
                              Download PDF
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handlePrintReport('Student Progress')}
                            >
                              <Printer className="mr-1 h-4 w-4" />
                              Print
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setSelectedReportType('progress')}
                          className="w-full"
                        >
                          Generate Progress Report
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
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
      subjects: [],
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
    if (formData.name && formData.grade && formData.class) {
      // If no subjects are set, initialize with default subjects for the grade
      if (!formData.subjects || formData.subjects.length === 0) {
        const defaultSubjects = formData.grade === 'Grade 9' || formData.grade === 'Grade 10'
          ? ['Mathematics', 'English', 'Science', 'Social Science', 'Personal Development', 'Arts', 'Business Studies']
          : ['Language and Literature', 'General Mathematics', 'Biology', 'Chemistry', 'Physics', 'Economics', 'Personal Development'];

        setFormData(prev => ({ ...prev, subjects: defaultSubjects }));
        onSave(mode === 'edit' ? { ...formData, subjects: defaultSubjects } as Student : { ...formData, subjects: defaultSubjects } as Omit<Student, 'id'>);
      } else {
        onSave(mode === 'edit' ? formData as Student : formData as Omit<Student, 'id'>);
      }
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
                <SelectItem value="no-grade" disabled>
                  Select Grade First
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg">
        <Label className="text-sm font-medium text-blue-800">Subject Management</Label>
        <p className="text-sm text-blue-700 mt-1">
          Default subjects will be assigned based on grade level. You can manage subjects after creating the student using the "Manage" button in the students list.
        </p>
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
      subject: '',
      notes: '',
    }
  );

  // Get the selected student's enrolled subjects
  const getStudentSubjects = () => {
    const selectedStudent = formData.studentId
      ? students.find(s => s.id === formData.studentId)
      : null;

    return selectedStudent?.subjects || [];
  };

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
            <SelectValue placeholder={formData.studentId ? "Select Subject" : "Select Student First"} />
          </SelectTrigger>
          <SelectContent>
            {getStudentSubjects().length > 0 ? (
              getStudentSubjects().map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-student" disabled>
                {formData.studentId ? "No subjects enrolled" : "Select a student first"}
              </SelectItem>
            )}
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
  preselectedStudent,
  onSave,
  onCancel
}: {
  mode: 'add' | 'edit';
  grade: Grade | null;
  students: Student[];
  preselectedStudent?: Student;
  onSave: (grade: Omit<Grade, 'id'> | Grade) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Grade>>(
    grade || {
      studentId: preselectedStudent?.id || 0,
      studentName: preselectedStudent?.name || '',
      subject: '',
      score: '',
      percentage: 0,
      term: 'Term 1',
      assignment: '',
    }
  );

  // Get the selected student's enrolled subjects
  const getStudentSubjects = () => {
    const selectedStudent = formData.studentId
      ? students.find(s => s.id === formData.studentId)
      : preselectedStudent;

    return selectedStudent?.subjects || [];
  };

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
        {preselectedStudent ? (
          <div className="flex h-10 w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-sm">
            {preselectedStudent.name} ({preselectedStudent.grade} {preselectedStudent.class})
          </div>
        ) : (
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
        )}
      </div>

      <div>
        <Label htmlFor="subject">Subject</Label>
        <Select
          value={formData.subject || ''}
          onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder={formData.studentId || preselectedStudent ? "Select Subject" : "Select Student First"} />
          </SelectTrigger>
          <SelectContent>
            {getStudentSubjects().length > 0 ? (
              getStudentSubjects().map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-student" disabled>
                {formData.studentId || preselectedStudent ? "No subjects enrolled" : "Select a student first"}
              </SelectItem>
            )}
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
              <SelectItem value="D">D</SelectItem>
              <SelectItem value="C">C</SelectItem>
              <SelectItem value="UP">UP</SelectItem>
              <SelectItem value="P">P</SelectItem>
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
            <SelectItem value="Term 4">Term 4</SelectItem>
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
