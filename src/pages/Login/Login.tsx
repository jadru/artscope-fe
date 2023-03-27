import React from 'react';

import TabLayout from '@/components/TabLayout';

const Login = () => (
  <TabLayout>
    <div className='flex h-full w-full items-center justify-center'>
      <form className='sm:w-full md:w-[400px]'>
        <div className='form-control w-full items-stretch bg-white/90 p-16'>
          <label className='label'>
            <span className='label-text'>이메일 입력</span>
            <input
              type='email'
              placeholder='이메일을 입력해주세요'
              className='input-bordered input-primary input w-full'
            />
          </label>
          <label className='label'>
            <span className='label-text'>비밀번호 입력</span>
            <input
              type='password'
              placeholder='비밀번호를 입력해주세요'
              className='input-bordered input-primary input w-full'
            />
          </label>
        </div>
      </form>
    </div>
  </TabLayout>
);

export default Login;
