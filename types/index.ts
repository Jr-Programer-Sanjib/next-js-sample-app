export interface Doctor {
  id: string;
  name: string;
  specializations: string[];
  photoURL: string;
  bio: string;
  timetable: {
    [key: string]: string[];
  };
  experience: string;
  education: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  phone: string;
  email: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  symptoms: string;
  status: 'pending' | 'approved' | 'cancelled' | 'completed';
  createdAt: Date;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  icon: string;
  doctors: string[];
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  name: string;
}
