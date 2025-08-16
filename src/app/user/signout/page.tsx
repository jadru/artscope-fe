"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

import {
  removeAccessToken,
  removeRefreshToken,
} from "@/auth/cookieTokenManager";
import { invalidateProfile, useProfile } from "@/auth/use-profile";
import jxios from "@/utils/jxios";

const SignoutPage = () => {
  const { push, refresh } = useRouter();
  const { data: user } = useProfile();
  useEffect(() => {
    jxios.post("/api/server/logout");
    removeAccessToken();
    removeRefreshToken();
    invalidateProfile();
    toast.success("로그아웃 되었습니다.");
    refresh();
    push("/");
  }, [user, refresh, push]);
  return <></>;
};

export default SignoutPage;
