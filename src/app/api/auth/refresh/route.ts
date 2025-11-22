import { NextRequest, NextResponse } from "next/server";

import {
  setAccessToken,
  setRefreshToken,
} from "@/auth/cookieTokenManager";
import { NEXT_PUBLIC_API_URL } from "@/constant/env";
import { loginResponseType } from "@/types/auth";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = (await request.text()).trim();

    if (!refreshToken) {
      return NextResponse.json(
        { message: "refresh token is missing" },
        { status: 400 }
      );
    }

    const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/refresh`, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: refreshToken,
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "failed to refresh token" },
        { status: response.status }
      );
    }

    const tokenData: loginResponseType = await response.json();

    if (!tokenData.accessToken || !tokenData.refreshToken) {
      return NextResponse.json(
        { message: "invalid refresh response" },
        { status: 500 }
      );
    }

    await setAccessToken(tokenData.accessToken, tokenData.expiresIn);
    await setRefreshToken(tokenData.refreshToken, tokenData.refreshExpiresIn);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("OAuth refresh failed:", error);
    return NextResponse.json(
      { message: "unexpected error during refresh" },
      { status: 500 }
    );
  }
}
