import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching services from Firebase...');
    
    if (!db) {
      console.error('Firebase db not initialized');
      return NextResponse.json(
        { error: 'Database not initialized' },
        { status: 500 }
      );
    }

    try {
      const servicesRef = collection(db, 'services');
      const q = query(servicesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const services: any[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        services.push({
          id: doc.id,
          name: data.name || '',
          description: data.description || '',
          icon: data.icon || 'Stethoscope',
          phoneNumber: data.phoneNumber || '',
          isActive: data.isActive !== false, // Default to true if not set
          createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
        });
      });

      console.log(`Found ${services.length} services`);
      return NextResponse.json({
        success: true,
        services,
        total: services.length,
      });
    } catch (firebaseError: any) {
      console.error('Firebase error:', firebaseError);
      if (firebaseError.code === 'permission-denied') {
        return NextResponse.json({
          success: true,
          services: [],
          message: 'Firebase permissions issue. Please check security rules.',
        });
      }
      throw firebaseError;
    }
  } catch (error: any) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch services',
        details: error.message,
        stack: error.stack 
      },
      { status: 500 }
    );
  }
}
