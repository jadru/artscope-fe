"use client";

import InfoSetting from "@/app/editor/(dashboard)/settings/artist/info-setting";
import { useProfile } from "@/auth/use-profile";

export default function ArtistSettings() {
  const { data: user } = useProfile();

  return (
    <>
      {user && (
        <>
          <InfoSetting
            username={user.username}
            profile={{
              name: user.name,
              snsUrl: user.snsUrl,
              websiteUrl: user.websiteUrl,
              introduction: user.introduction,
              history: user.history,
            }}
          />
        </>
      )}
    </>
  );
}
