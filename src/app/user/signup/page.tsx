"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Title from "@/components/Title";

import SignupForm from "@/app/user/signup/SignupForm";
import { useProfile } from "@/auth/use-profile";

const SignupPage = () => {
  const router = useRouter();
  const { data: user } = useProfile();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [router, user]);

  return (
    <>
      <Title
        title="회원가입"
        description="회원가입을 하시면 Artscope의 모든 서비스를 무료로 이용하실 수 있습니다."
      />
      <SignupForm />
    </>
  );
};

export default SignupPage;
