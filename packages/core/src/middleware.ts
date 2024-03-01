import { jwtDecode } from 'jwt-decode';
import { NextRequest, NextResponse } from 'next/server';

import { roleType } from '@/types/auth';

const verifyUserRole = async (accessToken: string, role: roleType) => {
  const jwt_decode = jwtDecode(accessToken) as {
    auth: string;
    sub: string;
  };
  const userRoles = jwt_decode.auth.split(',');
  if (userRoles.includes('ROLE_ADMIN')) {
    return true;
  } else return userRoles.includes(role);
};

export const config = {
  matcher: ['/admin/:path*', '/editor/:path*'],
};

export async function middleware(request: NextRequest) {
  const { cookies } = request;
  const accessToken = cookies.get('access-token');

  if (!accessToken) {
    return NextResponse.redirect(
      new URL(
        `/user/login?redirect=${encodeURIComponent(request.url)}`,
        request.url
      )
    );
  }

  if (
    request.nextUrl.pathname.startsWith('/editor') &&
    (await verifyUserRole(accessToken.value, 'ROLE_ARTIST'))
  ) {
    return NextResponse.redirect(
      new URL(
        `/user/login?redirect=${encodeURIComponent(request.url)}`,
        request.url
      )
    );
  } else if (
    request.nextUrl.pathname.startsWith('/admin') &&
    (await verifyUserRole(accessToken.value, 'ROLE_ADMIN'))
  ) {
    return NextResponse.redirect(
      new URL(
        `/user/login?redirect=${encodeURIComponent(request.url)}`,
        request.url
      )
    );
  }

  return NextResponse.next();
}
