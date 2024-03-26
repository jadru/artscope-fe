import { jwtDecode } from 'jwt-decode';
import { NextRequest, NextResponse } from 'next/server';

import { NEXT_PUBLIC_ROOT_URL } from '@/constant/env';

import { roleType } from '@/types/auth';

const verifyUserRole = async (role: roleType, accessToken?: string) => {
  if (!accessToken) return false;
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

  const redirectUrl = new URL(
    `/user/login?redirect=${encodeURIComponent(
      request.url
        .toString()
        .replace(/(http|https):\/\/localhost:3000/g, NEXT_PUBLIC_ROOT_URL || '')
    )}`,
    request.nextUrl.origin
  );

  if (!accessToken || !accessToken.value) {
    return NextResponse.redirect(redirectUrl);
  }

  // 역할별 경로 접근 권한 설정
  const roleAccessMap: {
    [path: string]: roleType;
  } = {
    '/editor': 'ROLE_ARTIST',
    '/admin': 'ROLE_ADMIN',
  };

  for (const [path, role] of Object.entries(roleAccessMap)) {
    if (request.nextUrl.pathname.startsWith(path)) {
      if (await verifyUserRole(role, accessToken.value))
        return NextResponse.next();
    }
  }

  return NextResponse.next();
}
