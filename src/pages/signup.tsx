import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';

import ErrorMessageInput from '@/components/ErrorMessageInput';
import Footer from '@/components/Footer';
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
  agree: yup
    .boolean()
    .oneOf([true], '약관에 동의해주세요.')
    .required('약관에 동의해주세요.'),
});

interface loginInputs {
  username: string;
  password: string;
  email: string;
  passwordCheck?: string;
  name: string;
  agree?: boolean;
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
    delete data.agree &&
    jxios.post('/api/members', data, {}).then(() => {
      push('/login');
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
          <div className='w-full max-w-md items-center justify-center'>
            <input
              type='checkbox'
              className='checkbox-primary checkbox'
              {...register('agree')}
            />
            <label className='ml-2 cursor-pointer'>
              <span className='text-gray-500'>
                <Link
                  className='link-primary link'
                  href='https://plip.kr/pcc/1bdbcbd7-0bde-4101-8ce2-cc4e1fc53eef/consent/1.html'
                  target='_blank'
                >
                  개인정보 수집 및 이용
                </Link>
                {' 및 '}
                <Link
                  className='link-primary link'
                  href='https://www.plip.kr/pcc/1bdbcbd7-0bde-4101-8ce2-cc4e1fc53eef/privacy-policy'
                  target='_blank'
                >
                  개인정보 처리방침
                </Link>
                에 동의합니다.
              </span>
            </label>
            <ErrorMessageInput>
              {errors.agree ? errors.agree.message : ''}
            </ErrorMessageInput>
          </div>
          <button className='btn-primary btn-wide btn mt-4' type='submit'>
            회원가입
          </button>
        </form>
      </TabLayout>
      <Footer />
      <BottomBar tab='profile' />
    </>
  );
};

export default Signup;
