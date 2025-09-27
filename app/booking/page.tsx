'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Calendar, Clock, User, Phone, Mail, FileText } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useDoctors } from '@/contexts/DoctorsContext';

interface BookingForm {
  patientName: string;
  email: string;
  phone: string;
  department: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  symptoms: string;
}

interface Doctor {
  id: string;
  name: string;
  specializations: string[];
}

const BookingPage = () => {
  const searchParams = useSearchParams();
  const { getActiveDoctors } = useDoctors();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<BookingForm>();

  const departments = [
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
  ];

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM',
    '07:00 PM', '07:30 PM',
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Auto-select doctor and department from URL query parameters
  useEffect(() => {
    const doctorIdFromUrl = searchParams.get('doctor');
    if (doctorIdFromUrl && doctors.length > 0) {
      const doctor = doctors.find(d => d.id === doctorIdFromUrl);
      if (doctor) {
        setSelectedDoctorId(doctorIdFromUrl);
        // Use first specialization as default department
        const primarySpecialization = (doctor as any).specializations?.[0] || (doctor as any).specialization;
        setSelectedDepartment(primarySpecialization);
        setValue('doctorId', doctorIdFromUrl);
        setValue('department', primarySpecialization);
        setValue('doctorName', doctor.name);
        console.log('Auto-selected doctor:', doctor.name, 'department:', primarySpecialization);
      }
    }
  }, [searchParams, doctors, setValue]);

  const fetchDoctors = async () => {
    try {
      // Use the context instead of API call since we're using localStorage
      const activeDoctors = getActiveDoctors();
      setDoctors(activeDoctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const filteredDoctors = doctors.filter((doctor: any) => 
    !selectedDepartment || 
    (doctor.specializations && doctor.specializations.includes(selectedDepartment)) ||
    (doctor.specialization === selectedDepartment)
  );

  const onSubmit = async (data: BookingForm) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/bookAppointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        reset();
        setSelectedDepartment('');
        setSelectedDoctorId('');
      } else {
        toast.error(result.error || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Handle department change
  const handleDepartmentChange = (dept: string) => {
    setSelectedDepartment(dept);
    setValue('department', dept);
    // Clear doctor selection when department changes
    if (dept !== selectedDepartment) {
      setSelectedDoctorId('');
      setValue('doctorId', '');
      setValue('doctorName', '');
    }
  };

  // Handle doctor change
  const handleDoctorChange = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    setValue('doctorId', doctorId);
    const doctor = doctors.find(d => d.id === doctorId);
    if (doctor) {
      setValue('doctorName', doctor.name);
      // Auto-select department when doctor is selected
      const primarySpecialization = (doctor as any).specializations?.[0] || (doctor as any).specialization;
      if (primarySpecialization && !selectedDepartment) {
        setSelectedDepartment(primarySpecialization);
        setValue('department', primarySpecialization);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text mb-4">Book an Appointment</h1>
          <p className="text-xl text-gray-600">
            Schedule your visit with our experienced healthcare professionals
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Booking Form */}
          <div className="card">
            <h2 className="text-2xl font-bold text-text mb-6">Appointment Details</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Patient Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text flex items-center">
                  <User className="mr-2" size={20} />
                  Patient Information
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register('patientName', { required: 'Name is required' })}
                    className="input-field"
                    placeholder="Enter your full name"
                  />
                  {errors.patientName && (
                    <p className="text-red-500 text-sm mt-1">{errors.patientName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Please enter a valid email'
                      }
                    })}
                    className="input-field"
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    {...register('phone', { 
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[0-9+\-\s()]+$/,
                        message: 'Please enter a valid phone number'
                      }
                    })}
                    className="input-field"
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Appointment Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text flex items-center">
                  <Calendar className="mr-2" size={20} />
                  Appointment Details
                </h3>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Department *
                  </label>
                  <select
                    {...register('department', { required: 'Department is required' })}
                    className="input-field"
                    value={selectedDepartment}
                    onChange={(e) => handleDepartmentChange(e.target.value)}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  {errors.department && (
                    <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Doctor *
                  </label>
                  <select
                    {...register('doctorId', { required: 'Doctor is required' })}
                    className="input-field"
                    value={selectedDoctorId}
                    onChange={(e) => handleDoctorChange(e.target.value)}
                  >
                    <option value="">Select Doctor</option>
                    {filteredDoctors.map((doctor: any) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specializations ? doctor.specializations.join(', ') : doctor.specialization}
                      </option>
                    ))}
                  </select>
                  {errors.doctorId && (
                    <p className="text-red-500 text-sm mt-1">{errors.doctorId.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      {...register('date', { required: 'Date is required' })}
                      className="input-field"
                      min={getMinDate()}
                    />
                    {errors.date && (
                      <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Time *
                    </label>
                    <select
                      {...register('time', { required: 'Time is required' })}
                      className="input-field"
                    >
                      <option value="">Select Time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                    {errors.time && (
                      <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Symptoms / Reason for Visit
                  </label>
                  <textarea
                    {...register('symptoms')}
                    rows={4}
                    className="input-field resize-none"
                    placeholder="Please describe your symptoms or reason for visit (optional)"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center"
              >
                {isLoading ? 'Booking...' : 'Book Appointment'}
              </button>
            </form>
          </div>

          {/* Information Panel */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-xl font-bold text-text mb-4">Important Information</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Clock className="text-primary mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-text">Clinic Hours</h4>
                    <p className="text-gray-600">Monday - Saturday: 8:00 AM - 8:00 PM</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="text-primary mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-text">Emergency Contact</h4>
                    <p className="text-gray-600">+91 97335 25031</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="text-primary mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-text">Email</h4>
                    <p className="text-gray-600">info@newlifecare.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold text-text mb-4">Booking Instructions</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Please arrive 10 minutes before your appointment time</li>
                <li>• Bring your ID proof and previous medical records if any</li>
                <li>• For cancellations, please call us at least 24 hours in advance</li>
                <li>• Emergency cases will be given priority</li>
                <li>• Face masks are recommended for all visitors</li>
              </ul>
            </div>

            <div className="card bg-primary/5 border-primary/20">
              <h3 className="text-xl font-bold text-primary mb-4">Need Immediate Help?</h3>
              <p className="text-gray-600 mb-4">
                For urgent medical concerns or emergencies, please call our emergency number immediately.
              </p>
              <a
                href="tel:+919876543210"
                className="btn-primary inline-flex items-center"
              >
                <Phone className="mr-2" size={16} />
                Call Emergency: +91 97335 25031
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
