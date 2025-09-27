'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

const ContactPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactForm>();

  const onSubmit = async (data: ContactForm) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/contactMessage', {
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
      } else {
        toast.error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get in touch with us for appointments, consultations, or any medical inquiries. 
            We're here to help you with your healthcare needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="card">
              <h2 className="text-2xl font-bold text-text mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text mb-1">Phone</h3>
                    <p className="text-gray-600 mb-2">+91 97335 25031</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text mb-1">Email</h3>
                    <p className="text-gray-600 mb-2">newlifecaredc@gmail.com</p>
                    <p className="text-sm text-gray-500">newlifecaredc@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text mb-1">Address</h3>
                                         <p className="text-gray-600">
                       Mahamaya Nursing Home<br />
                       Station Road<br />
                       West Midnapore, West Bengal<br />
                       India - 721101
                     </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text mb-1">Working Hours</h3>
                    <div className="space-y-1">
                      <p className="text-gray-600">Monday - Saturday: 8:00 AM - 8:00 PM</p>
                      <p className="text-gray-600">Sunday: Closed</p>
                      <p className="text-sm text-gray-500">Emergency services available 24/7</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact */}
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

            {/* Additional Information */}
            <div className="card">
              <h3 className="text-xl font-bold text-text mb-4">Additional Information</h3>
              <div className="space-y-3 text-gray-600">
                <p>• Free parking available for patients</p>
                <p>• Wheelchair accessible facility</p>
                <p>• Online appointment booking available</p>
                <p>• Insurance accepted</p>
                <p>• Multi-language support (English, Bengali, Hindi)</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card">
            <h2 className="text-2xl font-bold text-text mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="input-field"
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
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
                  Message *
                </label>
                <textarea
                  {...register('message', { 
                    required: 'Message is required',
                    minLength: {
                      value: 10,
                      message: 'Message must be at least 10 characters'
                    }
                  })}
                  rows={6}
                  className="input-field resize-none"
                  placeholder="Please describe your inquiry or concern..."
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2" size={16} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <div className="card">
            <h2 className="text-2xl font-bold text-text mb-6">Find Us</h2>
            <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.1234567890123!2d87.3196276!3d22.4226693!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1d5b471bfe9f85%3A0x869a84be76f4fa86!2sRabindra%20Nagar%2C%20Midnapore%2C%20West%20Bengal%20721101%2C%20India!5e0!3m2!1sen!2sin!4v1234567890123"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Station Road Mahamaya Nursing Home, Midnapore Location"
              ></iframe>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="card">
            <h2 className="text-2xl font-bold text-text mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-text mb-2">How do I book an appointment?</h3>
                <p className="text-gray-600">
                  You can book an appointment online through our website, call us directly, or visit our clinic in person.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-text mb-2">What documents should I bring?</h3>
                <p className="text-gray-600">
                  Please bring your ID proof, previous medical records, and any current medications you're taking.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-text mb-2">Do you accept insurance?</h3>
                <p className="text-gray-600">
                  Yes, we accept most major health insurance plans. Please contact us to verify your coverage.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-text mb-2">What are your emergency procedures?</h3>
                <p className="text-gray-600">
                  For medical emergencies, please call our emergency number immediately. We have 24/7 emergency services available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
