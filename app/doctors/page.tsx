'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Calendar, MapPin, Phone, Mail, Star } from 'lucide-react';
import { useDoctors } from '@/contexts/DoctorsContext';

interface Doctor {
  id: string;
  name: string;
  specializations: string[];
  photoURL: string;
  bio: string;
  experience: string;
  education: string;
  consultationFee?: number;
}

const DoctorsPage = () => {
  const { getActiveDoctors, doctors, refreshDoctors } = useDoctors();
  const [loading, setLoading] = useState(false);
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const activeDoctors = getActiveDoctors();
  
  // Debug logging
  console.log('Patient Doctors Page - All doctors:', doctors);
  console.log('Patient Doctors Page - Active doctors:', activeDoctors);

  const specializations = [
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

  const filteredDoctors = activeDoctors.filter(doctor => {
    if (selectedSpecializations.length === 0) return true;
    return doctor.specializations?.some(s => selectedSpecializations.includes(s));
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading doctors...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                          {/* Debug Panel - Remove this in production */}
         {/* 
         <div className="card mb-6 bg-yellow-50 border-yellow-200">
           <div className="flex justify-between items-center">
             <div>
               <p className="text-sm text-yellow-800 font-bold">PATIENT PAGE - Doctor Display</p>
               <p className="text-sm text-yellow-800">Total Doctors: {doctors.length}</p>
               <p className="text-sm text-yellow-800">Active Doctors: {activeDoctors.length}</p>
               <p className="text-sm text-yellow-800">Filtered Doctors: {filteredDoctors.length}</p>
             </div>
             <div className="flex space-x-2">
               <button
                 onClick={() => {
                   console.log('Patient page - All doctors:', doctors);
                   console.log('Patient page - Active doctors:', activeDoctors);
                   alert(`Total: ${doctors.length}, Active: ${activeDoctors.length}, Filtered: ${filteredDoctors.length}`);
                 }}
                 className="text-yellow-600 hover:text-yellow-800 text-sm"
               >
                 Debug
               </button>
               <button
                 onClick={() => {
                   refreshDoctors();
                   alert('Doctors refreshed! Check the debug info above.');
                 }}
                 className="text-blue-600 hover:text-blue-800 text-sm"
               >
                 Refresh
               </button>
             </div>
           </div>
         </div>
         */}

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text mb-4">Our Expert Doctors</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet our team of experienced and qualified healthcare professionals 
            dedicated to providing the best medical care
          </p>
        </div>

        {/* Filters - compact toggle */}
        <div className="mb-6 flex items-center justify-center gap-3">
          <button
            onClick={() => setShowFilters(v => !v)}
            className="px-4 py-2 rounded-full text-sm font-medium bg-white text-text border border-gray-200 hover:bg-gray-50"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}{selectedSpecializations.length > 0 ? ` (${selectedSpecializations.length})` : ''}
          </button>
          {selectedSpecializations.length > 0 && (
            <button
              onClick={() => setSelectedSpecializations([])}
              className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-text hover:bg-gray-200 border border-gray-200"
            >
              Clear
            </button>
          )}
        </div>
        {showFilters && (
          <div className="mb-8 card">
            <div className="flex gap-2 overflow-x-auto py-2">
              {specializations.map((spec) => {
                const active = selectedSpecializations.includes(spec);
                return (
                  <button
                    key={spec}
                    onClick={() => {
                      setSelectedSpecializations(prev => 
                        prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
                      );
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                      active ? 'bg-primary text-white' : 'bg-white text-text hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {spec}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.map((doctor) => {
            console.log(`Rendering doctor: ${doctor.name}, photoURL: ${doctor.photoURL ? 'Present' : 'Missing'}`);
            return (
            <div key={doctor.id} className="card group hover:scale-105 transition-transform duration-200">
              {/* Doctor Image */}
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden">
                {doctor.photoURL ? (
                  <img
                    src={doctor.photoURL}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error(`Failed to load image for ${doctor.name}:`, e);
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <Users className={`text-gray-400 ${doctor.photoURL ? 'hidden' : ''}`} size={48} />
              </div>

              {/* Doctor Info */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-text mb-2">{doctor.name}</h3>
                <p className="text-primary font-medium mb-2">{doctor.specializations?.join(', ')}</p>
                <div className="flex items-center justify-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">(4.8)</span>
                </div>
                <p className="text-gray-600 text-sm">{doctor.experience} experience</p>
              </div>

              {/* Doctor Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-start space-x-3">
                  <MapPin className="text-primary mt-1" size={16} />
                  <div>
                    <p className="font-medium text-text text-sm">Specializations</p>
                    <p className="text-gray-600 text-sm">{doctor.specializations?.join(', ')}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Calendar className="text-primary mt-1" size={16} />
                  <div>
                    <p className="font-medium text-text text-sm">Schedule</p>
                    <p className="text-gray-600 text-sm">{doctor.schedule || 'Contact for schedule'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-4 h-4 bg-primary rounded-full mt-1"></div>
                  <div>
                    <p className="font-medium text-text text-sm">Country</p>
                    <p className="text-gray-600 text-sm">{doctor.country || 'India'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="text-primary mt-1" size={16} />
                  <div>
                    <p className="font-medium text-text text-sm">Phone</p>
                    <p className="text-gray-600 text-sm">{doctor.phone || '+91 97335 25031'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="text-primary mt-1" size={16} />
                  <div>
                    <p className="font-medium text-text text-sm">Email</p>
                    <p className="text-gray-600 text-sm">{doctor.email || 'info@newlifecare.com'}</p>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-6">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {doctor.bio || `${doctor.name} is an experienced ${doctor.specializations?.[0]?.toLowerCase() || 'doctor'} with ${doctor.experience} of practice. Committed to providing quality healthcare and personalized treatment plans.`}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  href={`/booking?doctor=${doctor.id}`}
                  className="btn-primary w-full flex items-center justify-center"
                >
                  <Calendar className="mr-2" size={16} />
                  Book Appointment
                </Link>
                
                <div className="flex space-x-2">
                  <a
                    href={`tel:${doctor.phone || '+919733525031'}`}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-text font-medium py-2 px-4 rounded-2xl transition-all duration-200 flex items-center justify-center"
                  >
                    <Phone className="mr-2" size={16} />
                    Call
                  </a>
                  <a
                    href={`mailto:${doctor.email || 'info@newlifecare.com'}`}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-text font-medium py-2 px-4 rounded-2xl transition-all duration-200 flex items-center justify-center"
                  >
                    <Mail className="mr-2" size={16} />
                    Email
                  </a>
                </div>
              </div>
            </div>
          );
          })}
        </div>

        {/* No Results */}
        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text mb-2">No doctors found</h3>
            <p className="text-gray-600">
              No doctors available for the selected specialization. Please try a different filter.
            </p>
          </div>
        )}

        {/* Debug Info - Remove in production */}
        {/*
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Debug Information</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <p>Total doctors: {doctors.length}</p>
            <p>Active doctors: {activeDoctors.length}</p>
            <p>Filtered doctors: {filteredDoctors.length}</p>
            <p>Doctors with images: {activeDoctors.filter(d => d.photoURL).length}</p>
          </div>
        </div>
        */}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="card max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-text mb-4">
              Need to Schedule an Appointment?
            </h2>
            <p className="text-gray-600 mb-6">
              Can't find the right doctor? Contact us and we'll help you find the perfect match for your healthcare needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/booking" className="btn-primary">
                Book Appointment
              </Link>
              <Link href="/timetable" className="btn-secondary">
                View Timetable
              </Link>
              <Link href="/contact" className="btn-secondary">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorsPage;
