"use client";

import PasswordSetting from "@/app/editor/(dashboard)/settings/(default)/password-setting";
import UserNameSetting from "@/app/editor/(dashboard)/settings/(default)/username-setting";
import { useProfile } from "@/auth/use-profile";

export default function EditorSettingDefault() {
  const { data: user } = useProfile();

  return (
    <>
      {user && (
        <>
          <UserNameSetting username={user.username} />
          <PasswordSetting username={user.username} />
        </>
      )}
    </>
  );
}
