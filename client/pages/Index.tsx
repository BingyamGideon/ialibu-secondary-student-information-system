import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  UserCheck, 
  TrendingUp, 
  DollarSign, 
  UserPlus, 
  Calendar, 
  BarChart3, 
  CreditCard, 
  UserCog, 
  FileText,
  Search,
  Edit,
  Trash2,
  Home
} from 'lucide-react';

interface Student {
  id: number;
  firstname: string;
  lastname: string;
  dob: string;
  gender: string;
  grade: string;
  class: string;
  address: string;
}

interface Attendance {
  id: number;
  date: string;
  studentId: number;
  status: string;
}

interface Grade {
  id: number;
  studentId: number;
  subject: string;
  score: string;
  percentage: number;
  term: string;
}

interface Finance {
  id: number;
  studentId: number;
  amount: number;
  date: string;
  status: string;
}

interface Staff {
  id: number;
  firstname: string;
  lastname: string;
  position: string;
  department: string;
  email: string;
  phone: string;
}

interface User {
  username: string;
  password: string;
  type: 'admin' | 'staff';
}

export default function Index() {
  const { toast } = useToast();
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [loginForm, setLoginForm] = useState({ username: '', password: '', confirmPassword: '', userType: 'admin' as 'admin' | 'staff' });
  
  // Navigation state
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('grade9');
  
  // Data state
  const [students, setStudents] = useState<Student[]>([
    { id: 1, firstname: 'John', lastname: 'Doe', dob: '2007-05-15', gender: 'M', grade: 'Grade 9', class: 'A', address: '123 Main St, Ialibu' },
    { id: 2, firstname: 'Jane', lastname: 'Smith', dob: '2008-03-22', gender: 'F', grade: 'Grade 9', class: 'A', address: '456 Oak Ave, Ialibu' },
    { id: 3, firstname: 'Michael', lastname: 'Johnson', dob: '2006-11-08', gender: 'M', grade: 'Grade 10', class: 'B', address: '789 Pine Rd, Ialibu' },
    { id: 4, firstname: 'Emily', lastname: 'Williams', dob: '2007-07-12', gender: 'F', grade: 'Grade 10', class: 'A', address: '101 Maple St, Ialibu' },
  ]);
  
  const [attendance, setAttendance] = useState<Attendance[]>([
    { id: 1, date: '2023-10-01', studentId: 1, status: 'Present' },
    { id: 2, date: '2023-10-01', studentId: 2, status: 'Absent' },
    { id: 3, date: '2023-10-01', studentId: 3, status: 'Late' },
    { id: 4, date: '2023-10-01', studentId: 4, status: 'Present' },
  ]);
  
  const [grades, setGrades] = useState<Grade[]>([
    { id: 1, studentId: 1, subject: 'Mathematics', score: 'A', percentage: 92, term: 'Term 1' },
    { id: 2, studentId: 2, subject: 'English', score: 'B', percentage: 85, term: 'Term 1' },
    { id: 3, studentId: 3, subject: 'Science', score: 'A-', percentage: 90, term: 'Term 1' },
    { id: 4, studentId: 4, subject: 'History', score: 'B+', percentage: 87, term: 'Term 1' },
  ]);
  
  const [finance, setFinance] = useState<Finance[]>([
    { id: 1, studentId: 1, amount: 500, date: '2023-09-15', status: 'Paid' },
    { id: 2, studentId: 2, amount: 300, date: '2023-09-20', status: 'Pending' },
    { id: 3, studentId: 3, amount: 500, date: '2023-09-10', status: 'Paid' },
    { id: 4, studentId: 4, amount: 450, date: '2023-09-25', status: 'Paid' },
  ]);
  
  const [staff, setStaff] = useState<Staff[]>([
    { id: 1, firstname: 'James', lastname: 'Anderson', position: 'Principal', department: 'Administration', email: 'j.anderson@ialibu.edu', phone: '123-456-7890' },
    { id: 2, firstname: 'Mary', lastname: 'Taylor', position: 'Vice Principal', department: 'Administration', email: 'm.taylor@ialibu.edu', phone: '123-456-7891' },
    { id: 3, firstname: 'Robert', lastname: 'Thomas', position: 'Math Teacher', department: 'Academics', email: 'r.thomas@ialibu.edu', phone: '123-456-7892' },
  ]);
  
  const [users] = useState<User[]>([
    { username: 'admin', password: 'admin123', type: 'admin' },
    { username: 'staff', password: 'staff123', type: 'staff' },
  ]);

  // Search states
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [studentModal, setStudentModal] = useState({ open: false, mode: 'add', data: null as Student | null });
  const [attendanceModal, setAttendanceModal] = useState({ open: false, mode: 'add', data: null as Attendance | null });
  const [gradeModal, setGradeModal] = useState({ open: false, mode: 'add', data: null as Grade | null });
  const [financeModal, setFinanceModal] = useState({ open: false, mode: 'add', data: null as Finance | null });
  const [staffModal, setStaffModal] = useState({ open: false, mode: 'add', data: null as Staff | null });

  // Handle authentication
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      const user = users.find(u => u.username === loginForm.username && u.password === loginForm.password);
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        toast({ title: 'Login successful', description: `Welcome back, ${user.username}!` });
      } else {
        toast({ title: 'Login failed', description: 'Invalid username or password', variant: 'destructive' });
      }
    } else {
      if (loginForm.password !== loginForm.confirmPassword) {
        toast({ title: 'Registration failed', description: 'Passwords do not match', variant: 'destructive' });
        return;
      }
      toast({ title: 'Registration successful', description: 'You can now login with your credentials!' });
      setIsLogin(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setLoginForm({ username: '', password: '', confirmPassword: '', userType: 'admin' });
  };

  // Calculate dashboard stats
  const totalStudents = students.length;
  const avgGrade = grades.length > 0 ? (grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length).toFixed(1) : '0';
  const totalRevenue = finance.reduce((sum, f) => sum + f.amount, 0);
  const attendanceRate = attendance.length > 0 ? ((attendance.filter(a => a.status === 'Present').length / attendance.length) * 100).toFixed(1) : '0';

  // Filter students by grade and class
  const getStudentsByGradeClass = (grade: string, className: string) => {
    return students.filter(s => s.grade === grade && s.class === className);
  };

  // Get student name by ID
  const getStudentName = (studentId: number) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.firstname} ${student.lastname}` : 'Unknown Student';
  };

  // Get available menu items based on user type
  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'students', label: 'Students', icon: Users },
      { id: 'attendance', label: 'Attendance', icon: UserCheck },
      { id: 'grades', label: 'Grades', icon: BarChart3 },
      { id: 'reports', label: 'Reports', icon: FileText },
    ];

    if (currentUser?.type === 'admin') {
      return [
        ...baseItems,
        { id: 'finance', label: 'Finance', icon: CreditCard },
        { id: 'staff', label: 'Staff', icon: UserCog },
      ];
    }

    return baseItems;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full grid md:grid-cols-2">
          {/* Welcome Section */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white p-8 flex flex-col justify-center">
            <h1 className="text-3xl font-bold mb-4">Ialibu Secondary School</h1>
            <h2 className="text-xl font-semibold mb-4">Student & Staff Information</h2>
            <p className="text-blue-100 leading-relaxed">
              Welcome to our student information system. Register students, track attendance, monitor grades, and handle financial records efficiently.
            </p>
          </div>

          {/* Auth Form Section */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                {isLogin ? 'Admin Login' : 'Create Account'}
              </h2>
              <p className="text-gray-600 mt-2">
                {isLogin ? 'Sign in to access the dashboard' : 'Fill in your details to register'}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>

              {!isLogin && (
                <>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={loginForm.confirmPassword}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="userType">User Type</Label>
                    <Select
                      value={loginForm.userType}
                      onValueChange={(value: 'admin' | 'staff') => setLoginForm(prev => ({ ...prev, userType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800">
                {isLogin ? 'Login' : 'Register'}
              </Button>
            </form>

            <div className="text-center mt-6">
              <span className="text-gray-600">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
              </span>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-blue-900 font-semibold hover:underline"
              >
                {isLogin ? 'Register here' : 'Login here'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-900 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Ialibu Secondary School Dashboard</h1>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-white/20 text-white">
              {currentUser?.type === 'admin' ? 'Administrator' : 'Staff Member'}: {currentUser?.username}
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
            {getMenuItems().map((item) => {
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
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalStudents}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{avgGrade}%</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">K{totalRevenue.toFixed(2)}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{attendanceRate}%</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Welcome to the Ialibu Secondary School Management System. Here you can manage all aspects of student information.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'students' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Student Management</h2>
                <Dialog open={studentModal.open} onOpenChange={(open) => setStudentModal(prev => ({ ...prev, open }))}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setStudentModal({ open: true, mode: 'add', data: null })}>
                      <UserPlus className="mr-2 h-4 w-4" />
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
                      onSave={(student) => {
                        if (studentModal.mode === 'add') {
                          const newStudent = { ...student, id: Math.max(...students.map(s => s.id)) + 1 };
                          setStudents(prev => [...prev, newStudent]);
                          toast({ title: 'Success', description: 'Student added successfully' });
                        } else {
                          setStudents(prev => prev.map(s => s.id === student.id ? student : s));
                          toast({ title: 'Success', description: 'Student updated successfully' });
                        }
                        setStudentModal({ open: false, mode: 'add', data: null });
                      }}
                      onCancel={() => setStudentModal({ open: false, mode: 'add', data: null })}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="grade9">Grade 9</TabsTrigger>
                  <TabsTrigger value="grade10">Grade 10</TabsTrigger>
                  <TabsTrigger value="grade11">Grade 11</TabsTrigger>
                  <TabsTrigger value="grade12">Grade 12</TabsTrigger>
                </TabsList>

                {['grade9', 'grade10', 'grade11', 'grade12'].map((grade) => (
                  <TabsContent key={grade} value={grade}>
                    <div className="space-y-6">
                      {['A', 'B'].map((className) => {
                        const gradeNumber = grade.replace('grade', '');
                        const classStudents = getStudentsByGradeClass(`Grade ${gradeNumber}`, className)
                          .filter(student => 
                            searchTerm === '' || 
                            `${student.firstname} ${student.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
                          );

                        return (
                          <Card key={className}>
                            <CardHeader>
                              <CardTitle>Grade {gradeNumber}{className} ({classStudents.length} students)</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>DOB</TableHead>
                                    <TableHead>Gender</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead>Actions</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {classStudents.map((student) => (
                                    <TableRow key={student.id}>
                                      <TableCell>{student.id}</TableCell>
                                      <TableCell>{student.firstname} {student.lastname}</TableCell>
                                      <TableCell>{student.dob}</TableCell>
                                      <TableCell>{student.gender === 'M' ? 'Male' : student.gender === 'F' ? 'Female' : student.gender}</TableCell>
                                      <TableCell>{student.address}</TableCell>
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
                                            onClick={() => {
                                              setStudents(prev => prev.filter(s => s.id !== student.id));
                                              toast({ title: 'Success', description: 'Student deleted successfully' });
                                            }}
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
                        );
                      })}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}

          {activeSection === 'attendance' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Attendance Records</h2>
                <Button>
                  <Calendar className="mr-2 h-4 w-4" />
                  Add Attendance
                </Button>
              </div>

              <Card>
                <CardContent className="p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendance.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.date}</TableCell>
                          <TableCell>{record.studentId}</TableCell>
                          <TableCell>{getStudentName(record.studentId)}</TableCell>
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
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm">
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
                <Button>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Add Grade
                </Button>
              </div>

              <Card>
                <CardContent className="p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Percentage</TableHead>
                        <TableHead>Term</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {grades.map((grade) => (
                        <TableRow key={grade.id}>
                          <TableCell>{grade.studentId}</TableCell>
                          <TableCell>{getStudentName(grade.studentId)}</TableCell>
                          <TableCell>{grade.subject}</TableCell>
                          <TableCell>{grade.score}</TableCell>
                          <TableCell>{grade.percentage}%</TableCell>
                          <TableCell>{grade.term}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm">
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

          {activeSection === 'finance' && currentUser?.type === 'admin' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Financial Records</h2>
                <Button>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Add Payment
                </Button>
              </div>

              <Card>
                <CardContent className="p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {finance.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{payment.studentId}</TableCell>
                          <TableCell>{getStudentName(payment.studentId)}</TableCell>
                          <TableCell>K{payment.amount.toFixed(2)}</TableCell>
                          <TableCell>{payment.date}</TableCell>
                          <TableCell>
                            <Badge variant={payment.status === 'Paid' ? 'default' : 'secondary'}>
                              {payment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm">
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

          {activeSection === 'staff' && currentUser?.type === 'admin' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Staff Management</h2>
                <Button>
                  <UserCog className="mr-2 h-4 w-4" />
                  Add Staff
                </Button>
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
                      {staff.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>{member.id}</TableCell>
                          <TableCell>{member.firstname} {member.lastname}</TableCell>
                          <TableCell>{member.position}</TableCell>
                          <TableCell>{member.department}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>{member.phone}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm">
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
                  <CardTitle>Generate Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-w-sm">
                    <Label htmlFor="report-student">Select Student</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a student" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.id.toString()}>
                            {student.firstname} {student.lastname} ({student.grade} {student.class})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
  onSave, 
  onCancel 
}: { 
  mode: 'add' | 'edit'; 
  student: Student | null; 
  onSave: (student: Student) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState<Partial<Student>>(
    student || {
      firstname: '',
      lastname: '',
      dob: '',
      gender: '',
      grade: '',
      class: '',
      address: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.firstname && formData.lastname && formData.dob && formData.gender && formData.grade && formData.class && formData.address) {
      onSave(formData as Student);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstname">First Name</Label>
          <Input
            id="firstname"
            value={formData.firstname || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, firstname: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastname">Last Name</Label>
          <Input
            id="lastname"
            value={formData.lastname || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, lastname: e.target.value }))}
            required
          />
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
              <SelectItem value="M">Male</SelectItem>
              <SelectItem value="F">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="class">Class</Label>
        <Select
          value={formData.grade && formData.class ? `${formData.grade.split(' ')[1]}${formData.class}` : ''}
          onValueChange={(value) => {
            const gradeNum = value.substring(0, value.length - 1);
            const classLetter = value.substring(value.length - 1);
            setFormData(prev => ({ 
              ...prev, 
              grade: `Grade ${gradeNum}`, 
              class: classLetter 
            }));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="9A">Grade 9A</SelectItem>
            <SelectItem value="9B">Grade 9B</SelectItem>
            <SelectItem value="10A">Grade 10A</SelectItem>
            <SelectItem value="10B">Grade 10B</SelectItem>
            <SelectItem value="11A">Grade 11A</SelectItem>
            <SelectItem value="11B">Grade 11B</SelectItem>
            <SelectItem value="12A">Grade 12A</SelectItem>
            <SelectItem value="12B">Grade 12B</SelectItem>
          </SelectContent>
        </Select>
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
