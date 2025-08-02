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
  Calendar
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

// Dashboard Component
const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${API}/dashboard/stats`);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSecurityBadgeColor = (level) => {
    switch (level) {
      case 'HIGH': return 'bg-red-600';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-white">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="relative bg-gradient-to-r from-gray-900 to-slate-800 rounded-2xl p-6 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1685720543547-cc4873188c75?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwzfHxjb250cm9sJTIwcm9vbXxlbnwwfHx8fDE3NTQxMDExMzV8MA&ixlib=rb-4.1.0&q=85')] bg-cover bg-center opacity-30"></div>
        <div className="relative z-10">
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
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <p className="text-gray-400 text-sm">Active Alerts</p>
                <p className="text-2xl font-bold text-white">
                  {dashboardData?.stats?.active_alerts || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Access Logs */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData?.recent_access?.map((log, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-0">
                  <div>
                    <p className="text-white text-sm font-medium">{log.user_name}</p>
                    <p className="text-gray-400 text-xs">{log.action}</p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={log.status === 'success' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {log.status}
                    </Badge>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Security Alerts */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Security Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData?.active_alerts?.map((alert, index) => (
                <Alert key={index} className={getAlertSeverityColor(alert.severity)}>
                  <AlertTriangle className="h-4 w-4" />
                  <div>
                    <h4 className="font-medium">{alert.title}</h4>
                    <p className="text-sm opacity-80">{alert.message}</p>
                    <p className="text-xs opacity-60 mt-1">{alert.location}</p>
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Resources Component
const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
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
      case 'active': return 'bg-green-600';
      case 'maintenance': return 'bg-yellow-600';
      case 'inactive': return 'bg-gray-600';
      case 'assigned': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  const canModify = user?.access_level >= 2;

  if (loading) {
    return <div className="text-white">Loading resources...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Resource Management</h1>
        {canModify && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-yellow-600 hover:bg-yellow-700 text-black">
                <Plus className="w-4 h-4 mr-2" />
                Add Resource
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 text-white">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <Card key={resource.id} className="bg-gray-900/50 border-gray-700">
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
                <Badge className={`${getStatusColor(resource.status)} text-white`}>
                  {resource.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4" />
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
                <p className="text-gray-400 text-xs mt-2">{resource.description}</p>
              </div>
              
              {canModify && (
                <div className="flex justify-end space-x-2 mt-4">
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
    </div>
  );
};

// Security Monitoring Component
const Security = () => {
  const [accessLogs, setAccessLogs] = useState([]);
  const [securityAlerts, setSecurityAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.access_level >= 2) {
      fetchSecurityData();
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Security Monitoring</h1>
      
      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="logs" className="data-[state=active]:bg-gray-700">
            Access Logs
          </TabsTrigger>
          <TabsTrigger value="alerts" className="data-[state=active]:bg-gray-700">
            Security Alerts
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="logs">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Access Logs</CardTitle>
              <CardDescription className="text-gray-400">
                System access and activity monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {accessLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(log.status)}
                      <div>
                        <p className="text-white font-medium">{log.user_name}</p>
                        <p className="text-gray-400 text-sm">{log.action}</p>
                        <p className="text-gray-500 text-xs">{log.location}</p>
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
        
        <TabsContent value="alerts">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Security Alerts</CardTitle>
              <CardDescription className="text-gray-400">
                Active security incidents and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityAlerts.map((alert) => (
                  <Alert key={alert.id} className={`border-l-4 ${
                    alert.severity === 'critical' ? 'border-red-600 bg-red-900/20' :
                    alert.severity === 'high' ? 'border-orange-600 bg-orange-900/20' :
                    alert.severity === 'medium' ? 'border-yellow-600 bg-yellow-900/20' :
                    'border-blue-600 bg-blue-900/20'
                  }`}>
                    <AlertTriangle className="h-4 w-4" />
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{alert.title}</h4>
                        <p className="text-gray-300">{alert.message}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
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
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
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