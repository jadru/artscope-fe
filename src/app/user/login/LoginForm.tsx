import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { toast } from 'react-toastify';

import { loginInputs, loginSchema } from '@/app/user/login/loginSchema';
import { onLogin } from '@/auth/onLogin';
import { useUser } from '@/states';
import jxios from '@/utils/jxios';

import { loginResponseType } from '@/types/auth';

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<loginInputs>({
    resolver: yupResolver(loginSchema),
  });
  const { setUser } = useUser();
  const [pwInputVisible, setPwInputVisible] = useState(false);
  const togglePwInputVisible = () => setPwInputVisible(!pwInputVisible);
  const router = useRouter();

  const onSubmit: SubmitHandler<loginInputs> = async (loginData) =>
    !isSubmitting &&
    (await jxios.post('/api/login', loginData).then(async (res) => {
      const tokenData: loginResponseType = res.data;
      if (res.status === 200 && tokenData.accessToken) {
        await onLogin(tokenData, router, setUser);
      } else {
        toast.error(res.data);
      }
    }));

  return (
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
              <AiFillEyeInvisible className='pointer-events-none text-2xl text-default-400' />
            ) : (
              <AiFillEye className='pointer-events-none text-2xl text-default-400' />
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
  );
}
