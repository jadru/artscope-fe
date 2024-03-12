'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input } from '@nextui-org/react';
import Link from 'next/link';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { MdPassword } from 'react-icons/md';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import Title from '@/components/Title';

import jxios from '@/utils/jxios';

const emailSchema = yup.object().shape({
  email: yup.string().email().required('이메일을 입력해주세요.'),
});

export default function FindUsername() {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
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
      .get('/api/mail/find-username', { params: data })
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data as string);
          setIsSuccess(true);
        }
      })
      .catch((err) => {
        toast.error(err.response.data as string);
      });
  };

  return (
    <div onSubmit={handleSubmit(onSubmit)}>
      <Title
        title='아이디 찾기'
        description='가입하신 이메일로 아이디를 찾아드립니다.'
      />
      {!isSuccess ? (
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
            아이디 찾기
          </Button>
        </form>
      ) : (
        <div className='flex flex-col gap-2 text-center mt-3'>
          <p>
            이메일로 아이디를 전송했습니다.
            <br />
            이메일을 확인해주세요.
          </p>
          <Link href='/user/login' className='pt-2'>
            <Button color='secondary' variant='solid' fullWidth>
              로그인하러 가기
            </Button>
          </Link>
          <Link href='/user/find/password'>
            <Button
              color='warning'
              variant='solid'
              fullWidth
              startContent={<MdPassword size={23} />}>
              비밀번호 찾기
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
