"use client";

import { useDebounce } from "@toss/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CheckCircle2, XCircle, Loader2, User, AtSign } from "lucide-react";

import jxios from "@/utils/jxios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { profileApiResponseType } from "@/types/profile";
import { useProfile } from "@/auth/use-profile";

const fetchProfile = async (): Promise<profileApiResponseType> =>
  await jxios
    .get("/api/server/members/profile")
    .then((res) => res.data as profileApiResponseType);

export default function SettingsPage() {
  const { data: user } = useProfile();
  const [usernameEdit, setUsernameEdit] = useState<string>("");
  const [usernameVerify, setUsernameVerify] = useState<boolean | undefined>(
    undefined
  );
  const [nameEdit, setNameEdit] = useState<string>("");
  const [data, setData] = useState<profileApiResponseType>();
  const { push } = useRouter();
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchProfile().then((res) => setData(res));
  }, [user?.picture]);

  useEffect(() => {
    if (!data) return;
    setUsernameEdit(data.username);
    setNameEdit(data.name);
  }, [data]);

  const checkUsername = useDebounce(async () => {
    if (data?.username === usernameEdit || !usernameEdit) {
      setUsernameVerify(undefined);
      setIsCheckingUsername(false);
      return;
    }
    if (!usernameEdit.match(/^[a-z-_.]+[a-z0-9]{4,17}$/g)) {
      setUsernameVerify(false);
      setIsCheckingUsername(false);
      return;
    }
    setIsCheckingUsername(true);
    await jxios
      .get("/api/server/members/username/" + usernameEdit)
      .then((res) => {
        setUsernameVerify(true);
        setIsCheckingUsername(false);
      })
      .catch((err) => {
        setUsernameVerify(false);
        setIsCheckingUsername(false);
      });
  }, 500);

  const changeUsername = useDebounce(
    async () =>
      await jxios
        .put(`/members/${user?.username}/username`, {
          newUsername: usernameEdit,
          username: user?.username,
        })
        .then(() => {
          toast.success(
            "아이디가 변경되었습니다. 안전한 사용을 위해 로그아웃됩니다."
          );
          push("/user/signout");
        })
        .catch((err) => {
          toast.error(err.response.data);
        }),
    500
  );

  const changeName = useDebounce(
    async () =>
      await jxios
        .put("/members/" + data?.username, {
          name: nameEdit,
        })
        .then((res) => {
          toast.success("활동명이 변경되었습니다.");
          setData(res.data as profileApiResponseType);
        })
        .catch((err) => {
          toast.error(err.response.data);
        }),
    500
  );

  useEffect(() => {
    checkUsername();
  }, [checkUsername, usernameEdit]);

  if (!data) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Email (Read-only) */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          이메일
        </label>
        <Input
          disabled
          value={data.email}
          className="h-12 rounded-lg border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          이메일은 변경할 수 없습니다
        </p>
      </div>

      {/* Username */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          아이디
        </label>
        <div className="space-y-3">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <AtSign className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              value={usernameEdit}
              onChange={(e) => setUsernameEdit(e.target.value)}
              placeholder="아이디를 입력하세요"
              className={`h-12 rounded-lg pl-10 pr-10 transition-colors ${
                usernameVerify === undefined
                  ? "border-gray-200 focus:border-gray-900 dark:border-gray-800 dark:focus:border-gray-100"
                  : usernameVerify
                    ? "border-green-500 focus:border-green-600 dark:border-green-600 dark:focus:border-green-500"
                    : "border-red-500 focus:border-red-600 dark:border-red-600 dark:focus:border-red-500"
              }`}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
              {isCheckingUsername ? (
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              ) : usernameVerify === true ? (
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : usernameVerify === false ? (
                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              ) : null}
            </div>
          </div>
          {usernameVerify === false && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {!usernameEdit.match(/^[a-z-_.]+[a-z0-9]{4,17}$/g)
                ? "아이디는 영문 소문자와 숫자 (5 ~ 18자) 만 사용할 수 있습니다"
                : "이미 사용 중인 아이디입니다"}
            </p>
          )}
          {usernameVerify === true && (
            <p className="text-sm text-green-600 dark:text-green-400">
              사용 가능한 아이디입니다
            </p>
          )}
          <Button
            onClick={changeUsername}
            disabled={!usernameVerify}
            className="w-full rounded-full bg-gray-900 px-6 text-white hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:disabled:bg-gray-800 dark:disabled:text-gray-600"
          >
            아이디 변경
          </Button>
        </div>
      </div>

      {/* Name */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          활동명
        </label>
        <div className="space-y-3">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <User className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              value={nameEdit}
              onChange={(e) => setNameEdit(e.target.value)}
              placeholder="활동명을 입력하세요"
              className="h-12 rounded-lg border-gray-200 pl-10 transition-colors focus:border-gray-900 dark:border-gray-800 dark:focus:border-gray-100"
            />
          </div>
          <Button
            onClick={changeName}
            disabled={data.name === nameEdit}
            className="w-full rounded-full bg-gray-900 px-6 text-white hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:disabled:bg-gray-800 dark:disabled:text-gray-600"
          >
            활동명 변경
          </Button>
        </div>
      </div>
    </div>
  );
}
