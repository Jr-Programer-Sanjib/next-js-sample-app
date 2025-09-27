import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    // Check if Firebase is initialized
    if (!db) {
      return NextResponse.json(
        { error: 'Firebase not initialized' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { patientName, phone, email, doctorId, doctorName, department, date, time, symptoms } = body;

    // Validate required fields
    if (!patientName || !phone || !email || !doctorId || !doctorName || !department || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create appointment document
    const appointmentData = {
      patientName,
      phone,
      email,
      doctorId,
      doctorName,
      department,
      date,
      time,
      symptoms: symptoms || '',
      status: 'pending',
      createdAt: serverTimestamp(),
    };

    // Add to Firestore
    const docRef = await addDoc(collection(db, 'appointments'), appointmentData);

    console.log('Appointment saved to Firebase:', appointmentData);

    return NextResponse.json({
      success: true,
      appointmentId: docRef.id,
      message: 'Appointment booked successfully! We will contact you soon.',
    });
  } catch (error) {
    console.error('Error booking appointment:', error);
    return NextResponse.json(
      { error: 'Failed to book appointment' },
      { status: 500 }
    );
  }
}
