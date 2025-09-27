'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: '/', label: 'Home' },
    { href: '/departments', label: 'Departments' },
    { href: '/doctors', label: 'Doctors' },
    { href: '/booking', label: 'Book Appointment' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact' },
  ];

  const services = [
    'General Medicine',
    'Cardiology',
    'Orthopedics',
    'Pediatrics',
    'Gynecology',
    'Dermatology',
  ];

  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <Logo size="lg" />
            <p className="mt-4 text-gray-600 text-sm">
              Providing quality healthcare services in Midnapore. Your health is our priority.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-text mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-primary text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-text mb-4">Our Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-gray-600 text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-text mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="text-primary" size={16} />
                <span className="text-gray-600 text-sm">+91 96473 93949</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-primary" size={16} />
                <span className="text-gray-600 text-sm">+91 97335 25031</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-primary" size={16} />
                <span className="text-gray-600 text-sm">newlifecaredc@gmail.com</span>
              </div>
                             <div className="flex items-center space-x-3">
                 <MapPin className="text-primary" size={16} />
                 <span className="text-gray-600 text-sm">
                   Mahamaya Nursing Home<br />
                   Station Road, West Midnapore, West Bengal, India
                 </span>
               </div>
              <div className="flex items-center space-x-3">
                <Clock className="text-primary" size={16} />
                <span className="text-gray-600 text-sm">
                  Mon-Sat: 8:00 AM - 8:00 PM
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © {currentYear} New Life Care Midnapore. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link
                href="/privacy"
                className="text-gray-600 hover:text-primary text-sm transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-600 hover:text-primary text-sm transition-colors duration-200"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
