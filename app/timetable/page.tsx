'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Phone, Users, ArrowRight } from 'lucide-react';
import { useDoctors } from '@/contexts/DoctorsContext';

interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface DoctorSchedule {
  doctorId: string;
  doctorName: string;
  specialization: string;
  photoURL: string;
  timeSlots: TimeSlot[];
  location: string;
  contact: string;
}

const TimetablePage = () => {
  const { getActiveDoctors, doctors } = useDoctors();
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Load existing timetables from localStorage (in real app, this would come from database)
  useEffect(() => {
    const loadSchedules = () => {
      try {
        const savedSchedules = localStorage.getItem('doctorSchedules');
        if (savedSchedules) {
          const parsedSchedules = JSON.parse(savedSchedules);
          // Only show schedules for doctors that exist in the doctor section
          const activeDoctors = getActiveDoctors();
          const validSchedules = parsedSchedules.filter((schedule: DoctorSchedule) => 
            activeDoctors.some(doctor => doctor.id === schedule.doctorId)
          );
          setSchedules(validSchedules);
        }
      } catch (error) {
        console.error('Error loading schedules:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSchedules();
  }, [getActiveDoctors]);

  const getDayColor = (day: string) => {
    const colors = {
      'Monday': 'bg-blue-100 text-blue-800',
      'Tuesday': 'bg-green-100 text-green-800',
      'Wednesday': 'bg-purple-100 text-purple-800',
      'Thursday': 'bg-orange-100 text-orange-800',
      'Friday': 'bg-red-100 text-red-800',
      'Saturday': 'bg-indigo-100 text-indigo-800',
      'Sunday': 'bg-gray-100 text-gray-800'
    };
    return colors[day as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading timetable...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text mb-4">Doctor Timetable</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            View doctor schedules and find the perfect time slot for your appointment.
          </p>
        </div>

        {/* No Timetables Available */}
        {schedules.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text mb-2">No Timetables Available</h3>
            <p className="text-gray-600 mb-6">
              Doctor timetables haven't been set up yet. Please check back later or contact us for scheduling information.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/doctors" className="btn-primary">
                View All Doctors
              </Link>
              <Link href="/contact" className="btn-secondary">
                Contact Us
              </Link>
            </div>
          </div>
        )}

                 {/* Mobile: Interactive Doctor Selection with Immediate Timetable */}
         {schedules.length > 0 && (
           <div className="md:hidden">
             <h2 className="text-xl font-semibold text-text mb-6 text-center">Select a Doctor</h2>
             
             {schedules.map((schedule) => {
               const doctor = doctors.find(d => d.id === schedule.doctorId);
               const isSelected = selectedDoctor === schedule.doctorId;
               
               return (
                 <div key={schedule.doctorId} className="mb-6">
                   {/* Doctor Card */}
                   <div
                     onClick={() => setSelectedDoctor(isSelected ? '' : schedule.doctorId)}
                     className={`w-full bg-white rounded-xl shadow-md border-2 transition-all duration-300 ${
                       isSelected
                         ? 'border-primary shadow-lg bg-gradient-to-r from-primary/5 to-primary/10'
                         : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                     }`}
                   >
                     <div className="p-4">
                       <div className="flex items-center space-x-3">
                         <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                           {doctor?.photoURL ? (
                             <img
                               src={doctor.photoURL}
                               alt={schedule.doctorName}
                               className="w-full h-full object-cover rounded-full"
                             />
                           ) : (
                             <Users className="h-7 w-7 text-primary" />
                           )}
                         </div>
                         <div className="flex-1 min-w-0">
                           <h3 className="font-semibold text-text text-base">{schedule.doctorName}</h3>
                           <p className="text-primary font-medium text-sm">
                             {doctor?.specializations ? doctor.specializations.join(', ') : schedule.specialization}
                           </p>
                           <div className="flex items-center space-x-2 mt-1 text-xs text-gray-600">
                             <MapPin className="h-3 w-3" />
                             <span className="truncate">{schedule.location}</span>
                           </div>
                         </div>
                         <ArrowRight className={`h-5 w-5 transition-transform duration-300 ${
                           isSelected ? 'text-primary transform rotate-90' : 'text-gray-400'
                         }`} />
                       </div>
                     </div>
                   </div>

                   {/* Timetable - Appears immediately below selected doctor */}
                   {isSelected && (
                     <div className="mt-4 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                       {/* Doctor Info Header */}
                       <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 border-b border-gray-200">
                         <div className="text-center">
                           <h3 className="text-lg font-bold text-text mb-2">{schedule.doctorName}</h3>
                           <p className="text-primary font-medium text-sm">
                             {doctor?.specializations ? doctor.specializations.join(', ') : schedule.specialization}
                           </p>
                           <div className="flex items-center justify-center space-x-4 mt-2 text-xs text-gray-600">
                             <div className="flex items-center space-x-1">
                               <MapPin className="h-3 w-3" />
                               <span>{schedule.location}</span>
                             </div>
                             <div className="flex items-center space-x-1">
                               <Phone className="h-3 w-3" />
                               <span>{doctor?.phone || schedule.contact}</span>
                             </div>
                           </div>
                         </div>
                       </div>

                       {/* Weekly Schedule */}
                       <div className="p-4">
                         <h4 className="text-sm font-semibold text-text mb-3 text-center">Weekly Schedule</h4>
                         <div className="space-y-3">
                           {days.map(day => {
                             const daySlots = schedule.timeSlots.filter(slot => slot.day === day);
                             return (
                               <div key={day} className="border border-gray-200 rounded-lg overflow-hidden">
                                 <div className={`text-center p-2 text-xs font-medium ${getDayColor(day)}`}>
                                   {day}
                                 </div>
                                 {daySlots.length > 0 ? (
                                   <div className="p-3 bg-gray-50">
                                     {daySlots.map(slot => (
                                       <div
                                         key={slot.id}
                                         className={`p-2 rounded-lg mb-2 last:mb-0 ${
                                           slot.isAvailable 
                                             ? 'bg-green-100 border border-green-300' 
                                             : 'bg-red-100 border border-red-300'
                                         }`}
                                       >
                                         <div className="text-center">
                                           <div className="text-sm font-semibold">
                                             {slot.startTime} - {slot.endTime}
                                           </div>
                                           <div className={`text-xs mt-1 font-medium ${
                                             slot.isAvailable ? 'text-green-700' : 'text-red-700'
                                           }`}>
                                             {slot.isAvailable ? '✅ Available' : '❌ Unavailable'}
                                           </div>
                                         </div>
                                       </div>
                                     ))}
                                   </div>
                                 ) : (
                                   <div className="p-3 text-center text-gray-400 text-xs bg-gray-50">
                                     <Clock className="h-4 w-4 mx-auto mb-1" />
                                     <div>No slots</div>
                                   </div>
                                 )}
                               </div>
                             );
                           })}
                         </div>
                       </div>
                     </div>
                   )}
                 </div>
               );
             })}
           </div>
         )}

         {/* Desktop: Original Layout */}
         {schedules.length > 0 && (
           <div className="hidden md:block mb-8">
             <h2 className="text-xl font-semibold text-text mb-6 text-center">Select a Doctor</h2>
             
             {/* Desktop: Grid Layout */}
             <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
               {schedules.map((schedule) => {
                 const doctor = doctors.find(d => d.id === schedule.doctorId);
                 return (
                   <div
                     key={schedule.doctorId}
                     onClick={() => setSelectedDoctor(schedule.doctorId)}
                     className={`card cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                       selectedDoctor === schedule.doctorId
                         ? 'ring-2 ring-primary bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg'
                         : 'hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100'
                     }`}
                   >
                     <div className="flex items-center space-x-4">
                       <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                         {doctor?.photoURL ? (
                           <img
                             src={doctor.photoURL}
                             alt={schedule.doctorName}
                             className="w-full h-full object-cover rounded-full"
                           />
                         ) : (
                           <Users className="h-8 w-8 text-primary" />
                         )}
                       </div>
                       <div className="flex-1 min-w-0">
                         <h3 className="font-semibold text-text text-lg">{schedule.doctorName}</h3>
                         <p className="text-primary font-medium text-sm">
                           {doctor?.specializations ? doctor.specializations.join(', ') : schedule.specialization}
                         </p>
                         <div className="flex items-center space-x-2 mt-2 text-sm text-gray-600">
                           <MapPin className="h-4 w-4" />
                           <span className="truncate">{schedule.location}</span>
                         </div>
                       </div>
                       <ArrowRight className={`h-5 w-5 transition-transform duration-200 ${
                         selectedDoctor === schedule.doctorId ? 'text-primary transform translate-x-1' : 'text-gray-400'
                       }`} />
                     </div>
                   </div>
                 );
               })}
             </div>
           </div>
         )}

         {/* Desktop Timetable Display */}
         {selectedDoctor && schedules.length > 0 && (
          <div className="space-y-8">
            {/* Selected Doctor Info */}
            {(() => {
              const schedule = schedules.find(s => s.doctorId === selectedDoctor);
              const doctor = doctors.find(d => d.id === selectedDoctor);
              if (!schedule) return null;
              
              return (
                                 <div className="card">
                   {/* Mobile: Stacked Layout */}
                   <div className="md:hidden mb-6">
                     <div className="text-center mb-4">
                       <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center overflow-hidden mx-auto mb-3">
                         {doctor?.photoURL ? (
                           <img
                             src={doctor.photoURL}
                             alt={schedule.doctorName}
                             className="w-full h-full object-cover rounded-full"
                           />
                         ) : (
                           <Users className="h-12 w-12 text-primary" />
                         )}
                       </div>
                       <h2 className="text-xl font-bold text-text mb-2">{schedule.doctorName}</h2>
                       <p className="text-primary font-medium text-sm mb-3">
                         {doctor?.specializations ? doctor.specializations.join(', ') : schedule.specialization}
                       </p>
                       <div className="space-y-2 text-sm text-gray-600">
                         <div className="flex items-center justify-center space-x-2">
                           <MapPin className="h-4 w-4" />
                           <span>{schedule.location}</span>
                         </div>
                         <div className="flex items-center justify-center space-x-2">
                           <Phone className="h-4 w-4" />
                           <span>{doctor?.phone || schedule.contact}</span>
                         </div>
                         {doctor?.experience && (
                           <div className="flex items-center justify-center space-x-2">
                             <Clock className="h-4 w-4" />
                             <span>Experience: {doctor.experience}</span>
                           </div>
                         )}
                       </div>
                     </div>
                   </div>

                   {/* Desktop: Horizontal Layout */}
                   <div className="hidden md:flex items-center space-x-6 mb-6">
                     <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center overflow-hidden">
                       {doctor?.photoURL ? (
                         <img
                           src={doctor.photoURL}
                           alt={schedule.doctorName}
                           className="w-full h-full object-cover rounded-full"
                         />
                       ) : (
                         <Users className="h-12 w-12 text-primary" />
                       )}
                     </div>
                     <div>
                       <h2 className="text-2xl font-bold text-text mb-2">{schedule.doctorName}</h2>
                       <p className="text-primary font-medium text-lg mb-3">
                         {doctor?.specializations ? doctor.specializations.join(', ') : schedule.specialization}
                       </p>
                       <div className="flex items-center space-x-6 text-sm text-gray-600">
                         <div className="flex items-center space-x-2">
                           <MapPin className="h-4 w-4" />
                           <span>{schedule.location}</span>
                         </div>
                         <div className="flex items-center space-x-2">
                           <Phone className="h-4 w-4" />
                           <span>{doctor?.phone || schedule.contact}</span>
                         </div>
                         {doctor?.experience && (
                           <div className="flex items-center space-x-2">
                             <Clock className="h-4 w-4" />
                             <span>Experience: {doctor.experience}</span>
                           </div>
                         )}
                       </div>
                     </div>
                   </div>

                                     {/* Weekly Schedule - Read Only */}
                   <div className="space-y-6">
                     {/* Mobile: Vertical Layout */}
                     <div className="md:hidden">
                       {days.map(day => {
                         const daySlots = schedule.timeSlots.filter(slot => slot.day === day);
                         return (
                           <div key={day} className="mb-4">
                             <div className={`text-center p-3 rounded-lg font-medium mb-3 ${getDayColor(day)}`}>
                               {day}
                             </div>
                             {daySlots.length > 0 ? (
                               <div className="space-y-2">
                                 {daySlots.map(slot => (
                                   <div
                                     key={slot.id}
                                     className={`p-4 rounded-lg border-2 ${
                                       slot.isAvailable 
                                         ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-300' 
                                         : 'bg-gradient-to-r from-red-50 to-red-100 border-red-300'
                                     }`}
                                   >
                                     <div className="text-center">
                                       <div className="text-base font-semibold">
                                         {slot.startTime} - {slot.endTime}
                                       </div>
                                       <div className={`text-sm mt-1 font-medium ${
                                         slot.isAvailable ? 'text-green-700' : 'text-red-700'
                                       }`}>
                                         {slot.isAvailable ? '✅ Available' : '❌ Unavailable'}
                                       </div>
                                     </div>
                                   </div>
                                 ))}
                               </div>
                             ) : (
                               <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                 <Clock className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                                 <span className="text-sm">No appointments scheduled</span>
                               </div>
                             )}
                           </div>
                         );
                       })}
                     </div>

                     {/* Desktop: Grid Layout */}
                     <div className="hidden md:grid md:grid-cols-7 gap-4">
                       {days.map(day => {
                         const daySlots = schedule.timeSlots.filter(slot => slot.day === day);
                         return (
                           <div key={day} className="space-y-3">
                             <div className={`text-center p-3 rounded-lg font-medium shadow-sm ${getDayColor(day)}`}>
                               {day}
                             </div>
                             {daySlots.length > 0 ? (
                               <div className="space-y-2">
                                 {daySlots.map(slot => (
                                   <div
                                     key={slot.id}
                                     className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
                                       slot.isAvailable 
                                         ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:border-green-300' 
                                         : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:border-red-300'
                                     }`}
                                   >
                                     <div className="text-center">
                                       <div className="text-sm font-semibold">
                                         {slot.startTime} - {slot.endTime}
                                       </div>
                                       <div className={`text-xs mt-1 font-medium ${
                                         slot.isAvailable ? 'text-green-700' : 'text-red-700'
                                       }`}>
                                         {slot.isAvailable ? 'Available' : 'Unavailable'}
                                       </div>
                                     </div>
                                   </div>
                                 ))}
                               </div>
                             ) : (
                               <div className="p-3 text-center text-gray-400 text-sm bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                 <Clock className="h-4 w-4 mx-auto mb-1" />
                                 <div>No slots</div>
                               </div>
                             )}
                           </div>
                         );
                       })}
                     </div>
                   </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="card max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-text mb-4">
              Need to Book an Appointment?
            </h2>
            <p className="text-gray-600 mb-6">
              Once you've found a suitable time slot, book your appointment with the doctor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/booking" className="btn-primary">
                Book Appointment
              </Link>
              <Link href="/doctors" className="btn-secondary">
                View All Doctors
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimetablePage;
