'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input } from '@nextui-org/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import Title from '@/components/Title';

import jxios from '@/utils/jxios';

const emailSchema = yup.object().shape({
  email: yup.string().email().required('이메일을 입력해주세요.'),
});

export default function FindPassword() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<{
    email: string;
  }>({
    resolver: yupResolver<{ email: string }>(emailSchema),
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<{ email: string }> = async (data) => {
    if (isSubmitting) return;
    await jxios
      .post('/api/mail/reset-password', undefined, { params: data })
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data as string);
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
          label='이메일'
          placeholder='aaa@aaa.com'
          type='email'
          fullWidth
          errorMessage={errors.email?.message}
          isInvalid={!!errors.email}
          variant='flat'
          className='mb-2'
          {...register('email')}
        />
        <Button
          color='primary'
          variant='solid'
          fullWidth
          type='submit'
          disabled={isSubmitting}
          isLoading={isSubmitting}>
          비밀번호 재설정 링크 보내기
        </Button>
      </form>
    </div>
  );
}
