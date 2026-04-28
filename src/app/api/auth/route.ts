import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { action, email } = body;

  if (action === 'login') {
    // Basic mock logic: accepts any email, saves as fake token
    const token = Buffer.from(email || 'corretor@lumina.com').toString('base64');
    const response = NextResponse.json({ success: true, user: email });
    
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8 // 8 hours session
    });
    
    // Set a client accessible cookie for the name
    response.cookies.set('user-name', email.split('@')[0], {
      path: '/',
      maxAge: 60 * 60 * 8
    });

    return response;
  }

  if (action === 'logout') {
    const response = NextResponse.json({ success: true });
    response.cookies.delete('auth-token');
    response.cookies.delete('user-name');
    return response;
  }

  return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
}
