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

    // access token이 없고 refresh token이 있으면 갱신 시도
    if (!accessToken && (await cookies()).get("refresh-token")?.value) {
      const tokenData = await refreshAccessToken();
      if (tokenData && tokenData.accessToken) {
        accessToken = tokenData.accessToken;
        // 새로운 토큰들을 쿠키에 저장
        await setAccessToken(tokenData.accessToken, tokenData.expiresIn);
        await setRefreshToken(tokenData.refreshToken, tokenData.refreshExpiresIn);
      }
    }

    // access token이 없어도 비인증 요청은 그대로 백엔드로 전달

    // 프록시 요청 헤더 구성
    const proxyHeaders = new Headers();

    // 원본 요청의 모든 헤더 복사
    request.headers.forEach((value, key) => {
      if (key.toLowerCase() !== "host" && key.toLowerCase() !== "origin") {
        proxyHeaders.set(key, value);
      }
    });

    // Authorization 헤더는 토큰이 있을 때만 추가
    if (accessToken) {
      proxyHeaders.set("Authorization", `Bearer ${accessToken}`);
    }

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

    // 배포 환경에서 SSL 인증서 검증 우회
    const fetchOptions: RequestInit = {
      method,
      headers: proxyHeaders,
      body,
    };

    // SSL 검증 우회가 필요한 경우 (환경 변수로 제어)
    if (process.env.NEXT_PUBLIC_SKIP_SSL_VERIFICATION === "true") {
      // Node.js 환경에서만 사용 가능한 옵션
      if (typeof process !== "undefined" && typeof require !== "undefined") {
        try {
          const https = require("https");
          (fetchOptions as any).agent = new https.Agent({
            rejectUnauthorized: false,
          });
        } catch (error) {
          console.warn("HTTPS agent 설정 실패:", error);
        }
      }
    }

    let proxyResponse = await fetch(targetUrl, fetchOptions);

    // 만료 등으로 401이면 한 번만 토큰 갱신 후 재시도
    if (
      proxyResponse.status === 401 &&
      (await cookies()).get("refresh-token")?.value
    ) {
      const tokenData = await refreshAccessToken();
      if (tokenData && tokenData.accessToken) {
        await setAccessToken(tokenData.accessToken, tokenData.expiresIn);
        await setRefreshToken(
          tokenData.refreshToken,
          tokenData.refreshExpiresIn
        );

        const retryHeaders = new Headers(proxyHeaders);
        retryHeaders.set("Authorization", `Bearer ${tokenData.accessToken}`);
        proxyResponse = await fetch(targetUrl, {
          ...fetchOptions,
          headers: retryHeaders,
        });
      }
    }

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

    // SSL 인증서 오류인 경우 특별한 메시지 제공
    if (error instanceof Error && error.message.includes("certificate")) {
      return NextResponse.json(
        {
          error: "SSL Certificate Error",
          message:
            "SSL 인증서 오류가 발생했습니다. 서버 관리자에게 문의하세요.",
          details:
            process.env.NODE_ENV === "development" ? error.message : undefined,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "서버 내부 오류가 발생했습니다.",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
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
