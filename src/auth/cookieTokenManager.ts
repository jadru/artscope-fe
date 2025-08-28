"use server";

import { cookies } from "next/headers";

export const setAccessToken = async (accessToken: string, expiresIn: number) =>
  (await cookies()).set("access-token", accessToken, {
    path: "/",
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + expiresIn * 1000 + 9 * 60 * 60 * 1000),
  });

export const setRefreshToken = async (
  refreshToken: string,
  refreshExpiresIn: number
) =>
  (await cookies()).set("refresh-token", refreshToken, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    expires: new Date(
      Date.now() + refreshExpiresIn * 1000 + 9 * 60 * 60 * 1000
    ),
  });

// 클라이언트에서 로그인 여부만 판별하기 위한 비민감 플래그 쿠키
// Deprecated: auth-state 플래그는 더 이상 사용하지 않습니다.
export const setAuthStateFlag = async (_refreshExpiresIn: number) => {};

export const getAccessToken = async () =>
  (await cookies()).get("access-token")?.value;

export const getRefreshToken = async () =>
  (await cookies()).get("refresh-token")?.value;

export const removeAccessToken = async () =>
  (await cookies()).delete("access-token");

export const removeRefreshToken = async () =>
  (await cookies()).delete("refresh-token");

// Deprecated: auth-state 플래그는 더 이상 사용하지 않습니다.
export const removeAuthStateFlag = async () => {};
