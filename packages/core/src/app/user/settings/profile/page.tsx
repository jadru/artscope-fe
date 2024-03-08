'use client';

import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { BiSolidEdit } from 'react-icons/bi';
import { toast } from 'react-toastify';

import ASNextImage from '@/components/ASNextImage';

import ArtistForm from '@/app/user/apply/ArtistForm';
import CuratorForm from '@/app/user/apply/CuratorForm';
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
  const { push } = useRouter();

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
      toast.success('프로필 사진이 변경되었습니다.');
    }
  };

  return data ? (
    <>
      <div className='flex flex-col items-center justify-between'>
        <button
          onClick={() => inputRef?.current?.click()}
          className='group relative my-2'>
          {data.picture ? (
            <ASNextImage
              src={data.picture}
              alt='프로필 사진'
              width={150}
              height={150}
              className='h-48 w-48 rounded-full object-cover'
            />
          ) : (
            <div className='bg-default-200 h-48 w-48 rounded-full object-cover'></div>
          )}
          <div className='absolute top-0 flex h-48 w-48 items-center justify-center rounded-full bg-black text-white opacity-0 transition group-hover:opacity-50'>
            프로필 사진 변경
          </div>
          <div className='absolute bottom-2 right-2 text-2xl text-white bg-blue-500 rounded-3xl p-2'>
            <BiSolidEdit size={21} />
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
      {user?.roleStatus === 'NONE' ? (
        <Button color='primary' onClick={() => push('/user/apply')} fullWidth>
          아티스트 / 기획자 추가 정보 기입
        </Button>
      ) : user?.roleStatus.startsWith('CURATOR') ? (
        <CuratorForm
          isEdit={{
            introduction: data.introduction,
            history: data.history,
            snsUrl: data.snsUrl,
            websiteUrl: data.websiteUrl,
            companyName: data.companyName,
            companyRole: data.companyRole,
          }}
        />
      ) : (
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
