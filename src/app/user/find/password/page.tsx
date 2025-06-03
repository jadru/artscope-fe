'use client';

import { yupResolver } from '@hookform/resolvers/yup';
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

export default function FindPassword() {
  const form = useForm<{
    email: string;
  }>({
    resolver: yupResolver(emailSchema),
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<{ email: string }> = async (data) => {
    if (form.formState.isSubmitting) return;
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
    <div onSubmit={form.handleSubmit(onSubmit)}>
      <Title
        title='비밀번호 찾기'
        description='가입하신 이메일로 비밀번호 재설정 링크를 보내드립니다.'
      />
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
          비밀번호 재설정 링크 보내기
        </Button>
      </Form>
    </div>
  );
}
