import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, icon, phoneNumber } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }

    if (!db) {
      return NextResponse.json(
        { error: 'Database not initialized' },
        { status: 500 }
      );
    }

    const serviceData = {
      name: name.trim(),
      description: description.trim(),
      icon: icon || 'Stethoscope',
      phoneNumber: phoneNumber || '',
      isActive: true,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'services'), serviceData);

    return NextResponse.json({
      success: true,
      message: 'Service added successfully',
      serviceId: docRef.id,
    });
  } catch (error: any) {
    console.error('Error adding service:', error);
    
    // Check if it's a Firebase permission error
    if (error.message && error.message.includes('permission')) {
      return NextResponse.json(
        { 
          error: 'Firebase permission denied. Please check security rules for services collection.',
          details: error.message 
        },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to add service',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}
