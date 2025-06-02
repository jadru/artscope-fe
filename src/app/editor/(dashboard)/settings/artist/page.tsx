'use client';

import InfoSetting from '@/app/editor/(dashboard)/settings/artist/info-setting';
import { useUser } from '@/states';

export default function ArtistSettings() {
  const { user } = useUser();

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
