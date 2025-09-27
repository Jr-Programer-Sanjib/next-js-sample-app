import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { success: false, message: 'Firebase not initialized' },
        { status: 500 }
      );
    }

    // Get messages from Firebase
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const messages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name || '',
      email: doc.data().email || '',
      message: doc.data().message || '',
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      isRead: doc.data().isRead || false
    }));

    return NextResponse.json({
      success: true,
      messages: messages
    });

  } catch (error: any) {
    console.error('Error fetching messages:', error);
    
    // Handle Firebase permission errors gracefully
    if (error.code === 'permission-denied' || error.message?.includes('permission')) {
      return NextResponse.json({
        success: true,
        messages: [],
        message: 'No messages available. Please check Firebase security rules.'
      });
    }

    return NextResponse.json(
      { success: false, message: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
