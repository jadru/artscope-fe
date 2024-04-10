'use client';

import NotiEmailSetting from '@/app/editor/(dashboard)/settings/notification/noti-setting';
import { useUser } from '@/states';

export default function ArtistSettings() {
  const { user } = useUser();

  return (
    <>
      {user && (
        <>
          <NotiEmailSetting
            username={user.username}
            emailReceive={user.allowEmailReceive}
          />
        </>
      )}
    </>
  );
}
