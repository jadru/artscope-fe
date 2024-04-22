import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { loginInputs, loginSchema } from '@/app/user/login/loginSchema';
import { onLogin } from '@/auth/onLogin';
import { useUser } from '@/states';
import jxios from '@/utils/jxios';

import { loginResponseType } from '@/types/auth';

export default function LoginForm({ redirect }: { redirect: string | null }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<loginInputs>({
    resolver: yupResolver(loginSchema),
  });
  const { setUser } = useUser();
  const [pwInputVisible, setPwInputVisible] = useState(false);
  const router = useRouter();

  const onSubmit: SubmitHandler<loginInputs> = async (loginData) =>
    !isSubmitting &&
    (await jxios.post('/api/login', loginData).then(async (res) => {
      const tokenData: loginResponseType = res.data;
      if (res.status === 200 && tokenData.accessToken) {
        await onLogin(tokenData, router, setUser);
        if (redirect) {
          router.replace(decodeURIComponent(redirect));
        } else {
          router.push('/');
        }
      } else {
        toast.error(res.data);
      }
    }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-2'>
      <Input
        type='text'
        placeholder='아이디'
        formNoValidate={!!errors.username}
        {...register('username')}
      />
      <Input
        placeholder='비밀번호'
        type={pwInputVisible ? 'text' : 'password'}
        formNoValidate={!!errors.password}
        {...register('password')}
      />

      <Button type='submit' color='primary' className='w-full'>
        로그인
      </Button>
    </form>
  );
}
