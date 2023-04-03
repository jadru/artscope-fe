import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineGoogle } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { useSetRecoilState } from 'recoil';
import * as yup from 'yup';

import ErrorMessageInput from '@/components/ErrorMessageInput';
import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';

import { decodedTokenAtom, tokenAtom } from '@/states/atoms';

import { decodedTokenType } from '@/types';

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

  const { push } = useRouter();
  const setToken = useSetRecoilState(tokenAtom);
  const setDecodedToken = useSetRecoilState(decodedTokenAtom);
  const onSubmit: SubmitHandler<loginInputs> = (data) =>
    !isSubmitting &&
    axios
      .post('/api/login', data)
      .then((res) => {
        const token = res.data.accessToken;
        const decodedToken = jwt_decode(token) as decodedTokenType;
        setToken(token);
        setDecodedToken(decodedToken);
        push('/').then(() => {
          toast.success('로그인이 완료되었습니다.');
          if (decodedToken.auth === 'ROLE_USER')
            push('/artist/info').then(() => toast('작가 정보를 입력해주세요.'));
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
        <form
          className='flex h-full w-full flex-col items-center justify-center space-y-6'
          onSubmit={handleSubmit(onSubmit)}
        >
          <p className='my-8 text-4xl font-thin'>로그인</p>
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
              href='https://art.be.megabrain.kr:443/oauth2/authorization/google'
              className='btn-secondary btn-block btn mt-2'
            >
              <AiOutlineGoogle /> &nbsp;구글로 로그인
            </Link>
          </div>
        </form>
      </TabLayout>
      <BottomBar tab='profile' />
    </>
  );
};

export default Login;
