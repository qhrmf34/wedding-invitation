import { NextResponse } from 'next/server';

const SPRING_API_URL = process.env.SPRING_API_URL || 'http://localhost:8080';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, side, isAttending, guestCount, hasMeal, message, timestamp } = data;

    // Spring Boot 백엔드로 전달
    const response = await fetch(`${SPRING_API_URL}/api/rsvp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, side, isAttending, guestCount, hasMeal, message, timestamp }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Spring Boot RSVP 오류:', errorText);
      return NextResponse.json({ success: false, message: '서버 오류가 발생했습니다.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('RSVP 처리 오류:', error);
    return NextResponse.json({ success: false, message: 'RSVP 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
