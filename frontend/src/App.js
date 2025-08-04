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
  BellRing,
  Download,
  Upload,
  Globe,
  Camera,
  Smartphone,
  Laptop,
  Gamepad2,
  Headphones,
  Watch,
  ExternalLink,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  Star,
  Heart,
  Target,
  Crosshair,
  Award,
  Trophy,
  Medal,
  Flag,
  Home,
  Phone,
  MessageSquare
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
      
      <Card className="w-full max-w-lg bg-black/90 backdrop-blur-xl border-gray-700 shadow-2xl">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
            <Shield className="w-10 h-10 text-black" />
          </div>
          <CardTitle className="text-3xl font-bold text-white mb-2">Wayne Industries</CardTitle>
          <CardDescription className="text-gray-300 text-lg">
            Advanced Security Management System
          </CardDescription>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto mt-4 rounded-full"></div>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert className="border-red-500 bg-red-900/20 backdrop-blur">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300">{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300 font-medium">Username</Label>
              <Input
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                className="bg-gray-800/70 border-gray-600 text-white placeholder:text-gray-400 h-12 rounded-lg"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 font-medium">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="bg-gray-800/70 border-gray-600 text-white placeholder:text-gray-400 h-12 rounded-lg"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold h-12 text-lg shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                'Access System'
              )}
            </Button>
          </form>
          
          <Separator className="my-8 bg-gray-700" />
          
          <div className="text-sm text-gray-400">
            <div className="text-center">
              <p className="mb-4 font-medium text-gray-300">Authorized Personnel:</p>
              <div className="space-y-3 bg-gray-800/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Bruce Wayne</span>
                  <span className="text-gray-400">bruce.wayne / batman123</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Lucius Fox</span>
                  <span className="text-gray-400">lucius.fox / foxtech123</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Alfred Pennyworth</span>
                  <span className="text-gray-400">alfred.pennyworth / alfred123</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Advanced Dashboard Component
const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
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

  const MetricCard = ({ title, value, change, icon: Icon, color, trend }) => (
    <Card className="bg-gray-900/60 border-gray-700/50 backdrop-blur hover:bg-gray-900/80 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold text-white mt-2">{value}</p>
            {change && (
              <div className={`flex items-center mt-2 text-sm ${trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
                {trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : trend === 'down' ? <TrendingDown className="w-4 h-4 mr-1" /> : null}
                <span>{change}</span>
              </div>
            )}
          </div>
          <div className={`${color} p-4 rounded-full shadow-lg`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const SystemMetrics = () => (
    <Card className="bg-gray-900/60 border-gray-700/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Monitor className="w-5 h-5" />
          <span>System Performance</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-300">CPU Usage</span>
              <span className="text-white font-medium">42%</span>
            </div>
            <Progress value={42} className="h-3" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-300">Memory Usage</span>
              <span className="text-white font-medium">68%</span>
            </div>
            <Progress value={68} className="h-3" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-300">Network Load</span>
              <span className="text-white font-medium">23%</span>
            </div>
            <Progress value={23} className="h-3" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-300">Storage Usage</span>
              <span className="text-white font-medium">55%</span>
            </div>
            <Progress value={55} className="h-3" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const SecurityOverview = () => (
    <Card className="bg-gray-900/60 border-gray-700/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Shield className="w-5 h-5" />
          <span>Security Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-800/40 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-300">Perimeter Defense</span>
            </div>
            <Badge className="bg-green-600 text-white">Active</Badge>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-800/40 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-gray-300">Intrusion Detection</span>
            </div>
            <Badge className="bg-yellow-600 text-black">Monitoring</Badge>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-800/40 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-gray-300">Access Control</span>
            </div>
            <Badge className="bg-blue-600 text-white">Secured</Badge>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-800/40 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-gray-300">Threat Response</span>
            </div>
            <Badge className="bg-red-600 text-white">Standby</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-white">Loading Wayne Industries Command Center...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 rounded-3xl p-8 overflow-hidden border border-gray-700/50">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1685720543547-cc4873188c75?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwzfHxjb250cm9sJTIwcm9vbXxlbnwwfHx8fDE3NTQxMDExMzV8MA&ixlib=rb-4.1.0&q=85')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Shield className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white">Welcome, {user?.full_name}</h1>
                  <p className="text-gray-300 text-lg">Wayne Industries Security Command Center</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <Badge className={`${getSecurityBadgeColor(dashboardData?.stats?.security_level)} text-white px-4 py-2 text-sm font-semibold`}>
                  Security Level: {dashboardData?.stats?.security_level || 'NORMAL'}
                </Badge>
                <Badge variant="secondary" className="bg-gray-700 text-gray-200 px-4 py-2">
                  Access Level: {user?.role?.replace('_', ' ').toUpperCase()}
                </Badge>
                <div className="flex items-center space-x-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Last sync: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-32 bg-gray-800/50 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="24h">24 Hours</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                onClick={() => fetchDashboardData(true)}
                disabled={refreshing}
                className="bg-yellow-600 hover:bg-yellow-700 text-black font-medium px-6"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <MetricCard
          title="Total Resources"
          value={dashboardData?.stats?.total_resources || 0}
          change="+2 this week"
          trend="up"
          icon={Package}
          color="bg-blue-600"
        />
        
        <MetricCard
          title="Active Assets"
          value={dashboardData?.stats?.active_resources || 0}
          change="98% uptime"
          trend="up"
          icon={CheckCircle}
          color="bg-green-600"
        />
        
        <MetricCard
          title="Security Alerts"
          value={dashboardData?.stats?.active_alerts || 0}
          change="2 resolved today"
          trend="down"
          icon={AlertTriangle}
          color="bg-red-600"
        />
        
        <MetricCard
          title="Active Users"
          value={dashboardData?.stats?.total_users || 0}
          change="3 online now"
          icon={Users}
          color="bg-purple-600"
        />
        
        <MetricCard
          title="Maintenance"
          value={dashboardData?.stats?.maintenance_resources || 0}
          change="Scheduled"
          icon={Wrench}
          color="bg-yellow-600"
        />
        
        <MetricCard
          title="System Health"
          value="98.7%"
          change="Excellent"
          trend="up"
          icon={Monitor}
          color="bg-indigo-600"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <Card className="bg-gray-900/60 border-gray-700/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Live Activity Feed</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
              <div className="space-y-4">
                {dashboardData?.recent_access?.slice(0, 8).map((log, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-2 ${log.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{log.user_name}</p>
                      <p className="text-gray-400 text-xs">{log.action}</p>
                      <p className="text-gray-500 text-xs">{new Date(log.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Metrics */}
        <div className="lg:col-span-1">
          <SystemMetrics />
        </div>

        {/* Security Overview */}
        <div className="lg:col-span-1">
          <SecurityOverview />
        </div>
      </div>

      {/* Active Alerts */}
      <Card className="bg-gray-900/60 border-gray-700/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Priority Security Alerts</span>
            </div>
            <Badge className="bg-red-600 text-white">
              {dashboardData?.active_alerts?.length || 0} Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData?.active_alerts?.slice(0, 3).map((alert, index) => (
              <Alert key={index} className={`border-l-4 ${
                alert.severity === 'critical' ? 'border-red-600 bg-red-900/20' :
                alert.severity === 'high' ? 'border-orange-600 bg-orange-900/20' :
                'border-yellow-600 bg-yellow-900/20'
              }`}>
                <AlertTriangle className="h-5 w-5" />
                <div className="flex justify-between items-start w-full">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-lg">{alert.title}</h4>
                    <p className="text-gray-300 mt-1">{alert.message}</p>
                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-400">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{alert.location}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(alert.created_at).toLocaleString()}</span>
                      </span>
                      <Badge className={`${
                        alert.severity === 'critical' ? 'bg-red-600' :
                        alert.severity === 'high' ? 'bg-orange-600' :
                        'bg-yellow-600'
                      } text-white`}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="ml-4">
                    <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-black font-medium">
                      <Eye className="w-4 h-4 mr-2" />
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

// Advanced Resources Component
const Resources = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
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
        resource.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.assigned_to?.toLowerCase().includes(searchTerm.toLowerCase())
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
      case 'vehicle': return Car;
      case 'equipment': return Package;
      case 'security_device': return Shield;
      default: return Package;
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'active': 
        return { 
          color: 'bg-green-600 text-white', 
          icon: CheckCircle, 
          label: 'Operational' 
        };
      case 'maintenance': 
        return { 
          color: 'bg-yellow-600 text-black', 
          icon: Wrench, 
          label: 'Maintenance' 
        };
      case 'inactive': 
        return { 
          color: 'bg-gray-600 text-white', 
          icon: XCircle, 
          label: 'Offline' 
        };
      case 'assigned': 
        return { 
          color: 'bg-blue-600 text-white', 
          icon: User, 
          label: 'Deployed' 
        };
      default: 
        return { 
          color: 'bg-gray-600 text-white', 
          icon: Clock, 
          label: 'Unknown' 
        };
    }
  };

  const canModify = user?.access_level >= 2;

  if (loading) {
    return <div className="text-white">Loading Wayne Industries Asset Database...</div>;
  }

  const stats = {
    total: resources.length,
    active: resources.filter(r => r.status === 'active').length,
    maintenance: resources.filter(r => r.status === 'maintenance').length,
    assigned: resources.filter(r => r.status === 'assigned').length,
    vehicles: resources.filter(r => r.type === 'vehicle').length,
    equipment: resources.filter(r => r.type === 'equipment').length,
    devices: resources.filter(r => r.type === 'security_device').length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 rounded-3xl p-8 border border-gray-700/50">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-white mb-3">Resource Management</h1>
            <p className="text-gray-300 text-lg mb-6">Wayne Industries Asset Database & Inventory System</p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-gray-800/40 rounded-lg p-4 backdrop-blur">
                <div className="flex items-center space-x-3">
                  <Package className="w-8 h-8 text-blue-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                    <p className="text-gray-400 text-sm">Total Assets</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800/40 rounded-lg p-4 backdrop-blur">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.active}</p>
                    <p className="text-gray-400 text-sm">Operational</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800/40 rounded-lg p-4 backdrop-blur">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-8 h-8 text-purple-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">98.2%</p>
                    <p className="text-gray-400 text-sm">Efficiency Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {canModify && (
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold px-8 py-3">
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Asset
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-3xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    {editingResource ? 'Edit Asset' : 'Register New Asset'}
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
                    {editingResource ? 'Update asset information in the Wayne Industries database' : 'Add a new asset to the Wayne Industries inventory system'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-gray-300 font-medium">Asset Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="bg-gray-800 border-gray-600 text-white mt-2"
                        placeholder="Enter asset name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="type" className="text-gray-300 font-medium">Asset Type</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white mt-2">
                          <SelectValue placeholder="Select asset type" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="equipment">Equipment</SelectItem>
                          <SelectItem value="vehicle">Vehicle</SelectItem>
                          <SelectItem value="security_device">Security Device</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="category" className="text-gray-300 font-medium">Category</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="bg-gray-800 border-gray-600 text-white mt-2"
                        placeholder="Asset category"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="location" className="text-gray-300 font-medium">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="bg-gray-800 border-gray-600 text-white mt-2"
                        placeholder="Current location"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="status" className="text-gray-300 font-medium">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white mt-2">
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
                      <Label htmlFor="acquisition_date" className="text-gray-300 font-medium">Acquisition Date</Label>
                      <Input
                        id="acquisition_date"
                        type="date"
                        value={formData.acquisition_date}
                        onChange={(e) => setFormData({...formData, acquisition_date: e.target.value})}
                        className="bg-gray-800 border-gray-600 text-white mt-2"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="assigned_to" className="text-gray-300 font-medium">Assigned To (Optional)</Label>
                    <Input
                      id="assigned_to"
                      value={formData.assigned_to}
                      onChange={(e) => setFormData({...formData, assigned_to: e.target.value})}
                      className="bg-gray-800 border-gray-600 text-white mt-2"
                      placeholder="Person or department"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-gray-300 font-medium">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="bg-gray-800 border-gray-600 text-white mt-2"
                      placeholder="Asset description and specifications"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowCreateDialog(false)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-800 px-6"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold px-6">
                      {editingResource ? 'Update Asset' : 'Register Asset'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card className="bg-gray-900/60 border-gray-700/50 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Package className="w-6 h-6 text-blue-400" />
              <div>
                <p className="text-xl font-bold text-white">{stats.total}</p>
                <p className="text-gray-400 text-xs">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/60 border-gray-700/50 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-xl font-bold text-white">{stats.active}</p>
                <p className="text-gray-400 text-xs">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/60 border-gray-700/50 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Wrench className="w-6 h-6 text-yellow-400" />
              <div>
                <p className="text-xl font-bold text-white">{stats.maintenance}</p>
                <p className="text-gray-400 text-xs">Maintenance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/60 border-gray-700/50 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <User className="w-6 h-6 text-purple-400" />
              <div>
                <p className="text-xl font-bold text-white">{stats.assigned}</p>
                <p className="text-gray-400 text-xs">Assigned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/60 border-gray-700/50 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Car className="w-6 h-6 text-indigo-400" />
              <div>
                <p className="text-xl font-bold text-white">{stats.vehicles}</p>
                <p className="text-gray-400 text-xs">Vehicles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/60 border-gray-700/50 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Package className="w-6 h-6 text-cyan-400" />
              <div>
                <p className="text-xl font-bold text-white">{stats.equipment}</p>
                <p className="text-gray-400 text-xs">Equipment</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/60 border-gray-700/50 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-red-400" />
              <div>
                <p className="text-xl font-bold text-white">{stats.devices}</p>
                <p className="text-gray-400 text-xs">Security</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Filters */}
      <Card className="bg-gray-900/60 border-gray-700/50 backdrop-blur">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-80">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search assets by name, category, location, or assignee..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white h-12"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-gray-800 border-gray-600 text-white h-12">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40 bg-gray-800 border-gray-600 text-white h-12">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="vehicle">Vehicle</SelectItem>
                <SelectItem value="security_device">Security Device</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1">
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                onClick={() => setViewMode('grid')}
                className="text-white"
              >
                <Package className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                onClick={() => setViewMode('list')}
                className="text-white"
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredResources.map((resource) => {
            const TypeIcon = getTypeIcon(resource.type);
            const statusConfig = getStatusConfig(resource.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <Card key={resource.id} className="bg-gray-900/60 border-gray-700/50 backdrop-blur hover:border-yellow-600/50 transition-all duration-300 hover:scale-105">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-yellow-600/20 rounded-lg">
                        <TypeIcon className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{resource.name}</CardTitle>
                        <CardDescription className="text-gray-400">
                          {resource.category}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center mt-3">
                    <Badge className={`${statusConfig.color} px-3 py-1`}>
                      <div className="flex items-center space-x-2">
                        <StatusIcon className="w-4 h-4" />
                        <span>{statusConfig.label}</span>
                      </div>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-gray-300">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{resource.location}</span>
                    </div>
                    {resource.assigned_to && (
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>Assigned to: {resource.assigned_to}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Acquired: {new Date(resource.acquisition_date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-400 text-xs mt-3 line-clamp-2 min-h-8">{resource.description}</p>
                  </div>
                  
                  {canModify && (
                    <>
                      <Separator className="my-4 bg-gray-700" />
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
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        // List View
        <Card className="bg-gray-900/60 border-gray-700/50 backdrop-blur">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="text-left p-4 text-gray-300 font-medium">Asset</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Type</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Location</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Assigned To</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Acquired</th>
                    {canModify && <th className="text-left p-4 text-gray-300 font-medium">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredResources.map((resource, index) => {
                    const TypeIcon = getTypeIcon(resource.type);
                    const statusConfig = getStatusConfig(resource.status);
                    
                    return (
                      <tr key={resource.id} className={`border-b border-gray-700/50 hover:bg-gray-800/30 ${index % 2 === 0 ? 'bg-gray-800/10' : ''}`}>
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <TypeIcon className="w-5 h-5 text-yellow-400" />
                            <div>
                              <p className="text-white font-medium">{resource.name}</p>
                              <p className="text-gray-400 text-sm">{resource.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-300 capitalize">{resource.type.replace('_', ' ')}</span>
                        </td>
                        <td className="p-4">
                          <Badge className={`${statusConfig.color} text-xs`}>
                            {statusConfig.label}
                          </Badge>
                        </td>
                        <td className="p-4 text-gray-300">{resource.location}</td>
                        <td className="p-4 text-gray-300">{resource.assigned_to || 'Unassigned'}</td>
                        <td className="p-4 text-gray-300">{new Date(resource.acquisition_date).toLocaleDateString()}</td>
                        {canModify && (
                          <td className="p-4">
                            <div className="flex space-x-2">
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
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredResources.length === 0 && (
        <Card className="bg-gray-900/60 border-gray-700/50 backdrop-blur">
          <CardContent className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl text-gray-300 mb-2">No assets found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
            {canModify && (
              <Button 
                onClick={() => {resetForm(); setShowCreateDialog(true);}}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Asset
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Advanced Security Component
const Security = () => {
  const [accessLogs, setAccessLogs] = useState([]);
  const [securityAlerts, setSecurityAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('24h');
  const [activeTab, setActiveTab] = useState('alerts');
  const { user } = useAuth();

  useEffect(() => {
    if (user?.access_level >= 2) {
      fetchSecurityData();
      const interval = setInterval(fetchSecurityData, 15000); // 15 second refresh
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

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'critical': 
        return { 
          color: 'text-red-400 bg-red-900/20 border-red-600', 
          bgColor: 'bg-red-600',
          icon: AlertTriangle 
        };
      case 'high': 
        return { 
          color: 'text-orange-400 bg-orange-900/20 border-orange-600', 
          bgColor: 'bg-orange-600',
          icon: AlertTriangle 
        };
      case 'medium': 
        return { 
          color: 'text-yellow-400 bg-yellow-900/20 border-yellow-600', 
          bgColor: 'bg-yellow-600',
          icon: AlertTriangle 
        };
      default: 
        return { 
          color: 'text-blue-400 bg-blue-900/20 border-blue-600', 
          bgColor: 'bg-blue-600',
          icon: AlertTriangle 
        };
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
        <Card className="bg-gray-900/60 border-gray-700/50 backdrop-blur">
          <CardContent className="text-center p-12">
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl text-gray-300 mb-2">Access Restricted</h2>
            <p className="text-gray-500">Security monitoring requires Manager level access or higher.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return <div className="text-white">Loading Wayne Industries Security Center...</div>;
  }

  const alertStats = {
    total: securityAlerts.length,
    critical: securityAlerts.filter(a => a.severity === 'critical').length,
    active: securityAlerts.filter(a => a.status === 'active').length,
    resolved: securityAlerts.filter(a => a.status === 'resolved').length,
    investigating: securityAlerts.filter(a => a.status === 'investigating').length,
  };

  const SecurityMetrics = () => (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <Card className="bg-gray-900/60 border-gray-700/50 backdrop-blur">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-2xl font-bold text-white">{alertStats.total}</p>
              <p className="text-gray-400 text-sm">Total Alerts</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/60 border-gray-700/50 backdrop-blur">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <div>
              <p className="text-2xl font-bold text-white">{alertStats.critical}</p>
              <p className="text-gray-400 text-sm">Critical</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/60 border-gray-700/50 backdrop-blur">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Bell className="w-8 h-8 text-orange-400" />
            <div>
              <p className="text-2xl font-bold text-white">{alertStats.active}</p>
              <p className="text-gray-400 text-sm">Active</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/60 border-gray-700/50 backdrop-blur">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Eye className="w-8 h-8 text-yellow-400" />
            <div>
              <p className="text-2xl font-bold text-white">{alertStats.investigating}</p>
              <p className="text-gray-400 text-sm">Investigating</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/60 border-gray-700/50 backdrop-blur">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-2xl font-bold text-white">{alertStats.resolved}</p>
              <p className="text-gray-400 text-sm">Resolved</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 rounded-3xl p-8 border border-gray-700/50">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-white mb-3">Security Command Center</h1>
            <p className="text-gray-300 text-lg mb-6">Real-time threat monitoring & incident response</p>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium">Systems Online</span>
              </div>
              <div className="flex items-center space-x-2">
                <Signal className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 font-medium">Live Monitoring Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-medium">Defense Grid Operational</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-32 bg-gray-800/50 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
              </SelectContent>
            </Select>
            
            <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-medium">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Security Metrics */}
      <SecurityMetrics />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-gray-800 border-gray-700 p-1">
          <TabsTrigger value="alerts" className="data-[state=active]:bg-gray-700 px-6 py-2">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Security Alerts
          </TabsTrigger>
          <TabsTrigger value="logs" className="data-[state=active]:bg-gray-700 px-6 py-2">
            <Activity className="w-4 h-4 mr-2" />
            Access Logs
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="data-[state=active]:bg-gray-700 px-6 py-2">
            <Monitor className="w-4 h-4 mr-2" />
            Live Monitoring
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-gray-700 px-6 py-2">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="alerts" className="space-y-6">
          {/* Alert Filters */}
          <Card className="bg-gray-900/60 border-gray-700/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-80">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Search alerts by title, message, or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-600 text-white h-12"
                    />
                  </div>
                </div>
                
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-40 bg-gray-800 border-gray-600 text-white h-12">
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

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40 bg-gray-800 border-gray-600 text-white h-12">
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
            </CardContent>
          </Card>

          {/* Security Incidents */}
          <div className="space-y-4">
            {filteredAlerts.map((alert) => {
              const severityConfig = getSeverityConfig(alert.severity);
              const SeverityIcon = severityConfig.icon;
              
              return (
                <Alert key={alert.id} className={`border-l-4 ${severityConfig.color} backdrop-blur`}>
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${severityConfig.bgColor}`}>
                      <SeverityIcon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-white text-xl mb-2">{alert.title}</h4>
                          <p className="text-gray-300 text-lg">{alert.message}</p>
                          
                          <div className="flex items-center space-x-6 mt-4 text-sm text-gray-400">
                            <span className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4" />
                              <span>{alert.location}</span>
                            </span>
                            <span className="flex items-center space-x-2">
                              <Clock className="w-4 h-4" />
                              <span>{new Date(alert.created_at).toLocaleString()}</span>
                            </span>
                            <Badge className={`${severityConfig.bgColor} text-white font-semibold`}>
                              {alert.severity.toUpperCase()}
                            </Badge>
                            <Badge className={`${
                              alert.status === 'resolved' ? 'bg-green-600' :
                              alert.status === 'investigating' ? 'bg-yellow-600' :
                              'bg-red-600'
                            } text-white font-semibold`}>
                              {alert.status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          {alert.status === 'active' && (
                            <Button
                              onClick={() => updateAlertStatus(alert.id, 'investigating')}
                              className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold px-6"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Investigate
                            </Button>
                          )}
                          {alert.status !== 'resolved' && (
                            <Button
                              variant="outline"
                              onClick={() => updateAlertStatus(alert.id, 'resolved')}
                              className="border-green-600 text-green-400 hover:bg-green-900/20 font-semibold px-6"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Alert>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="logs" className="space-y-6">
          <Card className="bg-gray-900/60 border-gray-700/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>System Access Logs</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Real-time system access monitoring and audit trail
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {accessLogs.slice(0, 25).map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 bg-gray-800/40 rounded-lg border border-gray-700/50 hover:bg-gray-800/60 transition-colors">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(log.status)}
                      <div>
                        <p className="text-white font-semibold">{log.user_name}</p>
                        <p className="text-gray-300">{log.action}</p>
                        <p className="text-gray-500 text-sm flex items-center space-x-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          <span>{log.location}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={log.status === 'success' ? 'default' : 'destructive'} className="mb-2">
                        {log.status.toUpperCase()}
                      </Badge>
                      <p className="text-gray-400 text-sm">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Network Status */}
            <Card className="bg-gray-900/60 border-gray-700/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Wifi className="w-5 h-5" />
                  <span>Network Infrastructure</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-800/40 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-gray-300 font-medium">Primary Network</span>
                    </div>
                    <Badge className="bg-green-600 text-white">99.8% Uptime</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-800/40 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-gray-300 font-medium">Backup Network</span>
                    </div>
                    <Badge className="bg-blue-600 text-white">Standby</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-800/40 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                      <span className="text-gray-300 font-medium">External Connections</span>
                    </div>
                    <Badge className="bg-yellow-600 text-black">Monitoring</Badge>
                  </div>

                  <Separator className="bg-gray-700" />
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Bandwidth Usage</span>
                        <span className="text-white font-medium">1.2 GB/s</span>
                      </div>
                      <Progress value={35} className="h-3" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Latency</span>
                        <span className="text-white font-medium">12ms</span>
                      </div>
                      <Progress value={88} className="h-3" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card className="bg-gray-900/60 border-gray-700/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Server className="w-5 h-5" />
                  <span>System Health Monitor</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-3">
                      <span className="text-gray-400 flex items-center space-x-2">
                        <Cpu className="w-4 h-4" />
                        <span>CPU Usage</span>
                      </span>
                      <span className="text-white font-medium">42%</span>
                    </div>
                    <Progress value={42} className="h-3" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-3">
                      <span className="text-gray-400 flex items-center space-x-2">
                        <HardDrive className="w-4 h-4" />
                        <span>Memory Usage</span>
                      </span>
                      <span className="text-white font-medium">68%</span>
                    </div>
                    <Progress value={68} className="h-3" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-3">
                      <span className="text-gray-400 flex items-center space-x-2">
                        <Database className="w-4 h-4" />
                        <span>Storage Usage</span>
                      </span>
                      <span className="text-white font-medium">34%</span>
                    </div>
                    <Progress value={34} className="h-3" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-3">
                      <span className="text-gray-400 flex items-center space-x-2">
                        <Globe className="w-4 h-4" />
                        <span>Network Load</span>
                      </span>
                      <span className="text-white font-medium">23%</span>
                    </div>
                    <Progress value={23} className="h-3" />
                  </div>
                  
                  <Separator className="bg-gray-700" />
                  
                  <div className="flex items-center justify-between p-4 bg-gray-800/40 rounded-lg">
                    <span className="text-gray-300 font-medium">Overall System Health</span>
                    <Badge className="bg-green-600 text-white text-lg px-4 py-2">
                      Excellent
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Threat Analytics */}
            <Card className="bg-gray-900/60 border-gray-700/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Threat Analytics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-800/40 rounded-lg">
                    <div>
                      <p className="text-white font-semibold">Blocked Attempts (24h)</p>
                      <p className="text-gray-400 text-sm">Unauthorized access attempts</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-400">247</p>
                      <p className="text-red-400 text-sm">+12% from yesterday</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-800/40 rounded-lg">
                    <div>
                      <p className="text-white font-semibold">Successful Logins</p>
                      <p className="text-gray-400 text-sm">Authenticated sessions</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-400">156</p>
                      <p className="text-green-400 text-sm">Normal activity</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-800/40 rounded-lg">
                    <div>
                      <p className="text-white font-semibold">Security Score</p>
                      <p className="text-gray-400 text-sm">Overall security rating</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-400">9.2/10</p>
                      <p className="text-blue-400 text-sm">Excellent</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="bg-gray-900/60 border-gray-700/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Performance Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-800/40 rounded-lg">
                    <div>
                      <p className="text-white font-semibold">Response Time</p>
                      <p className="text-gray-400 text-sm">Average system response</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-400">0.8s</p>
                      <p className="text-green-400 text-sm">Optimal</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-800/40 rounded-lg">
                    <div>
                      <p className="text-white font-semibold">Uptime</p>
                      <p className="text-gray-400 text-sm">System availability</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-400">99.97%</p>
                      <p className="text-blue-400 text-sm">Last 30 days</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-800/40 rounded-lg">
                    <div>
                      <p className="text-white font-semibold">Data Processed</p>
                      <p className="text-gray-400 text-sm">Total data throughput</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-400">2.4TB</p>
                      <p className="text-purple-400 text-sm">Today</p>
                    </div>
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
    <nav className="bg-gray-900/90 backdrop-blur-xl border-b border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-black" />
              </div>
              <span className="text-white font-bold text-xl">Wayne Industries</span>
            </div>
            
            <div className="hidden md:flex space-x-6">
              {navItems.map(({ path, icon: Icon, label }) => (
                <a
                  key={path}
                  href={path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    currentPath === path
                      ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPath(path);
                    window.history.pushState({}, '', path);
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-white font-semibold">{user?.full_name}</p>
              <p className="text-gray-400 text-sm">{user?.role?.replace('_', ' ').toUpperCase()}</p>
            </div>
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500"
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-xl mb-4 mx-auto">
            <Shield className="w-8 h-8 text-black" />
          </div>
          <div className="text-white text-xl">Initializing Wayne Industries Security System...</div>
        </div>
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