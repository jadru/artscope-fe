'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import Title from '@/components/Title';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import jxios from '@/utils/jxios';

const emailSchema = yup.object().shape({
  email: yup.string().email().required('이메일을 입력해주세요.'),
});

export default function FindUsername() {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const form = useForm<{
    email: string;
  }>({
    resolver: yupResolver<{ email: string }>(emailSchema),
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<{ email: string }> = async (data) => {
    if (form.formState.isSubmitting) return;
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
    <div onSubmit={form.handleSubmit(onSubmit)}>
      <Title
        title='아이디 찾기'
        description='가입하신 이메일로 아이디를 찾아드립니다.'
      />
      {!isSuccess ? (
        <Form {...form}>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type='email' placeholder='aaa@aaa.com' {...field} />
                </FormControl>
                <FormDescription>
                  Email을 입력해주세요. 비밀번호 재설정 링크를 보내드립니다.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            color='primary'
            type='submit'
            disabled={form.formState.isSubmitting}>
            아이디 찾기
          </Button>
        </Form>
      ) : (
        <div className='flex flex-col gap-2 text-center mt-3'>
          <p>
            이메일로 아이디를 전송했습니다.
            <br />
            이메일을 확인해주세요.
          </p>
          <Link href='/user/login' className='pt-2'>
            <Button color='secondary'>로그인하러 가기</Button>
          </Link>
          <Link href='/user/find/password'>
            <Button color='warning'>비밀번호 찾기</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
