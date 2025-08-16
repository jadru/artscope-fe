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
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="이메일 입력"
                {...field}
                onChange={checkEmailDuplication}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="text" placeholder="활동명 입력" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="아이디 입력"
                {...field}
                onChange={checkUsernameDuplication}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password" placeholder="비밀번호 입력" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="passwordCheck"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password" placeholder="비밀번호 확인" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex flex-col items-stretch space-y-2">
        <FormField
          control={form.control}
          name="agreeRegulation"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>이용약관 및 개인정보 처리방침 동의</FormLabel>
                <FormDescription>
                  <span className="text-gray-500">
                    <Link
                      className="font-bold"
                      href="https://plip.kr/pcc/1bdbcbd7-0bde-4101-8ce2-cc4e1fc53eef/consent/1.html"
                      target="_blank"
                    >
                      이용 약관
                    </Link>
                    , 개인정보{" "}
                    <Link
                      className="font-bold"
                      href="https://plip.kr/pcc/1bdbcbd7-0bde-4101-8ce2-cc4e1fc53eef/consent/1.html"
                      target="_blank"
                    >
                      수집과 이용
                    </Link>
                    {", "}
                    <Link
                      className="font-bold"
                      href="https://www.plip.kr/pcc/1bdbcbd7-0bde-4101-8ce2-cc4e1fc53eef/privacy-policy"
                      target="_blank"
                    >
                      처리방침
                    </Link>
                    에 동의합니다.
                  </span>
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
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>홍보성 메일 수신에 관한 동의</FormLabel>
                <FormDescription>
                  뉴스레터 등 유용한 정보 알림 메일을 받겠습니다.
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <Button
        type="submit"
        color="primary"
        disabled={form.formState.isSubmitting}
      >
        회원가입
      </Button>
    </Form>
  );
};

export default SignupForm;
