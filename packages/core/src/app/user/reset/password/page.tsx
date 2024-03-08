'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input } from '@nextui-org/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import Title from '@/components/Title';

import jxios from '@/utils/jxios';

const passwordSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, '비밀번호는 8자 이상입니다.')
    .required('비밀번호를 입력해주세요.'),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref('password')], '비밀번호가 일치하지 않습니다.')
    .required('비밀번호를 입력해주세요.'),
});

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const { push } = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<{
    password: string;
    passwordConfirm: string;
  }>({
    resolver: yupResolver<{
      password: string;
      passwordConfirm: string;
    }>(passwordSchema),
    mode: 'onBlur',
  });

  useEffect(() => {
    if (!code) {
      toast.warn('잘못된 접근입니다.');
      push('/user/login');
    }
  }, [code, push]);

  const onSubmit: SubmitHandler<{
    password: string;
    passwordConfirm: string;
  }> = async (data) => {
    if (isSubmitting) return;
    jxios
      .post('/api/members/reset-password', data.password, {
        params: {
          code,
        },
        headers: {
          'Content-Type': 'text/plain',
        },
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success(
            (res.data as string) + ' 해당 비밀번호로 로그인이 가능합니다.'
          );
          push('/user/login');
        }
      })
      .catch((err) => {
        toast.error(err.response.data as string);
      });
  };

  return (
    <div onSubmit={handleSubmit(onSubmit)}>
      <Title
        title='비밀번호 찾기'
        description='가입하신 이메일로 비밀번호 재설정 링크를 보내드립니다.'
      />

      <form>
        <Input
          label='비밀번호'
          placeholder='비밀번호를 입력해주세요'
          type='password'
          fullWidth
          errorMessage={errors.password?.message}
          isInvalid={!!errors.password}
          variant='flat'
          className='mb-2'
          {...register('password')}
        />
        <Input
          label='비밀번호 확인'
          placeholder='비밀번호를 다시 입력해주세요'
          type='password'
          fullWidth
          errorMessage={errors.passwordConfirm?.message}
          isInvalid={!!errors.passwordConfirm}
          variant='flat'
          className='mb-2'
          {...register('passwordConfirm')}
        />
        <Button
          color='primary'
          variant='flat'
          fullWidth
          type='submit'
          disabled={isSubmitting}
          isLoading={isSubmitting}>
          비밀번호 재설정
        </Button>
      </form>
    </div>
  );
}
