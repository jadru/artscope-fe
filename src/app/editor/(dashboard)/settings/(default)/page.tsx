"use client";

import PasswordSetting from "@/app/editor/(dashboard)/settings/(default)/password-setting";
import UserNameSetting from "@/app/editor/(dashboard)/settings/(default)/username-setting";
import { useProfile } from "@/auth/use-profile";

export default function EditorSettingDefault() {
  const { data: user } = useProfile();

  return (
    <div className="space-y-6">
      {user && (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            <UserNameSetting username={user.username} />
            <PasswordSetting username={user.username} />
          </div>
        </>
      )}
    </div>
  );
}
