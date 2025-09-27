'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useDoctors } from '@/contexts/DoctorsContext';
import { toast } from 'react-hot-toast';
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  Stethoscope, 
  LogOut,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalAppointments: number;
  pendingAppointments: number;
  totalDoctors: number;
  totalMessages: number;
  todayAppointments: number;
  completedAppointments: number;
}

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { getActiveDoctors } = useDoctors();
  const [stats, setStats] = useState<DashboardStats>({
    totalAppointments: 0,
    pendingAppointments: 0,
    totalDoctors: 0,
    totalMessages: 0,
    todayAppointments: 0,
    completedAppointments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch appointments from Firebase
      const appointmentsResponse = await fetch('/api/getAppointments');
      const appointmentsData = await appointmentsResponse.json();
      
      let totalAppointments = 0;
      let pendingAppointments = 0;
      let completedAppointments = 0;
      let todayAppointments = 0;
      
      if (appointmentsData.success) {
        const appointments = appointmentsData.appointments;
        totalAppointments = appointments.length;
        pendingAppointments = appointments.filter((apt: any) => apt.status === 'pending').length;
        completedAppointments = appointments.filter((apt: any) => apt.status === 'completed').length;
        
        // Count today's appointments
        const today = new Date().toISOString().split('T')[0];
        todayAppointments = appointments.filter((apt: any) => apt.date === today).length;
      }
      
      // Get doctors count from context
      const activeDoctors = getActiveDoctors();
      const totalDoctors = activeDoctors.length;
      
      // Fetch messages count
      let totalMessages = 0;
      try {
        const messagesResponse = await fetch('/api/getMessages');
        const messagesData = await messagesResponse.json();
        totalMessages = messagesData.success ? messagesData.messages.length : 0;
      } catch (error) {
        console.log('Messages API not available, using default count');
        // Get from localStorage if API not available
        const savedMessages = localStorage.getItem('contactMessages');
        if (savedMessages) {
          const messages = JSON.parse(savedMessages);
          totalMessages = Array.isArray(messages) ? messages.length : 0;
        }
      }
      
      setStats({
        totalAppointments,
        pendingAppointments,
        totalDoctors,
        totalMessages,
        todayAppointments,
        completedAppointments,
      });

      // Generate recent activities based on real data
      const activities = [];
      
      // Add recent appointments to activity feed
      if (appointmentsData.success && appointmentsData.appointments.length > 0) {
        const recentAppointments = appointmentsData.appointments
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3);
        
        recentAppointments.forEach((apt: any) => {
          activities.push({
            type: 'appointment',
            icon: Calendar,
            title: `New appointment booked`,
            description: `${apt.patientName} - ${apt.doctorName} - ${apt.date} ${apt.time}`,
            time: new Date(apt.createdAt).toLocaleString(),
            color: 'text-blue-500'
          });
        });
      }

      // Add doctor activities
      if (activeDoctors.length > 0) {
        activities.push({
          type: 'doctor',
          icon: Stethoscope,
          title: `${activeDoctors.length} doctors available`,
          description: `${activeDoctors.map((d: any) => d.name).slice(0, 2).join(', ')}${activeDoctors.length > 2 ? ` and ${activeDoctors.length - 2} more` : ''}`,
          time: 'Current',
          color: 'text-green-500'
        });
      }

      // Add message activities if any
      if (totalMessages > 0) {
        activities.push({
          type: 'message',
          icon: MessageSquare,
          title: `${totalMessages} message(s) received`,
          description: 'Check messages panel for details',
          time: 'Recent',
          color: 'text-purple-500'
        });
      }

      setRecentActivities(activities.slice(0, 5)); // Show max 5 activities
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const menuItems = [
    {
      title: 'Appointments',
      description: 'Manage patient appointments',
      icon: Calendar,
      href: '/admin/appointments',
      color: 'bg-blue-500',
    },
    {
      title: 'Doctors',
      description: 'Manage doctors and schedules',
      icon: Stethoscope,
      href: '/admin/doctors',
      color: 'bg-green-500',
    },
    {
      title: 'Timetable',
      description: 'Manage doctor schedules',
      icon: Clock,
      href: '/admin/timetable',
      color: 'bg-indigo-500',
    },
    {
      title: 'Services',
      description: 'Manage medical services',
      icon: TrendingUp,
      href: '/admin/services',
      color: 'bg-purple-500',
    },
    {
      title: 'Messages',
      description: 'View patient messages',
      icon: MessageSquare,
      href: '/admin/messages',
      color: 'bg-orange-500',
    },
  ];

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-text">Admin Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={fetchDashboardStats}
                  disabled={loading}
                  className="btn-secondary flex items-center"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <span className="text-gray-600">Welcome, {user?.email}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                  <p className="text-2xl font-bold text-text">{stats.totalAppointments}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-text">{stats.pendingAppointments}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Doctors</p>
                  <p className="text-2xl font-bold text-text">{stats.totalDoctors}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Messages</p>
                  <p className="text-2xl font-bold text-text">{stats.totalMessages}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="card">
              <h3 className="text-lg font-semibold text-text mb-4">Today's Appointments</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-text">{stats.todayAppointments}</p>
                    <p className="text-sm text-gray-600">Scheduled for today</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-text mb-4">Completed Appointments</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-blue-500 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-text">{stats.completedAppointments}</p>
                    <p className="text-sm text-gray-600">Successfully completed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-text mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {menuItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="card hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="flex items-center">
                    <div className={`p-3 rounded-full ${item.color} bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-200`}>
                      <item.icon className={`h-6 w-6 ${item.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-text group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h2 className="text-2xl font-bold text-text mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <activity.icon className={`h-5 w-5 ${activity.color} mr-3`} />
                      <div>
                        <p className="font-medium text-text">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No recent activity</p>
                  <p className="text-sm text-gray-400">Activity will appear here as appointments are booked</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
