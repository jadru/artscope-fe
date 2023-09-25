'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input } from '@nextui-org/react';
import { EyeFilledIcon, EyeSlashFilledIcon } from '@nextui-org/shared-icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Cookies } from 'react-cookie';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineGoogle } from 'react-icons/ai';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import Title from '@/components/Title';

import { NEXT_PUBLIC_API_URL } from '@/constant/env';
import { saveUserOnCookie } from '@/utils/auth';
import jxios from '@/utils/jxios';

import { profileApiType } from '@/types';

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
  const [pwInputVisible, setPwInputVisible] = useState(false);
  const togglePwInputVisible = () => setPwInputVisible(!pwInputVisible);
  const cookies = new Cookies();
  const onSubmit: SubmitHandler<loginInputs> = async (loginData) =>
    !isSubmitting &&
    (await jxios.post('/api/login', loginData).then(async (res) => {
      const { accessToken, refreshToken, expiresIn } = res.data;
      if (res.status === 200 && accessToken) {
        cookies.set('refreshToken', refreshToken, {
          path: '/',
        });
        jxios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${accessToken}`;
        await jxios.get('/api/members/profile').then((res) => {
          saveUserOnCookie(res.data as profileApiType, cookies, expiresIn);
        });
        toast.success('로그인 되었습니다.');
        push('/');
      } else {
        toast.error(res.data);
      }
    }));

  return (
    <>
      <Title>로그인</Title>
      <div className='mx-auto my-8 flex max-w-md flex-col items-stretch gap-2 p-4'>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-2'>
          <Input
            type='text'
            label='아이디'
            variant='bordered'
            placeholder='아이디를 입력해주세요'
            errorMessage={errors.username?.message}
            isInvalid={!!errors.username}
            {...register('username')}
          />
          <Input
            label='비밀번호'
            variant='bordered'
            placeholder='비밀번호를 입력해주세요'
            endContent={
              <button
                className='focus:outline-none'
                type='button'
                onClick={togglePwInputVisible}
              >
                {pwInputVisible ? (
                  <EyeSlashFilledIcon className='pointer-events-none text-2xl text-default-400' />
                ) : (
                  <EyeFilledIcon className='pointer-events-none text-2xl text-default-400' />
                )}
              </button>
            }
            type={pwInputVisible ? 'text' : 'password'}
            errorMessage={errors.password?.message}
            isInvalid={!!errors.password}
            {...register('password')}
          />

          <Button type='submit' variant='flat' color='primary' fullWidth>
            로그인
          </Button>
        </form>
        <div className='flex gap-1'>
          <Button
            color='secondary'
            variant='flat'
            onClick={() => push('/user/signup')}
            className='w-1/2'
          >
            회원가입
          </Button>
          <Button
            color='warning'
            variant='flat'
            className='w-1/2'
            startContent={<AiOutlineGoogle className='h-6 w-6 text-lg' />}
            onClick={() =>
              push(NEXT_PUBLIC_API_URL + '/oauth2/authorization/google')
            }
          >
            구글로 로그인
          </Button>
        </div>
      </div>
    </>
  );
};

export default Login;
