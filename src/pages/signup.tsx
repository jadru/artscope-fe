import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import ErrorMessageInput from '@/components/ErrorMessageInput';
import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';
import Title from '@/components/Title';

import jxios from '@/utils/jxios';

const loginSchema = yup.object().shape({
  username: yup.string().required('아이디를 입력하세요.'),
  password: yup
    .string()
    .min(8, '비밀번호는 8자 이상입니다.')
    .required('비밀번호를 입력하세요'),
  email: yup
    .string()
    .email('이메일 형식이 아닙니다.')
    .required('이메일을 입력하세요.'),
  name: yup.string().required('작가명을 입력하세요.'),
  passwordCheck: yup
    .string()
    .oneOf([yup.ref('password')], '비밀번호가 일치하지 않습니다.')
    .required('비밀번호를 한번 더 입력해주세요.'),
});

interface loginInputs {
  username: string;
  password: string;
  email: string;
  passwordCheck?: string;
  name: string;
}
const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<loginInputs>({
    resolver: yupResolver(loginSchema),
  });
  const { push } = useRouter();

  const onSubmit: SubmitHandler<loginInputs> = (data) =>
    !isSubmitting &&
    delete data.passwordCheck &&
    jxios
      .post('/api/members', data, {
        withCredentials: false,
      })
      .then(() => {
        push('/login').then(() => toast.success('회원가입이 완료되었습니다.'));
      })
      .catch((err) => {
        toast.error(err.response.data);
      });

  return (
    <>
      <Seo templateTitle='Signup' />
      <NavBar title='ArtPlatform' />
      <TabLayout>
        <Title>회원가입</Title>
        <form
          className='flex h-full w-full flex-col items-center justify-center space-y-5'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className='form-control w-full max-w-md'>
            <label className='label'>
              <span className='label-text'>이메일 입력</span>
            </label>
            <input
              type='email'
              placeholder='이메일을 입력해주세요'
              className='input-bordered input-primary input w-full'
              {...register('email')}
            />
            <ErrorMessageInput>
              {errors.email ? errors.email.message : ''}
            </ErrorMessageInput>
          </div>
          <div className='form-control w-full max-w-md'>
            <label className='label'>
              <span className='label-text'>작가명 입력</span>
            </label>
            <input
              type='text'
              placeholder='작가명을 입력해주세요'
              className='input-bordered input-primary input w-full'
              {...register('name')}
            />
            <ErrorMessageInput>
              {errors.name ? errors.name.message : ''}
            </ErrorMessageInput>
          </div>
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
          <div className='form-control w-full max-w-md'>
            <label className='label'>
              <span className='label-text'>비밀번호 확인</span>
            </label>
            <input
              type='password'
              placeholder='비밀번호를 한번 더 입력해주세요'
              className='input-bordered input-primary input w-full'
              {...register('passwordCheck')}
            />
            <ErrorMessageInput>
              {errors.passwordCheck ? errors.passwordCheck.message : ''}
            </ErrorMessageInput>
          </div>
          <button className='btn-primary btn-wide btn mt-4' type='submit'>
            회원가입
          </button>
        </form>
      </TabLayout>
      <BottomBar tab='profile' />
    </>
  );
};

export default Signup;
