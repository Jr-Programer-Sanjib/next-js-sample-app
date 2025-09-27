'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

interface DoctorsContextType {
  doctors: Doctor[];
  addDoctor: (doctor: Omit<Doctor, 'id'>) => void;
  updateDoctor: (id: string, doctor: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;
  getActiveDoctors: () => Doctor[];
  refreshDoctors: () => void;
  clearAllDoctors: () => void;
}

const DoctorsContext = createContext<DoctorsContextType | undefined>(undefined);

export const useDoctors = () => {
  const context = useContext(DoctorsContext);
  if (context === undefined) {
    console.error('useDoctors must be used within a DoctorsProvider');
    return {
      doctors: [],
      addDoctor: () => {},
      updateDoctor: () => {},
      deleteDoctor: () => {},
      getActiveDoctors: () => [],
      refreshDoctors: () => {},
      clearAllDoctors: () => {},
    };
  }
  return context;
};

interface DoctorsProviderProps {
  children: ReactNode;
}

export const DoctorsProvider: React.FC<DoctorsProviderProps> = ({ children }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load doctors from localStorage on mount
  useEffect(() => {
    console.log('🔍 DoctorsContext: Initializing...');
    
    try {
      const savedDoctors = localStorage.getItem('doctors');
      if (savedDoctors) {
        const parsedDoctors = JSON.parse(savedDoctors);
        // Migrate old schema where specialization was a string
        const migrated = parsedDoctors.map((d: any) => ({
          ...d,
          specializations: Array.isArray(d.specializations)
            ? d.specializations
            : d.specialization
            ? [d.specialization]
            : [],
        }));
        console.log('🔍 Found saved doctors (migrated):', migrated);
        setDoctors(migrated);
      } else {
        console.log('🔍 No saved doctors found, setting defaults...');
        const defaultDoctors: Doctor[] = [
          {
            id: '1',
            name: 'Dr. Rajesh Kumar',
            specializations: ['Cardiology'],
            email: 'rajesh.kumar@newlifecare.com',
            phone: '+91 97335 25031',
            photoURL: '',
            bio: 'Experienced cardiologist with 15+ years of practice.',
            experience: '15 years',
            schedule: 'Mon-Fri: 9:00 AM - 5:00 PM',
            country: 'India',
            isActive: true
          },
          {
            id: '2',
            name: 'Dr. Priya Sharma',
            specializations: ['Dermatology'],
            email: 'priya.sharma@newlifecare.com',
            phone: '+91 98765 43211',
            photoURL: '',
            bio: 'Specialist in skin diseases and cosmetic dermatology.',
            experience: '12 years',
            schedule: 'Mon-Sat: 10:00 AM - 6:00 PM',
            country: 'India',
            isActive: true
          }
        ];
        setDoctors(defaultDoctors);
        localStorage.setItem('doctors', JSON.stringify(defaultDoctors));
        console.log('🔍 Default doctors set:', defaultDoctors);
      }
    } catch (error) {
      console.error('❌ Error loading doctors:', error);
      setDoctors([]);
    }
    
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever doctors change (but not on initial load)
  useEffect(() => {
    if (isInitialized) {
      console.log('💾 Saving doctors to localStorage:', doctors);
      localStorage.setItem('doctors', JSON.stringify(doctors));
    }
  }, [doctors, isInitialized]);

  const addDoctor = (doctor: Omit<Doctor, 'id'>) => {
    console.log('➕ Adding doctor:', doctor);
    const newDoctor: Doctor = {
      ...doctor,
      id: Date.now().toString(),
    };
    console.log('➕ New doctor with ID:', newDoctor);
    setDoctors(prev => {
      const updated = [...prev, newDoctor];
      console.log('➕ Updated doctors list:', updated);
      return updated;
    });
  };

  const updateDoctor = (id: string, updates: Partial<Doctor>) => {
    console.log('✏️ Updating doctor:', id, updates);
    setDoctors(prev => 
      prev.map(doctor => 
        doctor.id === id ? { ...doctor, ...updates } : doctor
      )
    );
  };

  const deleteDoctor = (id: string) => {
    console.log('🗑️ Deleting doctor:', id);
    setDoctors(prev => prev.filter(doctor => doctor.id !== id));
  };

  const getActiveDoctors = () => {
    const active = doctors.filter(doctor => doctor.isActive);
    console.log('👥 Active doctors:', active);
    return active;
  };

  const refreshDoctors = () => {
    console.log('🔄 Refreshing doctors from localStorage...');
    try {
      const savedDoctors = localStorage.getItem('doctors');
      if (savedDoctors) {
        const parsedDoctors = JSON.parse(savedDoctors);
        const migrated = parsedDoctors.map((d: any) => ({
          ...d,
          specializations: Array.isArray(d.specializations)
            ? d.specializations
            : d.specialization
            ? [d.specialization]
            : [],
        }));
        console.log('🔄 Found saved doctors (migrated):', migrated);
        setDoctors(migrated);
      } else {
        console.log('🔄 No saved doctors found during refresh');
        setDoctors([]);
      }
    } catch (error) {
      console.error('❌ Error refreshing doctors:', error);
    }
  };

  const clearAllDoctors = () => {
    console.log('🧹 Clearing all doctors');
    setDoctors([]);
    localStorage.removeItem('doctors');
  };

  const value: DoctorsContextType = {
    doctors,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    getActiveDoctors,
    refreshDoctors,
    clearAllDoctors,
  };

  return (
    <DoctorsContext.Provider value={value}>
      {children}
    </DoctorsContext.Provider>
  );
};
