"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import { Lock, AlertCircle } from "lucide-react";

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
    <div className="flex flex-col items-stretch gap-8 py-8">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
          비밀번호 재설정
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          새로운 비밀번호를 설정해주세요
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  새 비밀번호
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="8자리 이상"
                    {...field}
                    className="h-12 rounded-lg border-gray-200 bg-gray-50 px-4 text-sm transition-colors placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:ring-1 focus:ring-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:placeholder:text-gray-600 dark:focus:border-white dark:focus:bg-black dark:focus:ring-white"
                  />
                </FormControl>
                <FormDescription className="text-xs text-gray-500 dark:text-gray-500">
                  8자 이상의 비밀번호를 입력해주세요
                </FormDescription>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Password Confirm Field */}
          <FormField
            control={form.control}
            name="passwordConfirm"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  비밀번호 확인
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="비밀번호 재입력"
                    {...field}
                    className="h-12 rounded-lg border-gray-200 bg-gray-50 px-4 text-sm transition-colors placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:ring-1 focus:ring-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:placeholder:text-gray-600 dark:focus:border-white dark:focus:bg-black dark:focus:ring-white"
                  />
                </FormControl>
                <FormDescription className="text-xs text-gray-500 dark:text-gray-500">
                  동일한 비밀번호를 다시 입력해주세요
                </FormDescription>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="h-12 w-full rounded-full bg-gray-900 text-sm font-medium text-white transition-all hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "처리 중..."
              : "비밀번호 재설정"}
          </Button>
        </form>
      </Form>

      {/* Warning Box */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900 dark:bg-amber-950">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-100">
              안전한 비밀번호를 사용하세요
            </h3>
            <p className="text-sm leading-relaxed text-amber-700 dark:text-amber-300">
              다른 사이트에서 사용하지 않는 고유한 비밀번호를 설정하세요.
              영문, 숫자, 특수문자를 조합하면 더욱 안전합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
