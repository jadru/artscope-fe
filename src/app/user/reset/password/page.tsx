"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";

import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import jxios from "@/utils/jxios";

const passwordSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, "비밀번호는 8자 이상입니다.")
    .required("비밀번호를 입력해주세요."),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password")], "비밀번호가 일치하지 않습니다.")
    .required("비밀번호를 입력해주세요."),
});

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const { push } = useRouter();
  const form = useForm<{
    password: string;
    passwordConfirm: string;
  }>({
    resolver: yupResolver(passwordSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (!code) {
      toast.warn("잘못된 접근입니다.");
      push("/user/login");
    }
  }, [code, push]);

  const onSubmit: SubmitHandler<{
    password: string;
    passwordConfirm: string;
  }> = async (data) => {
    if (form.formState.isSubmitting) return;
    jxios
      .post("/members/reset-password", data.password, {
        params: {
          code,
        },
        headers: {
          "Content-Type": "text/plain",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success(
            (res.data as string) + " 해당 비밀번호로 로그인이 가능합니다."
          );
          push("/user/login");
        }
      })
      .catch((err) => {
        toast.error(err.response.data as string);
      });
  };

  return (
    <div onSubmit={form.handleSubmit(onSubmit)}>
      <Title
        title="비밀번호 찾기"
        description="가입하신 이메일로 비밀번호 재설정 링크를 보내드립니다."
      />

      <Form {...form}>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="비밀번호 입력" {...field} />
              </FormControl>
              <FormDescription>새로운 비밀번호를 입력해주세요.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="확인 비밀번호 입력"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                새로운 비밀번호를 다시 입력해주세요.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          color="primary"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          비밀번호 재설정
        </Button>
      </Form>
    </div>
  );
}
