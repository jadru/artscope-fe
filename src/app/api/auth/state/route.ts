import { NextResponse } from "next/server";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "@/auth/cookieTokenManager";
import { NEXT_PUBLIC_API_URL } from "@/constant/env";
import { loginResponseType } from "@/types/auth";

async function refreshAccessToken(): Promise<loginResponseType | null> {
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return null;

    const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/refresh`, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: refreshToken as string,
    });

    if (response.ok) {
      const data: loginResponseType = await response.json();
      return data;
    }
  } catch (error) {
    // ignore
  }
  return null;
}

export async function GET() {
  // access 토큰이 있으면 로그인 상태
  const access = await getAccessToken();
  if (access) {
    return NextResponse.json({ authenticated: true });
  }

  // 없으면 refresh로 갱신 시도
  const refresh = await getRefreshToken();
  if (!refresh) {
    return NextResponse.json({ authenticated: false });
  }

  const tokenData = await refreshAccessToken();
  if (tokenData && tokenData.accessToken) {
    await setAccessToken(tokenData.accessToken, tokenData.expiresIn);
    await setRefreshToken(tokenData.refreshToken, tokenData.refreshExpiresIn);
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false });
}
