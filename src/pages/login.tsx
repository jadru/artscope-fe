import { yupResolver } from '@hookform/resolvers/yup';
import jwt_decode from 'jwt-decode';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';
import { Cookies } from 'react-cookie';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineGoogle } from 'react-icons/ai';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import ErrorMessageInput from '@/components/ErrorMessageInput';
import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';
import Title from '@/components/Title';

import { OAUTH2_GOOGLE_URI } from '@/constant/env';
import jxios from '@/utils/jxios';

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
  const cookies = useMemo(() => new Cookies(), []);
  const { push, asPath } = useRouter();
  useEffect(() => {
    if (jxios.defaults.headers.common['Authorization']) {
      push('/').then(() => toast.info('이미 로그인 되어있습니다.'));
    }
  }, [cookies, push, asPath]);

  const onSubmit: SubmitHandler<loginInputs> = (data) =>
    !isSubmitting &&
    jxios
      .post('/api/login', data)
      .then((res) => {
        const { accessToken, refreshToken } = res.data;
        const decodedRefreshToken: { exp: number } = jwt_decode(refreshToken);
        cookies.set('refreshToken', refreshToken, {
          expires: new Date(decodedRefreshToken.exp * 1000),
          path: '/',
        });
        jxios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${accessToken}`;
        jxios
          .get('/api/members/profile')
          .then((res) => {
            if (res.data.artistStatus === 'NONE') {
              push('/artist/info').then(() =>
                toast.info('작가 정보를 입력해주세요.')
              );
            } else {
              push('/').then(() => toast.success('로그인이 완료되었습니다.'));
            }
          })
          .catch(() => {
            push('/').then(() => toast.success('로그인이 완료되었습니다.'));
          });
      })
      .catch((err) => {
        toast.error(err.response?.data);
      });

  return (
    <>
      <Seo templateTitle='Login' />
      <NavBar title='ArtPlatform' />
      <TabLayout>
        <Title>로그인</Title>
        <form
          className='flex h-full w-full flex-col items-center justify-center space-y-6'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className='w-full max-w-md'>
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
            <button className='btn-primary btn-block btn mt-4' type='submit'>
              로그인
            </button>
            <Link className='btn-primary btn-block btn mt-2' href='/signup'>
              회원가입
            </Link>
            <Link
              href={OAUTH2_GOOGLE_URI}
              className='btn-secondary btn-block btn mt-2'
            >
              <AiOutlineGoogle /> &nbsp;구글로 로그인
            </Link>
          </div>
        </form>
      </TabLayout>
      <BottomBar tab='login' />
    </>
  );
};

export default Login;
