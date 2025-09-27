'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useDoctors } from '@/contexts/DoctorsContext';
import { toast } from 'react-hot-toast';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  Users,
  MapPin,
  Phone,
  Check,
  X
} from 'lucide-react';
import Link from 'next/link';

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

const AdminTimetablePage = () => {
  const { user } = useAuth();
  const { getActiveDoctors, doctors } = useDoctors();
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [newSlot, setNewSlot] = useState({
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:00',
    isAvailable: true
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'
  ];

  // Load existing schedules and sync with current doctors
  useEffect(() => {
    const loadSchedules = () => {
      try {
        const savedSchedules = localStorage.getItem('doctorSchedules');
        if (savedSchedules) {
          const parsedSchedules = JSON.parse(savedSchedules);
          setSchedules(parsedSchedules);
        }
      } catch (error) {
        console.error('Error loading schedules:', error);
      }
    };

    loadSchedules();
  }, []);

  // Get only doctors that exist in the doctor section
  const availableDoctors = getActiveDoctors();
  const doctorsWithSchedules = availableDoctors.map((doctor: any) => {
    const existingSchedule = schedules.find(s => s.doctorId === doctor.id);
    return {
      ...doctor,
      hasSchedule: !!existingSchedule
    };
  });

  // Save schedules to localStorage
  const saveSchedules = (newSchedules: DoctorSchedule[]) => {
    localStorage.setItem('doctorSchedules', JSON.stringify(newSchedules));
    setSchedules(newSchedules);
  };

  // Create new timetable for a doctor
  const createTimetable = (doctor: any) => {
    const newSchedule: DoctorSchedule = {
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialization: (doctor.specializations && doctor.specializations.length > 0) ? doctor.specializations.join(', ') : doctor.specialization,
      photoURL: doctor.photoURL || '',
      timeSlots: [],
      location: 'New Life Care Diagnostic Centre, Keranitola, Medinipur',
      contact: '+91 97335 25031'
    };

    const updatedSchedules = [...schedules, newSchedule];
    saveSchedules(updatedSchedules);
    setSelectedDoctor(doctor.id);
    toast.success(`Timetable created for ${doctor.name}`);
  };

  const addTimeSlot = () => {
    if (!selectedDoctor) {
      toast.error('Please select a doctor first');
      return;
    }
    
    const schedule = schedules.find(s => s.doctorId === selectedDoctor);
    if (schedule) {
      const newSlotWithId = {
        ...newSlot,
        id: Date.now().toString()
      };
      
      const updatedSchedules = schedules.map(s => 
        s.doctorId === selectedDoctor 
          ? { ...s, timeSlots: [...s.timeSlots, newSlotWithId] }
          : s
      );
      
      saveSchedules(updatedSchedules);
      
      setNewSlot({
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:00',
        isAvailable: true
      });
      setShowAddSlot(false);
      toast.success('Time slot added successfully!');
    }
  };

  const startEditSlot = (slot: TimeSlot) => {
    setEditingSlot(slot);
    setNewSlot({
      day: slot.day,
      startTime: slot.startTime,
      endTime: slot.endTime,
      isAvailable: slot.isAvailable
    });
    setShowAddSlot(true);
  };

  const updateTimeSlot = () => {
    if (!selectedDoctor || !editingSlot) return;
    
    const updatedSchedules = schedules.map(schedule => 
      schedule.doctorId === selectedDoctor 
        ? {
            ...schedule,
            timeSlots: schedule.timeSlots.map(slot =>
              slot.id === editingSlot.id 
                ? { ...slot, ...newSlot }
                : slot
            )
          }
        : schedule
    );
    
    saveSchedules(updatedSchedules);
    
    setEditingSlot(null);
    setShowAddSlot(false);
    setNewSlot({
      day: 'Monday',
      startTime: '09:00',
      endTime: '10:00',
      isAvailable: true
    });
    toast.success('Time slot updated successfully!');
  };

  const toggleSlotAvailability = (doctorId: string, slotId: string) => {
    const updatedSchedules = schedules.map(schedule => 
      schedule.doctorId === doctorId 
        ? {
            ...schedule,
            timeSlots: schedule.timeSlots.map(slot =>
              slot.id === slotId 
                ? { ...slot, isAvailable: !slot.isAvailable }
                : slot
            )
          }
        : schedule
    );
    
    saveSchedules(updatedSchedules);
    toast.success('Slot availability updated!');
  };

  const deleteTimeSlot = (doctorId: string, slotId: string) => {
    if (window.confirm('Are you sure you want to delete this time slot?')) {
      const updatedSchedules = schedules.map(schedule => 
        schedule.doctorId === doctorId 
          ? {
              ...schedule,
              timeSlots: schedule.timeSlots.filter(slot => slot.id !== slotId)
            }
          : schedule
      );
      
      saveSchedules(updatedSchedules);
      toast.success('Time slot deleted successfully!');
    }
  };

  const deleteTimetable = (doctorId: string) => {
    const doctorName = schedules.find(s => s.doctorId === doctorId)?.doctorName;
    if (window.confirm(`Are you sure you want to delete the entire timetable for ${doctorName}?`)) {
      const updatedSchedules = schedules.filter(s => s.doctorId !== doctorId);
      saveSchedules(updatedSchedules);
      setSelectedDoctor('');
      toast.success(`Timetable for ${doctorName} deleted successfully!`);
    }
  };

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
                <h1 className="text-2xl font-bold text-text">Timetable Management</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Available Doctors Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-text mb-4">Available Doctors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctorsWithSchedules.map((doctor) => (
                <div key={doctor.id} className="card">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {doctor.photoURL ? (
                        <img
                          src={doctor.photoURL}
                          alt={doctor.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <Users className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-text">{doctor.name}</h3>
                      <p className="text-sm text-primary">{doctor.specialization}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {doctor.hasSchedule ? (
                      <>
                        <button
                          onClick={() => setSelectedDoctor(doctor.id)}
                          className="btn-primary flex-1 text-sm"
                        >
                          Manage Timetable
                        </button>
                        <button
                          onClick={() => deleteTimetable(doctor.id)}
                          className="btn-secondary text-sm px-3"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => createTimetable(doctor)}
                        className="btn-primary w-full text-sm"
                      >
                        Create Timetable
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timetable Management */}
          {selectedDoctor && (
            <div className="space-y-8">
              {/* Selected Doctor Info */}
              {(() => {
                const schedule = schedules.find(s => s.doctorId === selectedDoctor);
                if (!schedule) return null;
                
                return (
                  <div className="card">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {schedule.photoURL ? (
                          <img
                            src={schedule.photoURL}
                            alt={schedule.doctorName}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <Users className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-text">{schedule.doctorName}</h2>
                        <p className="text-primary font-medium">{schedule.specialization}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{schedule.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span>{schedule.contact}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Add/Edit Time Slot Button */}
                    <div className="mb-6">
                      <button
                        onClick={() => {
                          setShowAddSlot(true);
                          setEditingSlot(null);
                          setNewSlot({
                            day: 'Monday',
                            startTime: '09:00',
                            endTime: '10:00',
                            isAvailable: true
                          });
                        }}
                        className="btn-primary flex items-center space-x-2"
                      >
                        <Plus className="h-5 w-5" />
                        <span>Add Time Slot</span>
                      </button>
                    </div>

                    {/* Add/Edit Time Slot Form */}
                    {showAddSlot && (
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">
                          {editingSlot ? 'Edit Time Slot' : 'Add New Time Slot'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <select
                            value={newSlot.day}
                            onChange={(e) => setNewSlot(prev => ({ ...prev, day: e.target.value }))}
                            className="input-field"
                          >
                            {days.map(day => (
                              <option key={day} value={day}>{day}</option>
                            ))}
                          </select>
                          <select
                            value={newSlot.startTime}
                            onChange={(e) => setNewSlot(prev => ({ ...prev, startTime: e.target.value }))}
                            className="input-field"
                          >
                            {timeSlots.map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                          <select
                            value={newSlot.endTime}
                            onChange={(e) => setNewSlot(prev => ({ ...prev, endTime: e.target.value }))}
                            className="input-field"
                          >
                            {timeSlots.map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                          <div className="flex space-x-2">
                            <button
                              onClick={editingSlot ? updateTimeSlot : addTimeSlot}
                              className="btn-primary flex-1"
                            >
                              {editingSlot ? 'Update' : 'Add'}
                            </button>
                            <button
                              onClick={() => {
                                setShowAddSlot(false);
                                setEditingSlot(null);
                              }}
                              className="btn-secondary"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Weekly Schedule */}
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                      {days.map(day => {
                        const daySlots = schedule.timeSlots.filter(slot => slot.day === day);
                        return (
                          <div key={day} className="space-y-2">
                            <div className={`text-center p-2 rounded-lg font-medium ${getDayColor(day)}`}>
                              {day}
                            </div>
                            {daySlots.length > 0 ? (
                              daySlots.map(slot => (
                                <div
                                  key={slot.id}
                                  className={`p-3 rounded-lg border ${
                                    slot.isAvailable 
                                      ? 'bg-green-50 border-green-200' 
                                      : 'bg-red-50 border-red-200'
                                  }`}
                                >
                                  <div className="text-center mb-2">
                                    <div className="text-sm font-medium">
                                      {slot.startTime} - {slot.endTime}
                                    </div>
                                    <div className={`text-xs ${
                                      slot.isAvailable ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                      {slot.isAvailable ? 'Available' : 'Unavailable'}
                                    </div>
                                  </div>
                                  <div className="flex space-x-1">
                                    <button
                                      onClick={() => startEditSlot(slot)}
                                      className="flex-1 p-1 rounded bg-blue-100 text-blue-600 hover:bg-blue-200 text-xs"
                                    >
                                      <Edit className="h-3 w-3 inline mr-1" />
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => toggleSlotAvailability(schedule.doctorId, slot.id)}
                                      className={`flex-1 p-1 rounded text-xs ${
                                        slot.isAvailable 
                                          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                                      }`}
                                    >
                                      {slot.isAvailable ? 'Make Unavailable' : 'Make Available'}
                                    </button>
                                    <button
                                      onClick={() => deleteTimeSlot(schedule.doctorId, slot.id)}
                                      className="p-1 rounded bg-red-100 text-red-600 hover:bg-red-200 text-xs"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="p-3 text-center text-gray-400 text-sm">
                                No slots
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* No Doctor Selected */}
          {!selectedDoctor && schedules.length > 0 && (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text mb-2">Select a Doctor</h3>
              <p className="text-gray-600">
                Choose a doctor from the list above to manage their schedule and time slots.
              </p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminTimetablePage;
