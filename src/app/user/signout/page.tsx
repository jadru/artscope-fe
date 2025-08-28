"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

import {
  removeAccessToken,
  removeRefreshToken,
  removeAuthStateFlag,
} from "@/auth/cookieTokenManager";
import { useProfile } from "@/auth/use-profile";
import jxios from "@/utils/jxios";

const SignoutPage = () => {
  const { push, refresh } = useRouter();
  const { data: user } = useProfile();
  useEffect(() => {
    jxios.post("/api/server/logout");
    removeAccessToken();
    removeRefreshToken();
    removeAuthStateFlag();
    toast.success("로그아웃 되었습니다.");
    refresh();
    push("/");
  }, [user, refresh, push]);
  return <></>;
};

export default SignoutPage;
