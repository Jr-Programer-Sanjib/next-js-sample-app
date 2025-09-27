'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { 
  Calendar, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  RefreshCw,
  Eye
} from 'lucide-react';
import Link from 'next/link';

interface Appointment {
  id: string;
  patientName: string;
  email: string;
  phone: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  symptoms: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  notes?: string;
}

const AppointmentsPage = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/getAppointments?status=${statusFilter}`);
      const data = await response.json();
      
      if (data.success) {
        setAppointments(data.appointments);
        console.log('Fetched appointments:', data.appointments);
      } else {
        toast.error('Failed to load appointments');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      setUpdatingStatus(appointmentId);
      
      const response = await fetch('/api/updateAppointment', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId,
          status: newStatus,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        setAppointments(prev => 
          prev.map(apt => 
            apt.id === appointmentId ? { ...apt, status: newStatus as any } : apt
          )
        );
        toast.success(result.message);
      } else {
        toast.error(result.error || 'Failed to update appointment status');
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Failed to update appointment status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading appointments...</p>
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
                <Link href="/admin/dashboard" className="flex items-center text-gray-600 hover:text-primary">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Dashboard
                </Link>
                <h1 className="text-2xl font-bold text-text">Appointments</h1>
                <span className="text-sm text-gray-500">({appointments.length} total)</span>
              </div>
              <button
                onClick={fetchAppointments}
                className="btn-secondary flex items-center"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="card mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search by patient, doctor, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10 w-full"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input-field"
                >
                  <option value="all">All Status ({appointments.length})</option>
                  <option value="pending">Pending ({appointments.filter(a => a.status === 'pending').length})</option>
                  <option value="confirmed">Confirmed ({appointments.filter(a => a.status === 'confirmed').length})</option>
                  <option value="completed">Completed ({appointments.filter(a => a.status === 'completed').length})</option>
                  <option value="cancelled">Cancelled ({appointments.filter(a => a.status === 'cancelled').length})</option>
                </select>
              </div>
            </div>
          </div>

          {/* Appointments List */}
          <div className="card">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-text mb-2">No appointments found</h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'No appointments have been booked yet.'
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doctor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAppointments.map((appointment) => (
                      <tr key={appointment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-text">{appointment.patientName}</div>
                            <div className="text-sm text-gray-500">{appointment.email}</div>
                            <div className="text-sm text-gray-500">{appointment.phone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-text">{appointment.doctorName}</div>
                            <div className="text-sm text-gray-500">{appointment.department}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-text">{formatDate(appointment.date)}</div>
                            <div className="text-sm text-gray-500">{formatTime(appointment.time)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {getStatusIcon(appointment.status)}
                            <span className="ml-1 capitalize">{appointment.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedAppointment(appointment);
                                setShowDetails(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 flex items-center"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </button>
                            {appointment.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                                  disabled={updatingStatus === appointment.id}
                                  className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                >
                                  {updatingStatus === appointment.id ? 'Confirming...' : 'Confirm'}
                                </button>
                                <button
                                  onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                                  disabled={updatingStatus === appointment.id}
                                  className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                >
                                  {updatingStatus === appointment.id ? 'Cancelling...' : 'Cancel'}
                                </button>
                              </>
                            )}
                            {appointment.status === 'confirmed' && (
                              <button
                                onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                                disabled={updatingStatus === appointment.id}
                                className="text-green-600 hover:text-green-900 disabled:opacity-50"
                              >
                                {updatingStatus === appointment.id ? 'Completing...' : 'Complete'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Appointment Details Modal */}
        {showDetails && selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-text">Appointment Details</h2>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Patient Name</label>
                      <p className="text-sm text-text">{selectedAppointment.patientName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Email</label>
                      <p className="text-sm text-text">{selectedAppointment.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-sm text-text">{selectedAppointment.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Status</label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedAppointment.status)}`}>
                        {getStatusIcon(selectedAppointment.status)}
                        <span className="ml-1 capitalize">{selectedAppointment.status}</span>
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Doctor</label>
                      <p className="text-sm text-text">{selectedAppointment.doctorName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Department</label>
                      <p className="text-sm text-text">{selectedAppointment.department}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Date</label>
                      <p className="text-sm text-text">{formatDate(selectedAppointment.date)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Time</label>
                      <p className="text-sm text-text">{formatTime(selectedAppointment.time)}</p>
                    </div>
                  </div>
                  
                  {selectedAppointment.symptoms && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Symptoms / Reason for Visit</label>
                      <p className="text-sm text-text">{selectedAppointment.symptoms}</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Booked On</label>
                    <p className="text-sm text-text">{formatDate(selectedAppointment.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default AppointmentsPage;
