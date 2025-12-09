"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import { Mail, CheckCircle2 } from "lucide-react";

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

export default function FindUsername() {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const form = useForm<{
    email: string;
  }>({
    resolver: yupResolver(emailSchema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<{ email: string }> = async (data) => {
    if (form.formState.isSubmitting) return;
    await jxios
      .get("/api/server/mail/find-username", { params: data })
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data as string);
          setIsSuccess(true);
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
          아이디 찾기
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          가입하신 이메일로 아이디를 찾아드립니다
        </p>
      </div>

      {!isSuccess ? (
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
              {form.formState.isSubmitting ? "전송 중..." : "아이디 찾기"}
            </Button>
          </form>
        </Form>
      ) : (
        <div className="space-y-6">
          {/* Success Message */}
          <div className="rounded-2xl border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="text-sm font-semibold text-green-900 dark:text-green-100">
                  이메일이 전송되었습니다
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  입력하신 이메일로 아이디 정보를 보내드렸습니다.
                  <br />
                  이메일을 확인해주세요.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href="/user/login" className="block">
              <Button className="h-12 w-full rounded-full bg-gray-900 text-sm font-medium text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100">
                로그인하러 가기
              </Button>
            </Link>

            <Link href="/user/find/password" className="block">
              <Button
                variant="outline"
                className="h-12 w-full rounded-full border-gray-300 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
              >
                비밀번호 찾기
              </Button>
            </Link>
          </div>
        </div>
      )}

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
