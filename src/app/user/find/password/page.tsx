"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import Link from "next/link";
import { Mail } from "lucide-react";

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

const emailSchema = yup.object().shape({
  email: yup.string().email().required("이메일을 입력해주세요."),
});

export default function FindPassword() {
  const form = useForm<{
    email: string;
  }>({
    resolver: yupResolver(emailSchema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<{ email: string }> = async (data) => {
    if (form.formState.isSubmitting) return;
    await jxios
      .post("/mail/reset-password", undefined, { params: data })
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data as string);
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
          비밀번호 찾기
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          비밀번호 재설정 링크를 이메일로 보내드립니다
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  이메일
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    {...field}
                    className="h-12 rounded-lg border-gray-200 bg-gray-50 px-4 text-sm transition-colors placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:ring-1 focus:ring-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:placeholder:text-gray-600 dark:focus:border-white dark:focus:bg-black dark:focus:ring-white"
                  />
                </FormControl>
                <FormDescription className="text-xs text-gray-500 dark:text-gray-500">
                  가입 시 등록한 이메일 주소를 입력해주세요
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
              ? "전송 중..."
              : "비밀번호 재설정 링크 보내기"}
          </Button>
        </form>
      </Form>

      {/* Info Box */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
              이메일을 확인해주세요
            </h3>
            <p className="text-sm leading-relaxed text-blue-700 dark:text-blue-300">
              비밀번호 재설정 링크가 이메일로 전송됩니다. 링크는 24시간 동안
              유효합니다.
            </p>
          </div>
        </div>
      </div>

      {/* Back Link */}
      <div className="border-t border-gray-100 pt-6 text-center dark:border-gray-900">
        <Link
          href="/user/find"
          className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          이전으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
