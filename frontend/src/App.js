import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Shield, 
  Users, 
  Package, 
  Activity, 
  AlertTriangle, 
  Eye,
  Lock,
  Car,
  Wrench,
  Building,
  LogOut,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  Calendar,
  Settings,
  Search,
  Filter,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Zap,
  Wifi,
  WifiOff,
  MapPin,
  PieChart,
  BarChart3,
  Monitor,
  Cpu,
  HardDrive,
  Server,
  Database,
  Signal,
  Bell,
  BellRing
} from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Textarea } from './components/ui/textarea';
import { Alert, AlertDescription } from './components/ui/alert';
import { Progress } from './components/ui/progress';
import { Separator } from './components/ui/separator';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Auth Context
const AuthContext = React.createContext();

const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${API}/users/me`);
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API}/auth/login`, { username, password });
      const { access_token, user: userData } = response.data;
      
      setToken(access_token);
      setUser(userData);
      localStorage.setItem('token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Login Component
const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(credentials.username, credentials.password);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-black flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639313521811-fdfb1c040ddb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxjb250cm9sJTIwcm9vbXxlbnwwfHx8fDE3NTQxMDExMzV8MA&ixlib=rb-4.1.0&q=85')] bg-cover bg-center opacity-20"></div>
      
      <Card className="w-full max-w-md bg-black/80 backdrop-blur-xl border-gray-700 shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-yellow-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Wayne Industries</CardTitle>
          <CardDescription className="text-gray-300">
            Security Management System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert className="border-red-600 bg-red-900/20">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300">{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300">Username</Label>
              <Input
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-semibold"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-6 text-sm text-gray-400">
            <div className="text-center">
              <p className="mb-2 font-medium">Default Login Credentials:</p>
              <div className="space-y-1">
                <p><strong>Bruce Wayne:</strong> bruce.wayne / batman123</p>
                <p><strong>Lucius Fox:</strong> lucius.fox / foxtech123</p>
                <p><strong>Alfred:</strong> alfred.pennyworth / alfred123</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Enhanced Dashboard Component
const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    
    try {
      const response = await axios.get(`${API}/dashboard/stats`);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
      if (showRefresh) setRefreshing(false);
    }
  };

  const getSecurityBadgeColor = (level) => {
    switch (level) {
      case 'HIGH': return 'bg-red-600 animate-pulse';
      case 'ELEVATED': return 'bg-orange-600';
      case 'MEDIUM': return 'bg-yellow-600';
      default: return 'bg-green-600';
    }
  };

  const getAlertSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-900/20 border-red-600';
      case 'high': return 'text-orange-400 bg-orange-900/20 border-orange-600';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-600';
      default: return 'text-blue-400 bg-blue-900/20 border-blue-600';
    }
  };

  const SystemStatus = () => (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Monitor className="w-5 h-5" />
          <span>System Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Database</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-400 text-sm">Online</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-300">API Server</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-400 text-sm">Operational</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Security Grid</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-yellow-400 text-sm">Monitoring</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Network</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-400 text-sm">Connected</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ThreatLevel = () => (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Shield className="w-5 h-5" />
          <span>Threat Assessment</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Current Threat Level</span>
            <Badge className={`${getSecurityBadgeColor(dashboardData?.stats?.security_level)} text-white`}>
              {dashboardData?.stats?.security_level || 'NORMAL'}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Security Score</span>
              <span className="text-white">85%</span>
            </div>
            <Progress value={85} className="h-2" />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-green-400 font-bold">12</div>
              <div className="text-gray-400">Resolved</div>
            </div>
            <div className="text-center">
              <div className="text-yellow-400 font-bold">{dashboardData?.stats?.active_alerts || 0}</div>
              <div className="text-gray-400">Active</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-white">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="relative bg-gradient-to-r from-gray-900 to-slate-800 rounded-2xl p-6 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1685720543547-cc4873188c75?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwzfHxjb250cm9sJTIwcm9vbXxlbnwwfHx8fDE3NTQxMDExMzV8MA&ixlib=rb-4.1.0&q=85')] bg-cover bg-center opacity-30"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {user?.full_name}
              </h1>
              <p className="text-gray-300 mb-4">Wayne Industries Security Command Center</p>
              <div className="flex items-center space-x-4">
                <Badge className={`${getSecurityBadgeColor(dashboardData?.stats?.security_level)} text-white`}>
                  Security Level: {dashboardData?.stats?.security_level || 'NORMAL'}
                </Badge>
                <Badge variant="secondary" className="bg-gray-700 text-gray-200">
                  Role: {user?.role?.replace('_', ' ').toUpperCase()}
                </Badge>
                <div className="flex items-center space-x-1 text-gray-400 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Last update: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
            <Button
              onClick={() => fetchDashboardData(true)}
              disabled={refreshing}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600/20 p-3 rounded-full">
                <Package className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Resources</p>
                <p className="text-2xl font-bold text-white">
                  {dashboardData?.stats?.total_resources || 0}
                </p>
                <div className="flex items-center text-green-400 text-xs mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>+2 this week</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-green-600/20 p-3 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Active Resources</p>
                <p className="text-2xl font-bold text-white">
                  {dashboardData?.stats?.active_resources || 0}
                </p>
                <div className="flex items-center text-green-400 text-xs mt-1">
                  <span>98% uptime</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-600/20 p-3 rounded-full">
                <Wrench className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Maintenance</p>
                <p className="text-2xl font-bold text-white">
                  {dashboardData?.stats?.maintenance_resources || 0}
                </p>
                <div className="flex items-center text-yellow-400 text-xs mt-1">
                  <span>Scheduled</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-600/20 p-3 rounded-full">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-white">
                  {dashboardData?.stats?.total_users || 0}
                </p>
                <div className="flex items-center text-purple-400 text-xs mt-1">
                  <span>Online now</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-red-600/20 p-3 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Security Alerts</p>
                <p className="text-2xl font-bold text-white">
                  {dashboardData?.stats?.active_alerts || 0}
                </p>
                <div className="flex items-center text-red-400 text-xs mt-1">
                  <Bell className="w-3 h-3 mr-1" />
                  <span>Requires attention</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData?.recent_access?.slice(0, 6).map((log, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-0">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                      <p className="text-white text-sm font-medium">{log.user_name}</p>
                      <p className="text-gray-400 text-xs">{log.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-xs">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <SystemStatus />

        {/* Threat Assessment */}
        <ThreatLevel />
      </div>

      {/* Security Alerts */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Active Security Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dashboardData?.active_alerts?.map((alert, index) => (
              <Alert key={index} className={`border-l-4 ${getAlertSeverityColor(alert.severity)}`}>
                <AlertTriangle className="h-4 w-4" />
                <div className="flex justify-between items-start w-full">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{alert.title}</h4>
                    <p className="text-gray-300 text-sm">{alert.message}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                      <span>📍 {alert.location}</span>
                      <span>⏰ {new Date(alert.created_at).toLocaleString()}</span>
                      <Badge variant="outline" className={
                        alert.severity === 'critical' ? 'border-red-600 text-red-400' :
                        alert.severity === 'high' ? 'border-orange-600 text-orange-400' :
                        alert.severity === 'medium' ? 'border-yellow-600 text-yellow-400' :
                        'border-blue-600 text-blue-400'
                      }>
                        {alert.severity}
                      </Badge>
                    </div>
                  </div>
                  <div className="ml-4">
                    <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-black">
                      Investigate
                    </Button>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Enhanced Resources Component
const Resources = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    category: '',
    location: '',
    status: 'active',
    assigned_to: '',
    description: '',
    acquisition_date: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    filterResources();
  }, [resources, searchTerm, statusFilter, typeFilter]);

  const fetchResources = async () => {
    try {
      const response = await axios.get(`${API}/resources`);
      setResources(response.data);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = resources;

    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(resource => resource.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(resource => resource.type === typeFilter);
    }

    setFilteredResources(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingResource ? `${API}/resources/${editingResource.id}` : `${API}/resources`;
      const method = editingResource ? 'put' : 'post';
      
      await axios[method](url, {
        ...formData,
        acquisition_date: new Date(formData.acquisition_date)
      });
      
      fetchResources();
      setShowCreateDialog(false);
      setEditingResource(null);
      resetForm();
    } catch (error) {
      console.error('Failed to save resource:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await axios.delete(`${API}/resources/${id}`);
        fetchResources();
      } catch (error) {
        console.error('Failed to delete resource:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      category: '',
      location: '',
      status: 'active',
      assigned_to: '',
      description: '',
      acquisition_date: ''
    });
  };

  const startEdit = (resource) => {
    setEditingResource(resource);
    setFormData({
      ...resource,
      acquisition_date: resource.acquisition_date.split('T')[0]
    });
    setShowCreateDialog(true);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'vehicle': return <Car className="w-5 h-5" />;
      case 'equipment': return <Package className="w-5 h-5" />;
      case 'security_device': return <Shield className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-600 text-white';
      case 'maintenance': return 'bg-yellow-600 text-black';
      case 'inactive': return 'bg-gray-600 text-white';
      case 'assigned': return 'bg-blue-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'maintenance': return <Wrench className="w-4 h-4" />;
      case 'inactive': return <XCircle className="w-4 h-4" />;
      case 'assigned': return <User className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const canModify = user?.access_level >= 2;

  if (loading) {
    return <div className="text-white">Loading resources...</div>;
  }

  const stats = {
    total: resources.length,
    active: resources.filter(r => r.status === 'active').length,
    maintenance: resources.filter(r => r.status === 'maintenance').length,
    assigned: resources.filter(r => r.status === 'assigned').length,
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Resource Management</h1>
            <p className="text-gray-400">Manage Wayne Industries equipment, vehicles, and security devices</p>
          </div>
          {canModify && (
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="bg-yellow-600 hover:bg-yellow-700 text-black">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Resource
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingResource ? 'Edit Resource' : 'Add New Resource'}
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
                    {editingResource ? 'Update resource information' : 'Add a new resource to the Wayne Industries inventory'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-300">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="bg-gray-800 border-gray-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="type" className="text-gray-300">Type</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="equipment">Equipment</SelectItem>
                          <SelectItem value="vehicle">Vehicle</SelectItem>
                          <SelectItem value="security_device">Security Device</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category" className="text-gray-300">Category</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="bg-gray-800 border-gray-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="location" className="text-gray-300">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="bg-gray-800 border-gray-600 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="status" className="text-gray-300">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="assigned">Assigned</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="acquisition_date" className="text-gray-300">Acquisition Date</Label>
                      <Input
                        id="acquisition_date"
                        type="date"
                        value={formData.acquisition_date}
                        onChange={(e) => setFormData({...formData, acquisition_date: e.target.value})}
                        className="bg-gray-800 border-gray-600 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="assigned_to" className="text-gray-300">Assigned To</Label>
                    <Input
                      id="assigned_to"
                      value={formData.assigned_to}
                      onChange={(e) => setFormData({...formData, assigned_to: e.target.value})}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="Optional"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-gray-300">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="bg-gray-800 border-gray-600 text-white"
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowCreateDialog(false)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-yellow-600 hover:bg-yellow-700 text-black">
                      {editingResource ? 'Update' : 'Create'} Resource
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Resource Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Package className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-gray-400 text-sm">Total Resources</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.active}</p>
                <p className="text-gray-400 text-sm">Active</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Wrench className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.maintenance}</p>
                <p className="text-gray-400 text-sm">Maintenance</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <User className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.assigned}</p>
                <p className="text-gray-400 text-sm">Assigned</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>
          <div className="min-w-40">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-40">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="vehicle">Vehicle</SelectItem>
                <SelectItem value="security_device">Security Device</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="bg-gray-900/50 border-gray-700 hover:border-yellow-600/50 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-yellow-400">
                    {getTypeIcon(resource.type)}
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">{resource.name}</CardTitle>
                    <CardDescription className="text-gray-400">
                      {resource.category}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(resource.status)}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(resource.status)}
                      <span>{resource.status}</span>
                    </div>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{resource.location}</span>
                </div>
                {resource.assigned_to && (
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Assigned to: {resource.assigned_to}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Acquired: {new Date(resource.acquisition_date).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-400 text-xs mt-2 line-clamp-2">{resource.description}</p>
              </div>
              
              {canModify && (
                <Separator className="my-4 bg-gray-700" />
              )}
              
              {canModify && (
                <div className="flex justify-end space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(resource)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(resource.id)}
                    className="border-red-600 text-red-400 hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl text-gray-300 mb-2">No resources found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

// Enhanced Security Component
const Security = () => {
  const [accessLogs, setAccessLogs] = useState([]);
  const [securityAlerts, setSecurityAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    if (user?.access_level >= 2) {
      fetchSecurityData();
      // Auto refresh every 30 seconds
      const interval = setInterval(fetchSecurityData, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchSecurityData = async () => {
    try {
      const [logsResponse, alertsResponse] = await Promise.all([
        axios.get(`${API}/access-logs`),
        axios.get(`${API}/security-alerts`)
      ]);
      
      setAccessLogs(logsResponse.data);
      setSecurityAlerts(alertsResponse.data);
    } catch (error) {
      console.error('Failed to fetch security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAlertStatus = async (alertId, status) => {
    try {
      await axios.put(`${API}/security-alerts/${alertId}?status=${status}`);
      fetchSecurityData();
    } catch (error) {
      console.error('Failed to update alert:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'denied': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-900/20 border-red-600';
      case 'high': return 'text-orange-400 bg-orange-900/20 border-orange-600';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-600';
      default: return 'text-blue-400 bg-blue-900/20 border-blue-600';
    }
  };

  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'high': return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      case 'medium': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      default: return <AlertTriangle className="w-5 h-5 text-blue-400" />;
    }
  };

  const filteredAlerts = securityAlerts.filter(alert => {
    const matchesSearch = searchTerm === '' || 
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  if (user?.access_level < 2) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl text-gray-300 mb-2">Access Restricted</h2>
          <p className="text-gray-500">You don't have sufficient permissions to view security data.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="text-white">Loading security data...</div>;
  }

  const alertStats = {
    total: securityAlerts.length,
    critical: securityAlerts.filter(a => a.severity === 'critical').length,
    active: securityAlerts.filter(a => a.status === 'active').length,
    resolved: securityAlerts.filter(a => a.status === 'resolved').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Security Monitoring</h1>
            <p className="text-gray-400">Monitor system access logs and security incidents</p>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <Signal className="w-4 h-4" />
            <span className="text-sm">Live Monitoring</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Security Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-8 h-8 text-red-400" />
              <div>
                <p className="text-2xl font-bold text-white">{alertStats.total}</p>
                <p className="text-gray-400 text-sm">Total Alerts</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <BellRing className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold text-white">{alertStats.critical}</p>
                <p className="text-gray-400 text-sm">Critical</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Bell className="w-8 h-8 text-orange-400" />
              <div>
                <p className="text-2xl font-bold text-white">{alertStats.active}</p>
                <p className="text-gray-400 text-sm">Active</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">{alertStats.resolved}</p>
                <p className="text-gray-400 text-sm">Resolved</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="alerts" className="data-[state=active]:bg-gray-700">
            Security Alerts
          </TabsTrigger>
          <TabsTrigger value="logs" className="data-[state=active]:bg-gray-700">
            Access Logs
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="data-[state=active]:bg-gray-700">
            Live Monitoring
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="alerts" className="space-y-4">
          {/* Alert Filters */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search alerts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>
              <div className="min-w-40">
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="min-w-40">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Security Alerts */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Security Incidents ({filteredAlerts.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                  <Alert key={alert.id} className={`border-l-4 ${getSeverityColor(alert.severity)}`}>
                    <div className="flex items-start space-x-3">
                      {getAlertIcon(alert.severity)}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-white text-lg">{alert.title}</h4>
                            <p className="text-gray-300">{alert.message}</p>
                            <div className="flex items-center space-x-6 mt-3 text-sm text-gray-400">
                              <span className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{alert.location}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{new Date(alert.created_at).toLocaleString()}</span>
                              </span>
                              <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                                {alert.severity.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className={
                                alert.status === 'resolved' ? 'border-green-600 text-green-400' :
                                alert.status === 'investigating' ? 'border-yellow-600 text-yellow-400' :
                                'border-red-600 text-red-400'
                              }>
                                {alert.status.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {alert.status === 'active' && (
                              <Button
                                size="sm"
                                onClick={() => updateAlertStatus(alert.id, 'investigating')}
                                className="bg-yellow-600 hover:bg-yellow-700 text-black"
                              >
                                Investigate
                              </Button>
                            )}
                            {alert.status !== 'resolved' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateAlertStatus(alert.id, 'resolved')}
                                className="border-green-600 text-green-400 hover:bg-green-900/20"
                              >
                                Resolve
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>System Access Logs</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Recent system access and activity monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {accessLogs.slice(0, 20).map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(log.status)}
                      <div>
                        <p className="text-white font-medium">{log.user_name}</p>
                        <p className="text-gray-400 text-sm">{log.action}</p>
                        <p className="text-gray-500 text-xs flex items-center space-x-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          <span>{log.location}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                        {log.status}
                      </Badge>
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Network Status */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Wifi className="w-5 h-5" />
                  <span>Network Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Main Network</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-400 text-sm">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Backup Network</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-400 text-sm">Standby</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">External Connections</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-yellow-400 text-sm">Monitored</span>
                    </div>
                  </div>
                  <Separator className="bg-gray-700" />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Network Load</span>
                      <span className="text-white">23%</span>
                    </div>
                    <Progress value={23} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Server className="w-5 h-5" />
                  <span>System Health</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">CPU Usage</span>
                      <span className="text-white">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Memory Usage</span>
                      <span className="text-white">67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Storage Usage</span>
                      <span className="text-white">34%</span>
                    </div>
                    <Progress value={34} className="h-2" />
                  </div>
                  <Separator className="bg-gray-700" />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Overall Health</span>
                    <Badge className="bg-green-600 text-white">Excellent</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Navigation Component
const Navigation = () => {
  const { user, logout } = useAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const navItems = [
    { path: '/dashboard', icon: Activity, label: 'Dashboard' },
    { path: '/resources', icon: Package, label: 'Resources' },
    { path: '/security', icon: Shield, label: 'Security' },
  ];

  return (
    <nav className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="text-white font-bold text-xl">Wayne Industries</span>
            </div>
            
            <div className="hidden md:flex space-x-6">
              {navItems.map(({ path, icon: Icon, label }) => (
                <a
                  key={path}
                  href={path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    currentPath === path
                      ? 'bg-yellow-600/20 text-yellow-400'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPath(path);
                    window.history.pushState({}, '', path);
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-white font-medium">{user?.full_name}</p>
              <p className="text-gray-400 text-sm">{user?.role?.replace('_', ' ')}</p>
            </div>
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Main App Component
const AppContent = () => {
  const { user, loading } = useAuth();
  const [currentRoute, setCurrentRoute] = useState('dashboard');

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/resources') setCurrentRoute('resources');
    else if (path === '/security') setCurrentRoute('security');
    else setCurrentRoute('dashboard');
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/resources') setCurrentRoute('resources');
      else if (path === '/security') setCurrentRoute('security');
      else setCurrentRoute('dashboard');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const renderCurrentRoute = () => {
    switch (currentRoute) {
      case 'resources': return <Resources />;
      case 'security': return <Security />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentRoute()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;