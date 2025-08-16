import { NextRequest, NextResponse } from "next/server";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "@/auth/cookieTokenManager";
import { NEXT_PUBLIC_API_URL } from "@/constant/env";
import { loginResponseType } from "@/types/auth";
import { cookies } from "next/headers";

// 토큰 갱신 함수
async function refreshAccessToken(): Promise<loginResponseType | null> {
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return null;

    const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: refreshToken as string,
    });

    if (response.ok) {
      const data: loginResponseType = await response.json();
      return data;
    }
  } catch (error) {
    console.error("토큰 갱신 실패:", error);
  }
  return null;
}

// 요청 헤더에서 토큰 추출
function extractTokenFromHeaders(headers: Headers): string | null {
  const authHeader = headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  return null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleProxyRequest(request, "GET", path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleProxyRequest(request, "POST", path);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleProxyRequest(request, "PUT", path);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleProxyRequest(request, "PATCH", path);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleProxyRequest(request, "DELETE", path);
}

async function handleProxyRequest(
  request: NextRequest,
  method: string,
  pathSegments: string[]
) {
  try {
    const url = new URL(request.url);
    const pathname = `/api/${pathSegments.join("/")}`;
    // 쿠키에서 access token 가져오기
    let accessToken = (await getAccessToken()) as string | null;

    // 요청 헤더에서 토큰이 있는지 확인
    const headerToken = extractTokenFromHeaders(request.headers);
    if (headerToken) {
      accessToken = headerToken;
    }

    // 토큰이 없으면 갱신 시도
    if (!accessToken && !(await cookies()).get("refresh-token")?.value) {
      const tokenData = await refreshAccessToken();
      if (tokenData && tokenData.accessToken) {
        accessToken = tokenData.accessToken;
        // 새로운 토큰들을 쿠키에 저장
        setAccessToken(tokenData.accessToken, tokenData.expiresIn);
        setRefreshToken(tokenData.refreshToken, tokenData.refreshExpiresIn);
      }
    }
    // 프록시 요청 헤더 구성
    const proxyHeaders = new Headers();

    // 원본 요청의 모든 헤더 복사
    request.headers.forEach((value, key) => {
      if (key.toLowerCase() !== "host" && key.toLowerCase() !== "origin") {
        proxyHeaders.set(key, value);
      }
    });

    // Authorization 헤더 추가
    proxyHeaders.set("Authorization", `Bearer ${accessToken}`);

    // Content-Type이 없는 경우 기본값 설정
    if (!proxyHeaders.has("Content-Type")) {
      proxyHeaders.set("Content-Type", "application/json");
    }

    // 요청 본문 처리
    let body: string | null = null;
    if (method !== "GET" && method !== "HEAD") {
      try {
        body = await request.text();
      } catch (error) {
        console.error("요청 본문 읽기 실패:", error);
      }
    }

    // 실제 API 서버로 요청 전송
    const targetUrl = `${NEXT_PUBLIC_API_URL}${pathname}${url.search}`;

    const proxyResponse = await fetch(targetUrl, {
      method,
      headers: proxyHeaders,
      body,
    });

    // 응답 헤더 구성
    const responseHeaders = new Headers();
    proxyResponse.headers.forEach((value, key) => {
      if (key.toLowerCase() !== "content-encoding") {
        responseHeaders.set(key, value);
      }
    });

    // CORS 헤더 추가
    responseHeaders.set("Access-Control-Allow-Origin", "*");
    responseHeaders.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    responseHeaders.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    // 응답 본문 읽기
    const responseBody = await proxyResponse.text();

    // 응답 반환
    return new NextResponse(responseBody, {
      status: proxyResponse.status,
      statusText: proxyResponse.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("프록시 요청 처리 중 오류:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "서버 내부 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

// OPTIONS 요청 처리 (CORS preflight)
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}
