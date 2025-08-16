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
    expires: new Date(
      Date.now() + refreshExpiresIn * 1000 + 9 * 60 * 60 * 1000
    ),
  });

export const getAccessToken = async () =>
  (await cookies()).get("access-token")?.value;

export const getRefreshToken = async () =>
  (await cookies()).get("refresh-token")?.value;

export const removeAccessToken = async () =>
  (await cookies()).delete("access-token");

export const removeRefreshToken = async () =>
  (await cookies()).delete("refresh-token");
