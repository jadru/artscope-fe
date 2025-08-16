import { NextRequest, NextResponse } from "next/server";

import {
  decodedAccessTokenType,
  loginRequestType,
  loginResponseType,
} from "@/types/auth";
import { NEXT_PUBLIC_API_URL } from "@/constant/env";
import { jwtDecode } from "jwt-decode";

export async function POST(request: NextRequest) {
  try {
    const body: loginRequestType = await request.json();
    const { username, password } = body;

    // 입력 검증
    if (!username || !password) {
      return NextResponse.json(
        { message: "아이디와 비밀번호를 입력해주세요." },
        { status: 400 }
      );
    }

    // 백엔드 서버로 로그인 요청 전달
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {
          message: errorData.message || "로그인에 실패했습니다.",
          detail: errorData.detail || null,
        },
        { status: response.status }
      );
    }

    const tokenData: loginResponseType = await response.json();

    // 토큰 데이터 검증
    if (!tokenData.accessToken || !tokenData.refreshToken) {
      return NextResponse.json(
        { message: "토큰 정보가 올바르지 않습니다." },
        { status: 500 }
      );
    }

    // access-token과 refresh-token을 Set-Cookie 헤더로 설정하여 반환
    const accessTokenExpires = tokenData.expiresIn; // 초 단위
    const refreshTokenExpires = tokenData.refreshExpiresIn; // 초 단위

    // 쿠키 만료일 계산 (UTC 기준, 9시간 추가)
    const accessTokenExpireDate = new Date(
      Date.now() + accessTokenExpires * 1000 + 60 * 60 * 1000
    );
    const refreshTokenExpireDate = new Date(
      Date.now() + refreshTokenExpires * 1000 + 60 * 60 * 1000
    );

    const accessTokenCookie = `access-token=${tokenData.accessToken}; Path=/; HttpOnly; Secure; Expires=${accessTokenExpireDate.toUTCString()}; SameSite=Strict`;
    const refreshTokenCookie = `refresh-token=${tokenData.refreshToken}; Path=/; HttpOnly; Secure; Expires=${refreshTokenExpireDate.toUTCString()}; SameSite=Strict`;

    const headers = new Headers();
    headers.append("Set-Cookie", accessTokenCookie);
    headers.append("Set-Cookie", refreshTokenCookie);

    const decodedAccessToken: decodedAccessTokenType = jwtDecode(
      tokenData.accessToken
    );

    return NextResponse.json(
      { username: decodedAccessToken.sub },
      {
        status: 200,
        headers,
      }
    );
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
