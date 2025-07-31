import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface User {
  username: string;
  password: string;
  type: 'admin' | 'staff';
}

export default function Index() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Authentication state
  const [isLogin, setIsLogin] = useState(true);
  const [loginForm, setLoginForm] = useState({ 
    username: '', 
    password: '', 
    confirmPassword: '', 
    userType: 'admin' as 'admin' | 'staff' 
  });
  
  const [users, setUsers] = useState<User[]>([
    { username: 'admin', password: 'admin123', type: 'admin' },
    { username: 'staff', password: 'staff123', type: 'staff' },
  ]);

  // Handle authentication
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      const user = users.find(u => u.username === loginForm.username && u.password === loginForm.password);
      if (user) {
        toast({ title: 'Login successful', description: `Welcome back, ${user.username}!` });
        // Redirect based on user type
        if (user.type === 'admin') {
          navigate('/admin');
        } else {
          navigate('/staff');
        }
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
      setLoginForm({ username: '', password: '', confirmPassword: '', userType: 'admin' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full grid md:grid-cols-2">
        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white p-8 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-4">Ialibu Secondary School</h1>
          <h2 className="text-xl font-semibold mb-4">Student & Staff Information System</h2>
          <p className="text-blue-100 leading-relaxed mb-6">
            Welcome to our comprehensive student information system. Manage students, track attendance, 
            monitor grades, and handle financial records efficiently.
          </p>
          <div className="bg-white/10 rounded-lg p-4 mb-4">
            <h3 className="font-semibold mb-2">Admin Access:</h3>
            <p className="text-sm text-blue-100">
              • Students, Attendance, Grades<br/>
              • Finance Management<br/>
              • Staff Administration<br/>
              • Comprehensive Reports
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Staff Access:</h3>
            <p className="text-sm text-blue-100">
              • Students (assigned classes)<br/>
              • Attendance Tracking<br/>
              • Grade Management<br/>
              • Student Reports
            </p>
          </div>
        </div>

        {/* Auth Form Section */}
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              {isLogin ? 'School Login' : 'Create Account'}
            </h2>
            <p className="text-gray-600 mt-2">
              {isLogin ? 'Sign in to access your dashboard' : 'Fill in your details to register'}
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
                placeholder="Enter your username"
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
                placeholder="Enter your password"
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
                    placeholder="Confirm your password"
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
                      <SelectItem value="staff">Staff Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800 text-white">
              {isLogin ? 'Login' : 'Register'}
            </Button>
          </form>

          {/* Demo Credentials */}
          {isLogin && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Demo Credentials:</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>Admin:</strong> admin / admin123</div>
                <div><strong>Staff:</strong> staff / staff123</div>
              </div>
            </div>
          )}

          <div className="text-center mt-6">
            <span className="text-gray-600">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </span>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setLoginForm({ username: '', password: '', confirmPassword: '', userType: 'admin' });
              }}
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
