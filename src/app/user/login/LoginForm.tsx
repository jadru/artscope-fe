import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { loginInputs, loginSchema } from "@/app/user/login/loginSchema";

import { loginResponseType } from "@/types/auth";
import { useProfile } from "@/auth/use-profile";

export default function LoginForm({ redirect }: { redirect: string | null }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<loginInputs>({
    resolver: yupResolver(loginSchema),
  });
  const { refetch } = useProfile();
  const router = useRouter();

  const onSubmit: SubmitHandler<loginInputs> = async (loginData) =>
    !isSubmitting &&
    fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(loginData),
    }).then(async (res) => {
      const data: { username: string } = await res.json();
      if (res.status === 200 && data.username) {
        refetch();
        if (redirect) {
          router.replace(decodeURIComponent(redirect));
          router.refresh();
        } else {
          router.replace("/");
          router.refresh();
        }
      } else {
        toast.error("로그인에 실패했습니다.");
      }
    });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
      <div className="space-y-3">
        <div className="space-y-1.5">
          <label htmlFor="login-username" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
            아이디
          </label>
          <Input
            id="login-username"
            type="text"
            placeholder="아이디"
            autoComplete="username"
            formNoValidate={!!errors.username}
            aria-invalid={!!errors.username}
            aria-describedby={errors.username ? "login-username-error" : undefined}
            {...register("username")}
            className="h-12 rounded-lg border-gray-200 bg-gray-50 px-4 text-sm transition-colors placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:placeholder:text-gray-600 dark:focus:border-white dark:focus:bg-black dark:focus:ring-white"
          />
          {errors.username && (
            <p id="login-username-error" className="text-xs text-red-600 dark:text-red-400">
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="login-password" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
            비밀번호
          </label>
          <Input
            id="login-password"
            placeholder="비밀번호"
            type="password"
            autoComplete="current-password"
            formNoValidate={!!errors.password}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "login-password-error" : undefined}
            {...register("password")}
            className="h-12 rounded-lg border-gray-200 bg-gray-50 px-4 text-sm transition-colors placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:placeholder:text-gray-600 dark:focus:border-white dark:focus:bg-black dark:focus:ring-white"
          />
          {errors.password && (
            <p id="login-password-error" className="text-xs text-red-600 dark:text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="h-12 w-full rounded-full bg-gray-900 text-sm font-medium text-white transition-all hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        disabled={isSubmitting}
      >
        {isSubmitting ? "로그인 중..." : "로그인"}
      </Button>
    </form>
  );
}
