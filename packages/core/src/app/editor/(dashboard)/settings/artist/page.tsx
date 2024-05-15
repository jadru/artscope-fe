'use client';

import InfoSetting from '@/app/editor/(dashboard)/settings/artist/info-setting';
import { useUser } from '@/states';
import ProfileImageSettings from '@/app/editor/(dashboard)/settings/artist/profile-image';
import { NEXT_PUBLIC_MEDIA_STORAGE_URL } from '@/constant/env';
import { toast } from 'react-toastify';
import jxios from '@/utils/jxios';
import { useRouter } from 'next/navigation';

export default function ArtistSettings() {
  const { user } = useUser();
  const router = useRouter();

  const newImageUpload = async (file: File) => {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: JSON.stringify({
        contentType: file.type,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      const formData = new FormData();
      Object.entries(data.fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append('file', file);
      const responseUpload = await fetch(data.url, {
        method: 'POST',
        body: formData,
      });
      if (responseUpload.ok) {
        return NEXT_PUBLIC_MEDIA_STORAGE_URL + '/' + data.fields.key;
      }
    }
  };

  const handleUpload = (file: File) => {
    newImageUpload(file).then((url) => {
      if (url && user) {
        jxios
          .put('/api/members/' + user.username + '/picture', { profile: url })
          .then((res) => {
            if (res.status === 200 || res.status === 201) {
              toast.success('프로필 이미지가 변경되었습니다.');
              router.refresh();
            } else {
              toast.error('프로필 이미지 변경에 문제가 있습니다.');
            }
          });
      }
    });
  };

  return (
    <>
      {user && (
        <>
          <ProfileImageSettings
            profileImageUrl={user.picture || 'prod/images/default.jpg'}
            altText={user.name + '님의 프로필 이미지'}
            onUpload={handleUpload}
          />
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
