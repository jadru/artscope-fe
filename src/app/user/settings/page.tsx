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
      <div className='flex flex-col items-center justify-between'>
        <button
          onClick={() => inputRef?.current?.click()}
          className='group relative'
        >
          {data.picture ? (
            <ASNextImage
              src={data.picture}
              alt='프로필 사진'
              width={150}
              height={150}
              className='h-48 w-48 rounded-full object-cover'
            />
          ) : (
            <div className='h-48 w-48 rounded-full bg-default-200 object-cover'></div>
          )}
          <div className='absolute top-0 flex h-48 w-48 items-center justify-center rounded-full bg-black text-white opacity-0 transition group-hover:opacity-50'>
            프로필 사진 변경
          </div>
        </button>
        <input
          type='file'
          className='hidden'
          ref={inputRef}
          accept='image/jpg, image/png, image/jpeg, image/gif'
          onChange={handleProfileImageUpload}
        />
      </div>
      <div className='flex justify-stretch gap-1'>
        <Input disabled value={data.username} />
        <Button color='primary'>아이디 변경</Button>
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
      {user?.artistStatus !== 'NONE' && (
        <ArtistForm
          isEdit={{
            introduction: data.introduction,
            history: data.history,
            snsUrl: data.snsUrl,
            websiteUrl: data.websiteUrl,
          }}
        />
      )}
    </>
  ) : (
    '로딩 중...'
  );
}
