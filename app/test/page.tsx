'use client';

import React from 'react';
import { useDoctors } from '@/contexts/DoctorsContext';

const TestPage = () => {
  const { doctors, addDoctor, getActiveDoctors, refreshDoctors, clearAllDoctors } = useDoctors();
  const activeDoctors = getActiveDoctors();

  const testAddDoctor = () => {
    const testDoctor = {
      name: 'Dr. Test User',
      specialization: 'General Medicine',
      email: 'test@example.com',
      phone: '+91 98765 43214',
      bio: 'Test doctor for debugging',
      experience: '5 years',
      schedule: 'Mon-Fri: 9:00 AM - 5:00 PM',
      country: 'India',
      photoURL: '',
      isActive: true
    };
    
    console.log('Adding test doctor:', testDoctor);
    addDoctor(testDoctor);
  };

  const clearData = () => {
    clearAllDoctors();
    alert('All doctors cleared!');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Doctors Context Test Page</h1>
        
                 {/* Debug Info */}
         {/* 
         <div className="bg-white p-6 rounded-lg shadow mb-6">
           <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
           <div className="grid grid-cols-2 gap-4">
             <div>
               <p><strong>Total Doctors:</strong> {doctors.length}</p>
               <p><strong>Active Doctors:</strong> {activeDoctors.length}</p>
               <p><strong>localStorage has data:</strong> {localStorage.getItem('doctors') ? 'Yes' : 'No'}</p>
             </div>
             <div>
               <p><strong>Context loaded:</strong> {doctors.length > 0 ? 'Yes' : 'No'}</p>
             </div>
           </div>
         </div>
         */}

                 {/* Action Buttons */}
         {/* 
         <div className="bg-white p-6 rounded-lg shadow mb-6">
           <h2 className="text-xl font-semibold mb-4">Actions</h2>
           <div className="flex gap-4">
             <button
               onClick={testAddDoctor}
               className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
             >
               Add Test Doctor
             </button>
             <button
               onClick={refreshDoctors}
               className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
             >
               Refresh Doctors
             </button>
             <button
               onClick={clearData}
               className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
             >
               Clear All Data
             </button>
           </div>
         </div>
         */}

                 {/* Doctors List */}
         {/* 
         <div className="bg-white p-6 rounded-lg shadow">
           <h2 className="text-xl font-semibold mb-4">Current Doctors ({doctors.length})</h2>
           {doctors.length === 0 ? (
             <p className="text-gray-500">No doctors found</p>
           ) : (
             <div className="space-y-4">
               {doctors.map((doctor, index) => (
                 <div key={doctor.id} className="border p-4 rounded">
                   <h3 className="font-semibold">{index + 1}. {doctor.name}</h3>
                   <p className="text-sm text-gray-600">Specialization: {doctor.specialization}</p>
                   <p className="text-sm text-gray-600">Email: {doctor.email}</p>
                   <p className="text-sm text-gray-600">Active: {doctor.isActive ? 'Yes' : 'No'}</p>
                   <p className="text-sm text-gray-600">ID: {doctor.id}</p>
                 </div>
               ))}
             </div>
           )}
         </div>
         */}

                 {/* Raw localStorage Data */}
         {/* 
         <div className="bg-white p-6 rounded-lg shadow mt-6">
           <h2 className="text-xl font-semibold mb-4">Raw localStorage Data</h2>
           <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
             {localStorage.getItem('doctors') || 'No data in localStorage'}
           </pre>
         </div>
         */}
      </div>
    </div>
  );
};

export default TestPage;
