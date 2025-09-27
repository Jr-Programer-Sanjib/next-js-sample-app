'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Phone, Mail, MapPin, Clock, Heart, Stethoscope, Users, Shield } from 'lucide-react';

import { useDoctors } from '@/contexts/DoctorsContext';

const HomePage = () => {
  const { getActiveDoctors } = useDoctors();
  const activeDoctors = getActiveDoctors();
  
  // Get up to 3 active doctors for the home page
  const featuredDoctors = activeDoctors.slice(0, 3);
  
  // Debug logging for home page
  console.log('Home Page - Active doctors:', activeDoctors);
  console.log('Home Page - Featured doctors:', featuredDoctors);
  console.log('Home Page - Doctors with images:', featuredDoctors.filter(d => d.photoURL).length);
  
  // Contact form state
  const [contactForm, setContactForm] = React.useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
  
  const services = [
    {
      icon: Heart,
      title: 'Cardiology',
      description: 'Expert heart care with advanced diagnostic facilities',
    },
    {
      icon: Stethoscope,
      title: 'General Medicine',
      description: 'Comprehensive primary healthcare services',
    },
    {
      icon: Users,
      title: 'Pediatrics',
      description: 'Specialized care for children and infants',
    },
    {
      icon: Shield,
      title: 'Emergency Care',
      description: '24/7 emergency medical services',
    },
    ];
  
  // Handle contact form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const response = await fetch('/api/contactMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      });
      
      if (response.ok) {
        setSubmitStatus('success');
        setContactForm({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: 'url(/background.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>

        {/* Content */}
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                  Quality Healthcare
                  <span className="text-white block">in Midnapore</span>
                </h1>
                <p className="text-xl text-white leading-relaxed">
                  Experience world-class medical care with our team of experienced doctors 
                  and state-of-the-art facilities. Your health is our priority.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/booking" className="btn-primary inline-flex items-center justify-center">
                    Book Appointment
                    <ArrowRight className="ml-2" size={20} />
                  </Link>
                  <Link href="/doctors" className="btn-secondary inline-flex items-center justify-center">
                    Meet Our Doctors
                  </Link>
                </div>
              </div>
                                                           <div className="hidden md:flex justify-center">
                 <img 
                   src="/logo.png" 
                   alt="NEW LIFECARE" 
                   className="w-48 h-48 object-contain hover:scale-105 transition-transform duration-200"
                 />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer a comprehensive range of medical services to meet all your healthcare needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="card text-center group hover:scale-105 transition-transform duration-200">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-200">
                  <service.icon className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-text mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/departments" className="btn-primary inline-flex items-center">
              View All Departments
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              Meet Our Expert Doctors
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our team of experienced and qualified doctors are dedicated to providing the best care
            </p>
          </div>
          
                     {/* Debug Info - Remove in production */}
           {/*
           <div className="mb-8 p-4 bg-blue-50 rounded-lg">
             <h4 className="text-sm font-medium text-blue-800 mb-2">Debug Information</h4>
             <div className="text-xs text-blue-700 space-y-1">
               <p>Total active doctors: {activeDoctors.length}</p>
               <p>Featured doctors: {featuredDoctors.length}</p>
               <p>Doctors with images: {featuredDoctors.filter(d => d.photoURL).length}</p>
             </div>
           </div>
           */}
          
          {featuredDoctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredDoctors.map((doctor, index) => (
                <div key={doctor.id} className="card text-center group hover:scale-105 transition-transform duration-200">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
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
                    <Users className={`text-gray-400 ${doctor.photoURL ? 'hidden' : ''}`} size={40} />
                  </div>
                  <h3 className="text-xl font-semibold text-text mb-2">{doctor.name}</h3>
                  <p className="text-primary font-medium mb-2">{(doctor as any).specializations ? (doctor as any).specializations.join(', ') : (doctor as any).specialization}</p>
                  <p className="text-gray-600 mb-4">{doctor.experience} experience</p>
                  <Link href={`/booking?doctor=${doctor.id}`} className="btn-primary w-full">
                    Book Appointment
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text mb-2">No doctors available</h3>
              <p className="text-gray-600 mb-6">
                Our team of expert doctors will be available soon. Please check back later.
              </p>
              <Link href="/contact" className="btn-primary">
                Contact Us
              </Link>
            </div>
          )}
          
          {featuredDoctors.length > 0 && (
            <div className="text-center mt-12">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/doctors" className="btn-secondary inline-flex items-center">
                  View All Doctors
                  <ArrowRight className="ml-2" size={20} />
                </Link>
                <Link href="/timetable" className="btn-secondary inline-flex items-center">
                  View Timetable
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-text">
                Get in Touch
              </h2>
              <p className="text-xl text-gray-600">
                Have questions? We're here to help. Contact us for appointments, 
                consultations, or any medical inquiries.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Phone className="text-primary" size={24} />
                  <div>
                    <p className="font-semibold text-text">Phone</p>
                    <p className="text-gray-600">+91 97335 25031</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Mail className="text-primary" size={24} />
                  <div>
                    <p className="font-semibold text-text">Email</p>
                    <p className="text-gray-600">newlifecaredc@gmail.com</p>
                  </div>
                  
                </div>
                
                <div className="flex items-center space-x-4">
                  <MapPin className="text-primary" size={24} />
                  <div>
                    <p className="font-semibold text-text">Address</p>
                    <p className="text-gray-600">Midnapore, West Bengal, India</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Clock className="text-primary" size={24} />
                  <div>
                    <p className="font-semibold text-text">Working Hours</p>
                    <p className="text-gray-600">Mon-Sat: 8:00 AM - 8:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-text mb-6">Quick Contact Form</h3>
              
              {/* Success/Error Messages */}
              {submitStatus === 'success' && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  Message sent successfully! We'll get back to you soon.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  Failed to send message. Please try again.
                </div>
              )}
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  required
                  className="input-field"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  required
                  className="input-field"
                />
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  required
                  className="input-field resize-none"
                ></textarea>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
