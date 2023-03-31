import Link from 'next/link';
import React from 'react';

import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';

const Login = () => {
  return (
    <>
      <NavBar title='ArtPlatform' />
      <TabLayout>
        <div className='flex h-full w-full flex-col items-center justify-center space-y-2'>
          <div className='form-control mt-12 w-full max-w-md'>
            <label className='label'>
              <span className='label-text'>이메일 입력</span>
            </label>
            <input
              type='email'
              placeholder='이메일을 입력해주세요'
              className='input-bordered input-primary input w-full'
            />
          </div>
          <div className='form-control w-full max-w-md'>
            <label className='label'>
              <span className='label-text'>비밀번호 입력</span>
            </label>
            <input
              type='password'
              placeholder='비밀번호를 입력해주세요'
              className='input-bordered input-primary input w-full'
            />
          </div>
          <button className='btn-primary btn-wide btn'>로그인</button>
          <button className='btn-primary btn-wide btn'>회원가입</button>
          <Link
            href='https://art.be.megabrain.kr:443/oauth2/authorization/google'
            className='btn-secondary btn-wide btn'
          >
            구글로 로그인
          </Link>
        </div>
      </TabLayout>
      <BottomBar tab='profile' />
    </>
  );
};

export default Login;
