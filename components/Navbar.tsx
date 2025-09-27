'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

import { useDoctors } from '@/contexts/DoctorsContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { getActiveDoctors } = useDoctors();
  const [selectedDoctorName, setSelectedDoctorName] = useState('');

  // Check if we're on the booking page and get the selected doctor
  useEffect(() => {
    if (pathname === '/booking') {
      const doctorId = searchParams.get('doctor');
      if (doctorId) {
        const doctors = getActiveDoctors();
        const doctor = doctors.find(d => d.id === doctorId);
        if (doctor) {
          setSelectedDoctorName(doctor.name);
        }
      } else {
        setSelectedDoctorName('');
      }
    } else {
      setSelectedDoctorName('');
    }
  }, [pathname, searchParams, getActiveDoctors]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/departments', label: 'Departments' },
    { href: '/doctors', label: 'Doctors' },
    { 
      href: '/booking', 
      label: selectedDoctorName ? `Book with ${selectedDoctorName}` : 'Book Appointment' 
    },
    { href: '/timetable', label: 'Timetable' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img 
              src="/logo.png" 
              alt="NEW LIFECARE" 
              className="h-10 w-auto hover:scale-105 transition-transform duration-200"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                if (nextElement) {
                  nextElement.style.display = 'block';
                }
              }}
            />
            <span className="text-xl font-bold text-primary hidden">
              NEW LIFECARE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-text hover:text-primary font-medium transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-text hover:text-primary transition-colors duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 text-text hover:text-primary font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
