"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

import jxios from "@/utils/jxios";

const EmailConfirm = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const { push } = useRouter();
  useEffect(() => {
    code &&
      jxios
        .get("/api/server/mail/authenticate", {
          params: {
            code,
          },
        })
        .then(() => {
          toast.success("이메일 인증이 완료되었습니다.");
          push("/user/login");
        });
  }, [code, push]);
  return <></>;
};

export default EmailConfirm;
