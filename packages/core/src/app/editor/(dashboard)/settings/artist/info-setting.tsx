'use client';

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
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import jxios from '@/utils/jxios';

interface InfoInputs {
  name: string;
  snsUrl?: string;
  websiteUrl?: string;
  introduction?: string;
  history?: string;
}

const infoSchema = yup.object().shape({
  name: yup.string().required('작가명을 입력해주세요.'),
  snsUrl: yup.string().url('URL 형식이 아닙니다.'),
  websiteUrl: yup.string().url('URL 형식이 아닙니다.'),
  introduction: yup.string().max(1000, '1000자 이내로 작성해주세요.'),
  history: yup.string().max(1000, '1000자 이내로 작성해주세요.'),
});

export default function InfoSetting(props: {
  profile: InfoInputs;
  username: string;
}) {
  const form = useForm<InfoInputs>({
    resolver: yupResolver<InfoInputs>(infoSchema),
  });
  const router = useRouter();

  return (
    <div>
      <FormCard title='작가 정보 변경'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) =>
              jxios.put('/api/members/' + props.username, data).then((res) => {
                if (res.status === 200) {
                  toast.success('작가 정보가 변경되었습니다.');
                  router.refresh();
                } else {
                  toast.error('작가 정보 변경에 문제가 있습니다.');
                }
              })
            )}
            className='flex w-full flex-col gap-1'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <div className='w-full'>
                    <FormLabel>작가명</FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        placeholder='작가명을 입력해주세요.'
                        defaultValue={props.profile.name}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='snsUrl'
              render={({ field }) => (
                <FormItem>
                  <div className='w-full'>
                    <FormLabel>SNS URL</FormLabel>
                    <FormControl>
                      <Input
                        type='url'
                        placeholder='SNS URL을 입력해주세요.'
                        defaultValue={props.profile.snsUrl}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='websiteUrl'
              render={({ field }) => (
                <FormItem>
                  <div className='w-full'>
                    <FormLabel>웹사이트 URL</FormLabel>
                    <FormControl>
                      <Input
                        type='url'
                        placeholder='웹사이트 URL을 입력해주세요.'
                        defaultValue={props.profile.websiteUrl}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='introduction'
              render={({ field }) => (
                <FormItem>
                  <div className='w-full'>
                    <FormLabel>작가 소개</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='작가 소개를 입력해주세요.'
                        defaultValue={props.profile.introduction}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='history'
              render={({ field }) => (
                <FormItem>
                  <div className='w-full'>
                    <FormLabel>작가 이력</FormLabel>
                    <FormControl>
                      <Textarea
                        className='h-32'
                        placeholder='작가 이력을 입력해주세요.'
                        defaultValue={props.profile.history}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button
              type='submit'
              className='h-9 mt-2 self-start'
              disabled={form.formState.isSubmitting}>
              저장
            </Button>
          </form>
        </Form>
      </FormCard>
    </div>
  );
}
