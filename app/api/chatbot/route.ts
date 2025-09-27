import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `You are a helpful healthcare assistant for New Life Care Midnapore. You can help with:

1. Clinic information (timings, location, contact details)
2. Appointment booking guidance
3. Doctor information and specializations
4. General health advice (but always recommend consulting a doctor for specific medical issues)
5. Service information

Key Information:
- Clinic Hours: Monday to Saturday, 8:00 AM - 8:00 PM
- Phone: +91 97335 25031
- Email: info@newlifecare.com
- Location: Midnapore, West Bengal, India
- Services: General Medicine, Cardiology, Orthopedics, Pediatrics, Gynecology, Dermatology, Emergency Care

Always be polite, professional, and helpful. For medical emergencies, always recommend calling emergency services.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not process your request.';

    return NextResponse.json({
      success: true,
      response,
    });
  } catch (error) {
    console.error('Error in chatbot:', error);
    return NextResponse.json(
      { 
        success: true,
        response: 'I apologize, but I\'m having trouble connecting right now. Please call us at +91 97335 25031 for immediate assistance.'
      },
      { status: 200 }
    );
  }
}
