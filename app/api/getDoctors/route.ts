import { NextRequest, NextResponse } from 'next/server';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  email: string;
  phone: string;
  photoURL: string;
  bio: string;
  experience: string;
  schedule: string;
  country: string;
  isActive: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const specialization = searchParams.get('specialization');

    // For now, return empty array since we're using localStorage
    // In a real app, this would fetch from Firebase
    const doctors: Doctor[] = [];

    return NextResponse.json({
      success: true,
      doctors,
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
}
