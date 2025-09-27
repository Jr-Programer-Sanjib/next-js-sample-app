import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import { Toaster } from 'react-hot-toast';
import { DoctorsProvider } from '@/contexts/DoctorsContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'New Life Care Midnapore - Quality Healthcare Services',
  description: 'Providing comprehensive healthcare services in Midnapore, West Bengal. Book appointments with experienced doctors, access diagnostic services, and receive quality medical care.',
  keywords: 'healthcare, hospital, clinic, doctors, appointments, Midnapore, West Bengal, medical services',
  authors: [{ name: 'New Life Care Midnapore' }],
  openGraph: {
    title: 'New Life Care Midnapore - Quality Healthcare Services',
    description: 'Providing comprehensive healthcare services in Midnapore, West Bengal.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DoctorsProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Chatbot />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </DoctorsProvider>
      </body>
    </html>
  );
}
