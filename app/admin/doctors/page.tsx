'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useDoctors } from '@/contexts/DoctorsContext';
import { toast } from 'react-hot-toast';
import { 
  Stethoscope, 
  Search, 
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  User,
  Mail,
  Phone,
  X,
  Upload,
  Calendar,
  MapPin
} from 'lucide-react';
import Link from 'next/link';

interface Doctor {
  id: string;
  name: string;
  specializations: string[];
  email: string;
  phone: string;
  photoURL: string;
  bio: string;
  experience: string;
  schedule: string;
  country: string;
  isActive: boolean;
}

const DoctorsPage = () => {
  const { user } = useAuth();
  const { doctors, addDoctor, updateDoctor, deleteDoctor, refreshDoctors } = useDoctors();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    specializations: [] as string[],
    email: '',
    phone: '',
    bio: '',
    experience: '',
    schedule: '',
    country: '',
    photoURL: ''
  });

  // Doctors are now managed by the context

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData);
    
    if (!formData.name || formData.specializations.length === 0 || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      console.log('Adding doctor with data:', {
        ...formData,
        isActive: true
      });
      
      addDoctor({
        ...formData,
        isActive: true
      });
      
      console.log('Doctor added successfully');
      setShowAddForm(false);
      resetForm();
      toast.success('Doctor added successfully!');
    } catch (error) {
      console.error('Error adding doctor:', error);
      toast.error('Failed to add doctor');
    }
  };

  const handleEditDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingDoctor || !formData.name || formData.specializations.length === 0 || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      updateDoctor(editingDoctor.id, formData);
      setEditingDoctor(null);
      resetForm();
      toast.success('Doctor updated successfully!');
    } catch (error) {
      toast.error('Failed to update doctor');
    }
  };

  const handleDeleteDoctor = async (doctorId: string) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        deleteDoctor(doctorId);
        toast.success('Doctor deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete doctor');
      }
    }
  };

  const startEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      specializations: (doctor as any).specializations || ((doctor as any).specialization ? [(doctor as any).specialization] : []),
      email: doctor.email,
      phone: doctor.phone,
      bio: doctor.bio,
      experience: doctor.experience,
      schedule: doctor.schedule,
      country: doctor.country,
      photoURL: doctor.photoURL
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      specialization: '',
      email: '',
      phone: '',
      bio: '',
      experience: '',
      schedule: '',
      country: '',
      photoURL: ''
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      console.log('Uploading image:', file.name, 'Size:', file.size, 'Type:', file.type);
      
      // In a real app, upload to Firebase Storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        console.log('Image converted to base64, length:', result.length);
        setFormData(prev => ({
          ...prev,
          photoURL: result
        }));
        toast.success('Image uploaded successfully!');
      };
      reader.onerror = () => {
        toast.error('Failed to read image file');
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredDoctors = doctors.filter((doctor: any) =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ((doctor.specializations || []).some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading doctors...</p>
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
                <h1 className="text-2xl font-bold text-text">Doctors</h1>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="btn-primary flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Doctor
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                     {/* Debug Info */}
           <div className="card mb-6 bg-blue-50">
             <div className="flex justify-between items-center">
               <div>
                 <p className="text-sm text-blue-800 font-bold">ADMIN PANEL - Doctor Management</p>
                 <p className="text-sm text-blue-800">Total Doctors: {doctors.length}</p>
                 <p className="text-sm text-blue-800">Active Doctors: {doctors.filter(d => d.isActive).length}</p>
               </div>
               <div className="flex space-x-2">
                 <button
                   onClick={() => {
                     console.log('Current doctors:', doctors);
                     toast.success(`Total doctors: ${doctors.length}`);
                   }}
                   className="text-blue-600 hover:text-blue-800 text-sm"
                 >
                   Debug Info
                 </button>
                 <button
                   onClick={() => {
                     const testDoctor = {
                       name: 'Dr. Test Doctor',
                       specialization: 'General Medicine',
                       email: 'test@newlifecare.com',
                       phone: '+91 98765 43213',
                       bio: 'This is a test doctor to verify functionality.',
                       experience: '5 years',
                       schedule: 'Mon-Fri: 10:00 AM - 6:00 PM',
                       country: 'India',
                       photoURL: '',
                       isActive: true
                     };
                     addDoctor(testDoctor);
                     toast.success('Test doctor added!');
                   }}
                   className="text-green-600 hover:text-green-800 text-sm"
                 >
                   Add Test Doctor
                 </button>
                 <button
                   onClick={() => {
                     refreshDoctors();
                     toast.success('Doctors refreshed!');
                   }}
                   className="text-blue-600 hover:text-blue-800 text-sm"
                 >
                   Refresh Data
                 </button>
                 <button
                   onClick={() => {
                     // Clear localStorage and reload
                     localStorage.removeItem('doctors');
                     window.location.reload();
                   }}
                   className="text-red-600 hover:text-red-800 text-sm"
                 >
                   Reset Data
                 </button>
               </div>
             </div>
           </div>

          {/* Search */}
          <div className="card mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search doctors by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>
          </div>

          {/* Add/Edit Doctor Form */}
          {(showAddForm || editingDoctor) && (
            <div className="card mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-text">
                  {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingDoctor(null);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={editingDoctor ? handleEditDoctor : handleAddDoctor} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="input-field w-full"
                      placeholder="Dr. John Doe"
                      required
                    />
                  </div>

                  {/* Specializations */}
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Specializations *
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-64 overflow-auto pr-2">
                      {[
                        'Cardiology',
                        'Dermatology',
                        'Orthopedics',
                        'Neurology',
                        'Pediatrics',
                        'Gynecology',
                        'Obstetrics',
                        'Ophthalmology',
                        'Psychiatry',
                        'Dentistry',
                        'Otolaryngology (ENT)',
                        'Gastroenterology',
                        'Nephrology',
                        'Endocrinology',
                        'Pulmonology',
                        'Rheumatology',
                        'Urology',
                        'Oncology',
                        'Hematology',
                        'General Surgery',
                        'Plastic Surgery',
                        'Vascular Surgery',
                        'Anesthesiology',
                        'Radiology',
                        'Pathology',
                        'Physiotherapy',
                        'Nutrition & Dietetics',
                        'Emergency Medicine',
                        'Family Medicine',
                        'Infectious Disease',
                        'Diabetology',
                        'Geriatrics',
                        'Immunology',
                        'Allergy & Immunology',
                        'Hepatology',
                        'Neurosurgery',
                        'Cardiothoracic Surgery',
                        'Pediatric Surgery',
                        'Reproductive Medicine',
                        'Neonatology',
                        'Critical Care Medicine',
                        'Pain Medicine',
                        'Sports Medicine',
                        'Occupational Therapy',
                        'Speech Therapy',
                        'General Medicine'
                      ].map(opt => (
                        <label key={opt} className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={formData.specializations.includes(opt)}
                            onChange={(e) => {
                              setFormData(prev => ({
                                ...prev,
                                specializations: e.target.checked
                                  ? [...prev.specializations, opt]
                                  : prev.specializations.filter(s => s !== opt)
                              }));
                            }}
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="input-field w-full"
                      placeholder="doctor@newlifecare.com"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="input-field w-full"
                      placeholder="+91 97335 25031"
                    />
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="text"
                      value={formData.experience}
                      onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                      className="input-field w-full"
                      placeholder="15 years"
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                      className="input-field w-full"
                      placeholder="India"
                    />
                  </div>

                  {/* Schedule */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text mb-2">
                      Schedule
                    </label>
                    <input
                      type="text"
                      value={formData.schedule}
                      onChange={(e) => setFormData(prev => ({ ...prev, schedule: e.target.value }))}
                      className="input-field w-full"
                      placeholder="Mon-Fri: 9:00 AM - 5:00 PM"
                    />
                  </div>

                  {/* Photo URL */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text mb-2">
                      Profile Photo
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label
                        htmlFor="photo-upload"
                        className="flex items-center space-x-2 cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
                      >
                        <Upload className="h-5 w-5" />
                        <span>Upload Photo</span>
                      </label>
                      {formData.photoURL && (
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                          <img
                            src={formData.photoURL}
                            alt="Doctor"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text mb-2">
                      Biography
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      className="input-field w-full h-32 resize-none"
                      placeholder="Tell us about the doctor's background, expertise, and achievements..."
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingDoctor(null);
                      resetForm();
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingDoctor ? 'Update Doctor' : 'Add Doctor'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div key={doctor.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {doctor.photoURL ? (
                        <img
                          src={doctor.photoURL}
                          alt={doctor.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-text">{doctor.name}</h3>
                    <p className="text-sm text-primary font-medium">{(doctor as any).specializations ? (doctor as any).specializations.join(', ') : (doctor as any).specialization}</p>
                    <p className="text-sm text-gray-600 mt-1">{doctor.experience} experience</p>
                    
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="h-4 w-4 mr-2" />
                        {doctor.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="h-4 w-4 mr-2" />
                        {doctor.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2" />
                        {doctor.country}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        {doctor.schedule}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{doctor.bio}</p>
                    
                    <div className="mt-4 flex space-x-2">
                      <button 
                        onClick={() => startEdit(doctor)}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                      >
                        <Edit className="h-4 w-4 inline mr-1" />
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteDoctor(doctor.id)}
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                      >
                        <Trash2 className="h-4 w-4 inline mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <div className="text-center py-12">
              <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
              <p className="text-gray-500">Try adjusting your search terms or add a new doctor.</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DoctorsPage;
