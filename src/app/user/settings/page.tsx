'use client';

import { Button, Input } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';

import ASNextImage from '@/components/ASNextImage';
import Title from '@/components/Title';

import ArtistForm from '@/app/user/apply/ArtistForm';
import { useUser } from '@/states';
import jxios from '@/utils/jxios';

import { profileApiResponseType } from '@/types/profile';

const fetchProfile = async (): Promise<profileApiResponseType> =>
  await jxios
    .get('/api/members/profile')
    .then((res) => res.data as profileApiResponseType);

export default function SettingsPage() {
  const { user, isLogin } = useUser();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [data, setData] = useState<profileApiResponseType>();

  useEffect(() => {
    if (!isLogin) return;
    fetchProfile().then((res) => setData(res));
  }, [isLogin, user?.picture]);

  const handleProfileImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('profile', file);
    const res = await jxios.put(
      '/api/members/' + data?.username + '/picture',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          accept: '*/*',
        },
      }
    );
    if (res.status === 200) {
      const profile = res.data as profileApiResponseType;
      setData(profile);
    }
  };

  return data ? (
    <>
      <Title>회원 정보 설정</Title>
      <div className='flex justify-stretch gap-1'>
        <Input disabled value={data.username} />
        <Button color='primary'>아이디 변경</Button>
      </div>
      <div className='flex items-center justify-between'>
        {data.picture && (
          <ASNextImage
            src={data.picture}
            alt='프로필 사진'
            width={100}
            height={100}
          />
        )}
        <Button fullWidth onClick={() => inputRef?.current?.click()}>
          프로필 사진 업로드
        </Button>
        <input
          type='file'
          className='hidden'
          ref={inputRef}
          accept='image/jpg, image/png, image/jpeg, image/gif'
          onChange={handleProfileImageUpload}
        />
      </div>
      <hr />
      <div className='flex justify-stretch gap-1'>
        <Input disabled value={data.email} />
        <Button>이메일 변경</Button>
      </div>
      <div className='flex justify-stretch gap-1'>
        <Input disabled value={data.name} />
        <Button>활동명 변경</Button>
      </div>
      <hr />
      <ArtistForm
        isEdit={{
          introduction: data.introduction,
          history: data.history,
          snsUrl: data.snsUrl,
          websiteUrl: data.websiteUrl,
        }}
      />
    </>
  ) : (
    '로딩 중...'
  );
}
