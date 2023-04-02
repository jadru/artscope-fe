import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import Link from 'next/link';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import ErrorMessageInput from '@/components/ErrorMessageInput';
import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';

const loginSchema = yup.object().shape({
  username: yup.string().required('아이디를 입력하세요.'),
  password: yup.string().required('비밀번호를 입력하세요'),
});

interface loginInputs {
  username: string;
  password: string;
}
const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<loginInputs>({
    resolver: yupResolver(loginSchema),
  });
  const onSubmit: SubmitHandler<loginInputs> = (data) =>
    !isSubmitting &&
    axios
      .post('/api/login', data)
      .then((res) => {
        toast.success(res.data);
      })
      .catch((err) => {
        toast.error(err.response.data);
      });

  return (
    <>
      <Seo templateTitle='Login' />
      <NavBar title='ArtPlatform' />
      <TabLayout>
        <form
          className='flex h-full w-full flex-col items-center justify-center space-y-5'
          onSubmit={handleSubmit(onSubmit)}
        >
          <p className='my-8 text-4xl font-thin'>로그인</p>
          <div className='form-control w-full max-w-md'>
            <label className='label'>
              <span className='label-text'>아이디 입력</span>
            </label>
            <input
              type='text'
              placeholder='아이디를 입력해주세요'
              className='input-bordered input-primary input w-full'
              {...register('username')}
            />
            <ErrorMessageInput>
              {errors.username ? errors.username.message : ''}
            </ErrorMessageInput>
          </div>
          <div className='form-control w-full max-w-md'>
            <label className='label'>
              <span className='label-text'>비밀번호 입력</span>
            </label>
            <input
              type='password'
              placeholder='비밀번호를 입력해주세요'
              className='input-bordered input-primary input w-full'
              {...register('password')}
            />
            <ErrorMessageInput>
              {errors.password ? errors.password.message : ''}
            </ErrorMessageInput>
          </div>
          <div className='mt-4 flex flex-col space-y-1.5'>
            <button className='btn-primary btn-wide btn' type='submit'>
              로그인
            </button>
            <Link className='btn-primary btn-wide btn' href='/signup'>
              회원가입
            </Link>
          </div>
          {/* <Link */}
          {/*   href='https://art.be.megabrain.kr:443/oauth2/authorization/google' */}
          {/*   className='btn-secondary btn-wide btn' */}
          {/* > */}
          {/*   구글로 로그인 */}
          {/* </Link> */}
        </form>
      </TabLayout>
      <BottomBar tab='profile' />
    </>
  );
};

export default Login;
