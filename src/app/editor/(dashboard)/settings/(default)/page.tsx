'use client';

import PasswordSetting from '@/app/editor/(dashboard)/settings/(default)/password-setting';
import UserNameSetting from '@/app/editor/(dashboard)/settings/(default)/username-setting';
import { useUser } from '@/states';

export default function EditorSettingDefault() {
  const { user } = useUser();

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
