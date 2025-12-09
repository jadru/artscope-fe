"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useDebounce } from "@toss/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

import signupSchema, { SignupInputs } from "@/app/user/signup/signupSchema";
import jxios from "@/utils/jxios";

const SignupForm = () => {
  const form = useForm<SignupInputs>({
    resolver: yupResolver(signupSchema),
    mode: "onBlur",
  });
  const { push } = useRouter();
  const [emailRegexCheck, setEmailRegexCheck] = React.useState<boolean>(false);
  const [emailDuplicateCheck, setEmailDuplicateCheck] =
    React.useState<boolean>(false);
  const [usernameRegexCheck, setUsernameRegexCheck] =
    React.useState<boolean>(false);
  const [usernameDuplicateCheck, setUsernameDuplicateCheck] =
    React.useState<boolean>(false);

  const _onSubmit: SubmitHandler<SignupInputs> = async (data) => {
    if (form.formState.isSubmitting) return;
    if (!emailRegexCheck) {
      form.setError("email", {
        type: "manual",
        message: "이메일 형식을 확인해주세요.",
      });
    }
    if (!emailDuplicateCheck) {
      form.setError("email", {
        type: "manual",
        message: "이미 사용중인 이메일입니다.",
      });
    }
    if (!usernameRegexCheck) {
      form.setError("username", {
        type: "manual",
        message: "아이디는 영문, 숫자 4~12자리로 입력해주세요.",
      });
    }
    if (!usernameDuplicateCheck) {
      form.setError("username", {
        type: "manual",
        message: "이미 사용중인 아이디입니다.",
      });
    }
    if (
      !emailRegexCheck ||
      !emailDuplicateCheck ||
      !usernameRegexCheck ||
      !usernameDuplicateCheck
    )
      return;
    if (!form.formState.isSubmitting) {
      delete data.passwordCheck;
      delete data.agreeRegulation;
      form.clearErrors();
      await jxios.post("/api/server/members", data).then(async () => {
        await jxios
          .post("/api/server/mail/authenticate", undefined, {
            params: { email: data.email },
          })
          .then(async () => {
            push("/user/auth/verify" + "?email=" + data.email);
            toast.success(data.email + "로 보낸 이메일 인증을 완료해주세요.");
          });
      });
    }
  };

  const checkEmailDuplication = useDebounce(() => {
    setEmailDuplicateCheck(false);
    setEmailRegexCheck(false);
    const regex = new RegExp("[a-z0-9]+@[a-z]+\\.[a-z]{2,3}");
    if (regex.test(form.getValues("email"))) {
      setEmailRegexCheck(true);
      jxios
        .get("/api/server/members/email/" + form.getValues("email"))
        .then((response) => {
          if (response.status === 200) {
            setEmailDuplicateCheck(true);
            form.clearErrors("email");
          }
        })
        .catch(() => {
          form.setError("email", {
            type: "manual",
            message: "이미 사용중인 이메일입니다.",
          });
          setEmailDuplicateCheck(false);
        });
    } else {
      setEmailRegexCheck(false);
      form.setError("email", {
        type: "manual",
        message: "이메일 형식이 아닙니다.",
      });
    }
  }, 500);

  const checkUsernameDuplication = () => {
    setUsernameDuplicateCheck(false);
    setUsernameRegexCheck(false);
    const regex = new RegExp("^[a-zA-Z0-9]{4,12}$");
    if (regex.test(form.getValues("username"))) {
      setUsernameRegexCheck(true);
      jxios
        .get("/api/server/members/username/" + form.getValues("username"))
        .then((response) => {
          if (response.status === 200) {
            setUsernameDuplicateCheck(true);
            form.clearErrors("username");
          }
        })
        .catch(() => {
          form.setError("username", {
            type: "manual",
            message: "이미 사용중인 아이디입니다.",
          });
          setUsernameDuplicateCheck(false);
        });
    } else {
      setUsernameRegexCheck(false);
      form.setError("username", {
        type: "manual",
        message: "아이디는 영문, 숫자 4~12자리로 입력해주세요.",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(_onSubmit)}
        className="w-full space-y-6"
      >
        {/* Email Field */}
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
                  onChange={checkEmailDuplication}
                  className="h-12 rounded-lg border-gray-200 bg-gray-50 px-4 text-sm transition-colors placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:ring-1 focus:ring-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:placeholder:text-gray-600 dark:focus:border-white dark:focus:bg-black dark:focus:ring-white"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                활동명
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="아티스트 이름"
                  {...field}
                  className="h-12 rounded-lg border-gray-200 bg-gray-50 px-4 text-sm transition-colors placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:ring-1 focus:ring-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:placeholder:text-gray-600 dark:focus:border-white dark:focus:bg-black dark:focus:ring-white"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Username Field */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                아이디
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="영문, 숫자 4~12자리"
                  {...field}
                  onChange={checkUsernameDuplication}
                  className="h-12 rounded-lg border-gray-200 bg-gray-50 px-4 text-sm transition-colors placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:ring-1 focus:ring-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:placeholder:text-gray-600 dark:focus:border-white dark:focus:bg-black dark:focus:ring-white"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                비밀번호
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="8자리 이상"
                  {...field}
                  className="h-12 rounded-lg border-gray-200 bg-gray-50 px-4 text-sm transition-colors placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:ring-1 focus:ring-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:placeholder:text-gray-600 dark:focus:border-white dark:focus:bg-black dark:focus:ring-white"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Password Confirmation Field */}
        <FormField
          control={form.control}
          name="passwordCheck"
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
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Agreement Checkboxes */}
        <div className="space-y-3 border-t border-gray-100 pt-6 dark:border-gray-900">
          <FormField
            control={form.control}
            name="agreeRegulation"
            render={({ field }) => (
              <FormItem className="flex items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-0.5 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900 dark:data-[state=checked]:bg-white dark:data-[state=checked]:border-white"
                  />
                </FormControl>
                <div className="flex-1 space-y-1">
                  <FormLabel className="text-sm font-normal leading-relaxed text-gray-700 dark:text-gray-300">
                    이용약관 및 개인정보 처리방침 동의 (필수)
                  </FormLabel>
                  <FormDescription className="text-xs leading-relaxed text-gray-500 dark:text-gray-500">
                    <Link
                      className="underline hover:text-gray-700 dark:hover:text-gray-300"
                      href="https://plip.kr/pcc/1bdbcbd7-0bde-4101-8ce2-cc4e1fc53eef/consent/1.html"
                      target="_blank"
                    >
                      이용약관
                    </Link>
                    ,{" "}
                    <Link
                      className="underline hover:text-gray-700 dark:hover:text-gray-300"
                      href="https://plip.kr/pcc/1bdbcbd7-0bde-4101-8ce2-cc4e1fc53eef/consent/1.html"
                      target="_blank"
                    >
                      개인정보 수집과 이용
                    </Link>
                    ,{" "}
                    <Link
                      className="underline hover:text-gray-700 dark:hover:text-gray-300"
                      href="https://www.plip.kr/pcc/1bdbcbd7-0bde-4101-8ce2-cc4e1fc53eef/privacy-policy"
                      target="_blank"
                    >
                      처리방침
                    </Link>
                    에 동의합니다.
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agreeMarketing"
            render={({ field }) => (
              <FormItem className="flex items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-0.5 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900 dark:data-[state=checked]:bg-white dark:data-[state=checked]:border-white"
                  />
                </FormControl>
                <div className="flex-1 space-y-1">
                  <FormLabel className="text-sm font-normal leading-relaxed text-gray-700 dark:text-gray-300">
                    홍보성 메일 수신 동의 (선택)
                  </FormLabel>
                  <FormDescription className="text-xs leading-relaxed text-gray-500 dark:text-gray-500">
                    뉴스레터 및 이벤트 소식을 받아보실 수 있습니다.
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="h-12 w-full rounded-full bg-gray-900 text-sm font-medium text-white transition-all hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "회원가입 중..." : "회원가입"}
        </Button>
      </form>
    </Form>
  );
};

export default SignupForm;
