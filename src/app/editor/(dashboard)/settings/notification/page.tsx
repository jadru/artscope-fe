"use client";

import NotiEmailSetting from "@/app/editor/(dashboard)/settings/notification/noti-setting";
import { useProfile } from "@/auth/use-profile";

export default function ArtistSettings() {
  const { data: user } = useProfile();

  return (
    <>
      {user && (
        <>
          <NotiEmailSetting
            username={user.username}
            emailReceive={user.allowEmailReceive}
            emailReceiveUpdatedAt={user.allowEmailReceiveDateTime}
          />
        </>
      )}
    </>
  );
}
