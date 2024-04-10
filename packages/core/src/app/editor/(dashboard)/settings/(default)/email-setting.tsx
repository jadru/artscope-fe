import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import FormCard from '@/components/FormCard';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import jxios from '@/utils/jxios';

export default function EmailSetting(props: {
  username: string;
  email: string;
}) {
  const form = useForm<{
    email: string;
  }>({
    mode: 'onBlur',
    resolver: yupResolver<{
      email: string;
    }>(
      yup.object().shape({
        email: yup
          .string()
          .required('이메일을 입력해주세요.')
          .email('이메일 형식이 아닙니다.')
          .test('email', '이미 사용중인 이메일입니다.', async (value) => {
            try {
              const res = await jxios.get(`/api/members/email/${value}`);
              return res.status === 200;
            } catch (e) {
              return false;
            }
          }),
      })
    ),
  });
  const router = useRouter();

  return (
    <div>
      <FormCard title='이메일 변경'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) =>
              jxios
                .put('/api/members/' + props.username + '/email', {
                  email: data.email,
                })
                .then((res) => {
                  if (res.status === 200) {
                    toast.success('이메일이 변경되었습니다.');
                    router.refresh();
                  } else {
                    toast.error('이메일 변경에 문제가 있습니다.');
                  }
                })
            )}>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <div className='w-full'>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='이메일을 입력해주세요.'
                        defaultValue={props.email}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    {!form.formState.errors.email && form.formState.isValid && (
                      <p className='text-green-600 text-sm'>
                        사용 가능한 이메일입니다.
                      </p>
                    )}
                  </div>
                </FormItem>
              )}
            />
            <Button
              type='submit'
              className='h-9 mt-2'
              disabled={form.formState.isSubmitting || !form.formState.isValid}>
              이메일 전송
            </Button>
          </form>
        </Form>
      </FormCard>
    </div>
  );
}
