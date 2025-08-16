"use client";

import { useDebounce } from "@toss/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import jxios from "@/utils/jxios";

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
      return;
    }
    if (!usernameEdit.match(/^[a-z-_.]+[a-z0-9]{4,17}$/g)) {
      toast.error(
        "아이디는 영문 소문자와 숫자 (5 ~ 18자) 만 사용할 수 있습니다."
      );
      setUsernameVerify(false);
      return;
    }
    await jxios
      .get("/api/server/members/username/" + usernameEdit)
      .then((res) => {
        setUsernameVerify(true);
        toast.success(res.data as string);
      })
      .catch((err) => {
        setUsernameVerify(false);
        toast.error(err.response.data);
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

  return (
    data && (
      <>
        {/* <div className='flex justify-stretch gap-1'> */}
        {/*   <Input disabled value={data.email} label='이메일' variant='flat' /> */}
        {/* </div> */}
        {/* <hr /> */}
        {/* <div className='flex justify-stretch gap-1 p-3 rounded-2xl border-2 border-black items-stretch'> */}
        {/*   <Input */}
        {/*     label='아이디' */}
        {/*     variant='underlined' */}
        {/*     value={usernameEdit} */}
        {/*     color={ */}
        {/*       usernameVerify === undefined */}
        {/*         ? 'primary' */}
        {/*         : usernameVerify */}
        {/*         ? 'success' */}
        {/*         : 'danger' */}
        {/*     } */}
        {/*     errorMessage={ */}
        {/*       usernameVerify === false && '아이디를 사용할 수 없습니다.' */}
        {/*     } */}
        {/*     onValueChange={setUsernameEdit} */}
        {/*   /> */}
        {/*   <Button */}
        {/*     className='h-full' */}
        {/*     color={usernameVerify ? 'primary' : 'default'} */}
        {/*     disabled={!usernameVerify} */}
        {/*     onClick={changeUsername}> */}
        {/*     아이디 변경 */}
        {/*   </Button> */}
        {/* </div> */}
        {/* <div className='flex justify-stretch gap-1 p-3 rounded-2xl border-2 border-black items-stretch'> */}
        {/*   <Input */}
        {/*     label='활동명' */}
        {/*     value={nameEdit} */}
        {/*     color={data.name === nameEdit ? 'primary' : 'success'} */}
        {/*     onValueChange={setNameEdit} */}
        {/*     variant='underlined' */}
        {/*   /> */}
        {/*   <Button */}
        {/*     color={data.name === nameEdit ? 'default' : 'primary'} */}
        {/*     disabled={data.name === nameEdit} */}
        {/*     className='h-full' */}
        {/*     onClick={changeName}> */}
        {/*     활동명 변경 */}
        {/*   </Button> */}
        {/* </div> */}
      </>
    )
  );
}
