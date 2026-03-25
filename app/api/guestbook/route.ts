import { NextRequest, NextResponse } from 'next/server';

const SPRING_API_URL = process.env.SPRING_API_URL || 'http://localhost:8080';

// 방명록 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '10';

    const response = await fetch(
      `${SPRING_API_URL}/api/guestbook?page=${page}&size=${size}`,
      { next: { revalidate: 0 } }
    );

    if (!response.ok) {
      return NextResponse.json({ content: [], totalElements: 0, totalPages: 0 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('방명록 조회 오류:', error);
    return NextResponse.json({ content: [], totalElements: 0, totalPages: 0 });
  }
}

// 방명록 작성
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, message } = data;

    if (!name?.trim() || !message?.trim()) {
      return NextResponse.json({ success: false, message: '이름과 메시지를 입력해주세요.' }, { status: 400 });
    }

    const response = await fetch(`${SPRING_API_URL}/api/guestbook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, message }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Spring Boot 방명록 오류:', errorText);
      return NextResponse.json({ success: false, message: '서버 오류가 발생했습니다.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('방명록 작성 오류:', error);
    return NextResponse.json({ success: false, message: '처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
