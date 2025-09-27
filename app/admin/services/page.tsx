'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { 
  TrendingUp, 
  Search, 
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';

interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  phoneNumber: string;
  isActive: boolean;
  createdAt: string;
}

const ServicesPage = () => {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    icon: 'Stethoscope',
    phoneNumber: ''
  });
  


  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/getServices');
      const data = await response.json();
      
      if (data.success) {
        setServices(data.services);
      } else {
        toast.error('Failed to load services');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/addService', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newService),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Service added successfully!');
        setShowAddModal(false);
        setNewService({ name: '', description: '', icon: 'Stethoscope', phoneNumber: '' });
        fetchServices(); // Refresh the list
      } else {
        const errorMessage = data.error || 'Failed to add service';
        const details = data.details ? ` (${data.details})` : '';
        toast.error(`${errorMessage}${details}`);
        console.error('API Error:', data);
      }
    } catch (error) {
      console.error('Error adding service:', error);
      toast.error('Failed to add service');
    }
  };

  const handleEditService = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingService) return;
    
    try {
      const response = await fetch('/api/updateService', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: editingService.id,
          name: editingService.name,
          description: editingService.description,
          icon: editingService.icon,
          phoneNumber: editingService.phoneNumber,
          isActive: editingService.isActive
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Service updated successfully!');
        setShowEditModal(false);
        setEditingService(null);
        fetchServices(); // Refresh the list
      } else {
        toast.error(data.error || 'Failed to update service');
      }
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Failed to update service');
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    try {
      const response = await fetch(`/api/deleteService?serviceId=${serviceId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Service deleted successfully!');
        fetchServices(); // Refresh the list
      } else {
        toast.error(data.error || 'Failed to delete service');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
    }
  };

  const openEditModal = (service: Service) => {
    setEditingService({ ...service });
    setShowEditModal(true);
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });



  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading services...</p>
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
                <h1 className="text-2xl font-bold text-text">Services</h1>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="btn-primary flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Service
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
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10 w-full"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div key={service.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-text">{service.name}</h3>
                    <p className="text-sm text-primary font-medium">{service.icon}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => openEditModal(service)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                      title="Edit Service"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteService(service.id)}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                      title="Delete Service"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500">
                    Created: {new Date(service.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    📞 {service.phoneNumber || 'No phone'}
                  </div>
                </div>
                
                <div className="mt-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    service.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-500">Try adjusting your search terms or add a new service.</p>
            </div>
          )}
        </div>

        {/* Add Service Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-text mb-4">Add New Service</h3>
              
              <form onSubmit={handleAddService} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Service Name</label>
                  <input
                    type="text"
                    value={newService.name}
                    onChange={(e) => setNewService({...newService, name: e.target.value})}
                    className="input-field w-full"
                    placeholder="Enter service name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Description</label>
                  <textarea
                    value={newService.description}
                    onChange={(e) => setNewService({...newService, description: e.target.value})}
                    className="input-field w-full"
                    placeholder="Enter service description"
                    rows={3}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Icon</label>
                  <input
                    type="text"
                    value={newService.icon}
                    onChange={(e) => setNewService({...newService, icon: e.target.value})}
                    className="input-field w-full"
                    placeholder="e.g., Stethoscope, Heart, etc."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={newService.phoneNumber}
                    onChange={(e) => setNewService({...newService, phoneNumber: e.target.value})}
                    className="input-field w-full"
                    placeholder="e.g., +91 97335 25031"
                    required
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    Add Service
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Service Modal */}
        {showEditModal && editingService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-text mb-4">Edit Service</h3>
              
              <form onSubmit={handleEditService} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Service Name</label>
                  <input
                    type="text"
                    value={editingService.name}
                    onChange={(e) => setEditingService({...editingService, name: e.target.value})}
                    className="input-field w-full"
                    placeholder="Enter service name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Description</label>
                  <textarea
                    value={editingService.description}
                    onChange={(e) => setEditingService({...editingService, description: e.target.value})}
                    className="input-field w-full"
                    placeholder="Enter service description"
                    rows={3}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Icon</label>
                  <input
                    type="text"
                    value={editingService.icon}
                    onChange={(e) => setEditingService({...editingService, icon: e.target.value})}
                    className="input-field w-full"
                    placeholder="e.g., Stethoscope, Heart, etc."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={editingService.phoneNumber}
                    onChange={(e) => setEditingService({...editingService, phoneNumber: e.target.value})}
                    className="input-field w-full"
                    placeholder="e.g., +91 97335 25031"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingService.isActive}
                      onChange={(e) => setEditingService({...editingService, isActive: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-text">Active</span>
                  </label>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingService(null);
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    Update Service
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default ServicesPage;
