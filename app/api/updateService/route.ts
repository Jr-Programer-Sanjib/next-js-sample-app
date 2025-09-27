import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceId, name, description, icon, phoneNumber, isActive } = body;

    if (!serviceId || !name || !description) {
      return NextResponse.json(
        { error: 'Service ID, name and description are required' },
        { status: 400 }
      );
    }

    if (!db) {
      return NextResponse.json(
        { error: 'Database not initialized' },
        { status: 500 }
      );
    }

    const updateData: any = {
      name: name.trim(),
      description: description.trim(),
      updatedAt: serverTimestamp(),
    };

    if (icon) {
      updateData.icon = icon;
    }

    if (phoneNumber !== undefined) {
      updateData.phoneNumber = phoneNumber;
    }

    if (typeof isActive === 'boolean') {
      updateData.isActive = isActive;
    }

    const serviceRef = doc(db, 'services', serviceId);
    await updateDoc(serviceRef, updateData);

    return NextResponse.json({
      success: true,
      message: 'Service updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    );
  }
}
