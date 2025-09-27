import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { appointmentId, status, notes } = body;

    // Validate required fields
    if (!appointmentId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Check if Firebase is initialized
    if (!db) {
      return NextResponse.json(
        { error: 'Firebase not initialized' },
        { status: 500 }
      );
    }

    // Update appointment in Firestore
    const appointmentRef = doc(db, 'appointments', appointmentId);
    const updateData: any = {
      status,
      updatedAt: serverTimestamp(),
    };

    // Add notes if provided
    if (notes) {
      updateData.notes = notes;
    }

    // Add status change timestamp
    if (status === 'confirmed') {
      updateData.confirmedAt = serverTimestamp();
    } else if (status === 'completed') {
      updateData.completedAt = serverTimestamp();
    } else if (status === 'cancelled') {
      updateData.cancelledAt = serverTimestamp();
    }

    await updateDoc(appointmentRef, updateData);

    return NextResponse.json({
      success: true,
      message: `Appointment ${status} successfully`,
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}
