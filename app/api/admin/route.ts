import { NextRequest, NextResponse } from 'next/server';

const SPRING_API_URL = process.env.SPRING_API_URL || 'http://localhost:8080';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

// 관리자 인증 확인
function checkAuth(request: NextRequest): boolean {
  const password = request.headers.get('x-admin-password');
  return ADMIN_PASSWORD !== '' && password === ADMIN_PASSWORD;
}

// 관리자 데이터 조회: /api/admin?type=rsvp 또는 ?type=guestbook
export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'rsvp';
  const page = searchParams.get('page') || '0';
  const size = searchParams.get('size') || '100';

  try {
    let endpoint = '';
    if (type === 'rsvp') {
      endpoint = `${SPRING_API_URL}/api/admin/rsvp?page=${page}&size=${size}`;
    } else if (type === 'guestbook') {
      endpoint = `${SPRING_API_URL}/api/admin/guestbook?page=${page}&size=${size}`;
    } else {
      return NextResponse.json({ error: '올바르지 않은 타입입니다.' }, { status: 400 });
    }

    const response = await fetch(endpoint, {
      headers: { 'X-Admin-Password': ADMIN_PASSWORD },
    });

    if (!response.ok) {
      return NextResponse.json({ error: '데이터를 불러올 수 없습니다.' }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('관리자 데이터 조회 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 관리자 로그인 확인 (POST /api/admin with { password })
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ success: false }, { status: 401 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
