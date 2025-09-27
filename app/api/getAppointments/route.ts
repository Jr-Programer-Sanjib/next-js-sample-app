import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, where, limit } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    console.log('getAppointments API called');
    
    // Check if Firebase is properly initialized
    if (!db) {
      console.error('Firebase database not initialized');
      return NextResponse.json(
        { error: 'Database not initialized. Please check Firebase configuration.' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limitCount = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100;

    console.log('Building query with status:', status);

    try {
      // Build query
      let q = query(
        collection(db, 'appointments'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      // Add status filter if provided
      if (status && status !== 'all') {
        q = query(q, where('status', '==', status));
      }

      console.log('Executing Firestore query...');

      // Get appointments from Firestore
      const querySnapshot = await getDocs(q);
      const appointments: any[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        appointments.push({
          id: doc.id,
          patientName: data.patientName || '',
          email: data.email || '',
          phone: data.phone || '',
          doctorId: data.doctorId || '',
          doctorName: data.doctorName || '',
          department: data.department || '',
          date: data.date || '',
          time: data.time || '',
          symptoms: data.symptoms || '',
          status: data.status || 'pending',
          createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
        });
      });

      console.log('Successfully fetched appointments:', appointments.length);

      return NextResponse.json({
        success: true,
        appointments,
        total: appointments.length,
      });
    } catch (firebaseError: any) {
      console.error('Firebase error:', firebaseError);
      
      // If it's a permissions error, return empty appointments for now
      if (firebaseError.message && firebaseError.message.includes('permissions')) {
        console.log('Firebase permissions error - returning empty appointments list');
        return NextResponse.json({
          success: true,
          appointments: [],
          total: 0,
          message: 'Firebase permissions not configured. Please check Firestore security rules.',
        });
      }
      
      // Re-throw other Firebase errors
      throw firebaseError;
    }
  } catch (error) {
    console.error('Error in getAppointments API:', error);
    
    // Return more detailed error information
    return NextResponse.json(
      { 
        error: 'Failed to fetch appointments',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
