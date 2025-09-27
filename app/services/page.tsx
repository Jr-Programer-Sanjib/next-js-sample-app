'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  Stethoscope, 
  Activity, 
  Shield, 
  Baby, 
  Users,
  Microscope,
  Camera,
  Syringe,
  Pill,
  Calendar,
  Phone,
  ArrowRight,
  CheckCircle,
  Loader2
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  phoneNumber: string;
  isActive: boolean;
  createdAt: string;
}

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/getServices');
      const data = await response.json();
      
      if (data.success) {
        setServices(data.services);
      } else {
        setError('Failed to load services');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };








  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-xl text-gray-600">Loading services...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <Shield className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-text mb-2">Error Loading Services</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchServices}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-gray-400 mb-4">
              <Stethoscope className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-text mb-2">No Services Available</h2>
            <p className="text-gray-600 mb-4">Please check back later or contact us for more information.</p>
            <Link href="/contact" className="btn-primary">
              Contact Us
            </Link>
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
          <h1 className="text-4xl font-bold text-text mb-4">Our Medical Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide comprehensive healthcare services with state-of-the-art technology 
            and experienced medical professionals. Our services are designed to meet all your healthcare needs.
          </p>
        </div>

        {/* Services */}
        <div className="space-y-16">
          {services.length > 0 ? (
            <div className="card">
              {/* Services Header */}
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mr-6">
                  <Stethoscope className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-text mb-2">Our Services</h2>
                  <p className="text-gray-600 text-lg">
                    {services.length} service{services.length !== 1 ? 's' : ''} available
                  </p>
                </div>
              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service) => (
                  <div key={service.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-text">{service.name}</h3>
                      <span className="text-sm text-gray-500">{service.icon}</span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Calendar className="h-4 w-4 mr-2" />
                      Created: {new Date(service.createdAt).toLocaleDateString()}
                    </div>

                    {/* Status */}
                    <div className="mb-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        service.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {service.isActive ? 'Available' : 'Currently Unavailable'}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      {service.isActive ? (
                        <Link
                          href="/booking"
                          className="btn-primary flex-1 flex items-center justify-center"
                        >
                          <Calendar className="mr-2" size={16} />
                          Book Now
                        </Link>
                      ) : (
                        <button 
                          disabled
                          className="btn-secondary flex-1 flex items-center justify-center opacity-50 cursor-not-allowed"
                        >
                          <Calendar className="mr-2" size={16} />
                          Unavailable
                        </button>
                      )}
                                              <button 
                          onClick={() => service.phoneNumber ? window.open(`tel:${service.phoneNumber}`) : alert('No phone number available')}
                          className="btn-secondary flex items-center justify-center px-4"
                          disabled={!service.phoneNumber}
                        >
                          <Phone className="mr-2" size={16} />
                          {service.phoneNumber ? 'Call' : 'No Phone'}
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card text-center py-12">
              <Stethoscope className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Services Available</h3>
              <p className="text-gray-500">Please check back later or contact us for more information.</p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-16">
          <div className="card text-center">
            <h2 className="text-3xl font-bold text-text mb-6">
              Need Help Choosing the Right Service?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Our healthcare professionals are here to guide you to the right service 
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
              <Link href="/departments" className="btn-secondary inline-flex items-center">
                <ArrowRight className="mr-2" size={16} />
                View Departments
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-16">
          <div className="card">
            <h2 className="text-2xl font-bold text-text mb-6">Why Choose Our Services?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-text mb-2">Quality Care</h3>
                <p className="text-gray-600 text-sm">High-quality medical services</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-text mb-2">Modern Technology</h3>
                <p className="text-gray-600 text-sm">State-of-the-art medical equipment</p>
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

export default ServicesPage;
