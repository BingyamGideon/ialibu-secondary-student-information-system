import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserCheck, 
  TrendingUp,
  FileText,
  Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function StaffDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');

  // Sample data for staff dashboard (limited access)
  const stats = {
    myStudents: 45,
    avgGrade: 87.3,
    attendanceRate: 94.2,
    assignedClasses: 3
  };

  const handleLogout = () => {
    navigate('/');
  };

  const staffMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: UserCheck },
    { id: 'grades', label: 'Grades', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

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
                  <p className="text-xs text-muted-foreground">
                    Students assigned to you
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.avgGrade}%</div>
                  <p className="text-xs text-muted-foreground">
                    Your classes average
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    Your classes this month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Assigned Classes</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.assignedClasses}</div>
                  <p className="text-xs text-muted-foreground">
                    Classes you teach
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Staff Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <Card className="mt-8">
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
                      15 grades entered<br />
                      3 attendance records updated<br />
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
        </main>
      </div>
    </div>
  );
}
