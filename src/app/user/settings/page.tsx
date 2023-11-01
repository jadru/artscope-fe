'use client';

import { Button, Input } from '@nextui-org/react';
import { useDebounce } from '@toss/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import ASNextImage from '@/components/ASNextImage';
import Title from '@/components/Title';

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
  const [usernameEdit, setUsernameEdit] = useState<string>('');
  const [usernameVerify, setUsernameVerify] = useState<boolean | undefined>(
    undefined
  );
  const [nameEdit, setNameEdit] = useState<string>('');
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

  useEffect(() => {
    if (!data) return;
    setUsernameEdit(data.username);
    setNameEdit(data.name);
  }, [data]);

  const checkUsername = useDebounce(async () => {
    if (data?.username === usernameEdit || !usernameEdit) {
      setUsernameVerify(undefined);
      return;
    }
    if (!usernameEdit.match(/^[a-z-_.]+[a-z0-9]{4,17}$/g)) {
      toast.error(
        '아이디는 영문 소문자와 숫자 (5 ~ 18자) 만 사용할 수 있습니다.'
      );
      setUsernameVerify(false);
      return;
    }
    await jxios
      .get('/api/members/username/' + usernameEdit)
      .then((res) => {
        setUsernameVerify(true);
        toast.success(res.data as string);
      })
      .catch((err) => {
        setUsernameVerify(false);
        toast.error(err.response.data);
      });
  }, 500);

  const changeUsername = useDebounce(
    async () =>
      await jxios
        .put(`/api/members/${user?.username}/username`, {
          newUsername: usernameEdit,
          username: user?.username,
        })
        .then(() => {
          toast.success(
            '아이디가 변경되었습니다. 안전한 사용을 위해 로그아웃됩니다.'
          );
          push('/user/signout');
        })
        .catch((err) => {
          toast.error(err.response.data);
        }),
    500
  );

  const changeName = useDebounce(
    async () =>
      await jxios
        .put('/api/members/' + data?.username, {
          name: nameEdit,
        })
        .then((res) => {
          toast.success('활동명이 변경되었습니다.');
          setData(res.data as profileApiResponseType);
        })
        .catch((err) => {
          toast.error(err.response.data);
        }),
    500
  );

  useEffect(() => {
    checkUsername();
  }, [checkUsername, usernameEdit]);

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
        <Input disabled value={data.email} label='이메일' variant='flat' />
      </div>
      <hr />
      <div className='flex items-center justify-stretch gap-1'>
        <Input
          label='아이디'
          variant='bordered'
          value={usernameEdit}
          color={
            usernameVerify === undefined
              ? 'default'
              : usernameVerify
              ? 'success'
              : 'danger'
          }
          errorMessage={
            usernameVerify === false && '아이디를 사용할 수 없습니다.'
          }
          onValueChange={setUsernameEdit}
        />
        <Button
          color={usernameVerify ? 'primary' : 'default'}
          disabled={!usernameVerify}
          onClick={changeUsername}
        >
          아이디 변경
        </Button>
      </div>
      <div className='flex items-center justify-stretch gap-1'>
        <Input
          label='활동명'
          value={nameEdit}
          onValueChange={setNameEdit}
          variant='bordered'
        />
        <Button
          color={data.name === nameEdit ? 'default' : 'primary'}
          disabled={data.name === nameEdit}
          onClick={changeName}
        >
          활동명 변경
        </Button>
      </div>
      <hr />
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
