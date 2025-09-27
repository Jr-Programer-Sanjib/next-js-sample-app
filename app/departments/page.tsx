'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Heart, 
  Stethoscope, 
  Users, 
  Shield, 
  Baby, 
  Activity,
  ArrowRight,
  Phone,
  Calendar
} from 'lucide-react';

const DepartmentsPage = () => {
  const departments = [
    {
      id: 'cardiology',
      name: 'Cardiology',
      icon: Heart,
      description: 'Expert heart care with advanced diagnostic facilities and treatment for cardiovascular diseases.',
      doctors: 3,
      services: ['ECG', 'Echo', 'Stress Test', 'Holter Monitor'],
      color: 'bg-red-500',
    },
    {
      id: 'general-medicine',
      name: 'General Medicine',
      icon: Stethoscope,
      description: 'Comprehensive primary healthcare services for adults with a focus on preventive care.',
      doctors: 4,
      services: ['Health Checkup', 'Disease Management', 'Preventive Care', 'Chronic Disease Care'],
      color: 'bg-blue-500',
    },
    {
      id: 'orthopedics',
      name: 'Orthopedics',
      icon: Activity,
      description: 'Specialized care for bone and joint problems, sports injuries, and musculoskeletal conditions.',
      doctors: 2,
      services: ['Joint Replacement', 'Sports Medicine', 'Fracture Care', 'Physical Therapy'],
      color: 'bg-green-500',
    },
    {
      id: 'pediatrics',
      name: 'Pediatrics',
      icon: Baby,
      description: 'Specialized care for children and infants with child-friendly environment and expert pediatricians.',
      doctors: 3,
      services: ['Child Health', 'Vaccination', 'Growth Monitoring', 'Child Development'],
      color: 'bg-yellow-500',
    },
    {
      id: 'gynecology',
      name: 'Gynecology',
      icon: Users,
      description: 'Comprehensive women\'s health care including obstetrics, gynecology, and reproductive health.',
      doctors: 2,
      services: ['Prenatal Care', 'Family Planning', 'Gynecological Surgery', 'Women\'s Health'],
      color: 'bg-pink-500',
    },
    {
      id: 'dermatology',
      name: 'Dermatology',
      icon: Shield,
      description: 'Expert skin care treatment for various skin conditions, allergies, and cosmetic procedures.',
      doctors: 2,
      services: ['Skin Treatment', 'Allergy Testing', 'Cosmetic Procedures', 'Hair Care'],
      color: 'bg-purple-500',
    },
    {
      id: 'emergency-care',
      name: 'Emergency Care',
      icon: Shield,
      description: '24/7 emergency medical services with state-of-the-art equipment and experienced emergency physicians.',
      doctors: 5,
      services: ['Trauma Care', 'Critical Care', 'Emergency Surgery', 'Ambulance Service'],
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text mb-4">Our Medical Departments</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We offer comprehensive healthcare services across multiple specialized departments, 
            each staffed with experienced medical professionals dedicated to your health and well-being.
          </p>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {departments.map((department) => (
            <div key={department.id} className="card group hover:scale-105 transition-transform duration-200">
              {/* Department Icon */}
              <div className={`w-16 h-16 ${department.color} bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-opacity-20 transition-all duration-200`}>
                <department.icon className={`h-8 w-8 ${department.color.replace('bg-', 'text-')}`} />
              </div>

              {/* Department Info */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-text mb-2">{department.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {department.description}
                </p>
                
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {department.doctors} Doctors
                  </span>
                </div>
              </div>

              {/* Services */}
              <div className="mb-6">
                <h4 className="font-semibold text-text mb-3">Services:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {department.services.map((service, index) => (
                    <div key={index} className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                      {service}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  href={`/doctors?department=${department.id}`}
                  className="btn-primary w-full flex items-center justify-center"
                >
                  <Calendar className="mr-2" size={16} />
                  Book Appointment
                </Link>
                
                <div className="flex space-x-2">
                  <Link
                    href={`/doctors?department=${department.id}`}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-text font-medium py-2 px-4 rounded-2xl transition-all duration-200 flex items-center justify-center text-sm"
                  >
                    <Users className="mr-2" size={16} />
                    View Doctors
                  </Link>
                  <a
                    href="tel:+919876543210"
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-text font-medium py-2 px-4 rounded-2xl transition-all duration-200 flex items-center justify-center text-sm"
                  >
                    <Phone className="mr-2" size={16} />
                    Call
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="card max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-6">
              Need Help Choosing the Right Department?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Our healthcare professionals are here to guide you to the right department 
              based on your symptoms and medical history.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-text mb-2">Call Us</h3>
                <p className="text-gray-600 text-sm">Speak with our medical staff for guidance</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-semibold text-text mb-2">Book Consultation</h3>
                <p className="text-gray-600 text-sm">Schedule a general consultation first</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="font-semibold text-text mb-2">Meet Our Doctors</h3>
                <p className="text-gray-600 text-sm">Browse our team of specialists</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary inline-flex items-center">
                <Phone className="mr-2" size={16} />
                Contact Us
              </Link>
              <Link href="/booking" className="btn-secondary inline-flex items-center">
                <Calendar className="mr-2" size={16} />
                Book Consultation
              </Link>
              <Link href="/doctors" className="btn-secondary inline-flex items-center">
                <Users className="mr-2" size={16} />
                View All Doctors
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-16">
          <div className="card">
            <h2 className="text-2xl font-bold text-text mb-6">Why Choose Our Departments?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-text mb-2">Expert Care</h3>
                <p className="text-gray-600 text-sm">Experienced specialists in each department</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-text mb-2">Modern Equipment</h3>
                <p className="text-gray-600 text-sm">State-of-the-art medical technology</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-text mb-2">Patient-Centered</h3>
                <p className="text-gray-600 text-sm">Personalized care and attention</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-text mb-2">Easy Booking</h3>
                <p className="text-gray-600 text-sm">Convenient online appointment booking</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentsPage;
