import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input, Textarea } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import { useUser } from '@/states';
import jxios from '@/utils/jxios';

// eslint-disable-next-line no-unused-vars
import { ArtistForm, CuratorForm } from '@/types/member';

const curatorSchema = yup.object().shape({
  introduction: yup.string().required('기획자 소개를 입력해주세요.'),
  history: yup.string().required('활동 정보를 입력해주세요.'),
  snsUrl: yup
    .string()
    .url('URL을 입력해주세요')
    .required('SNS 주소를 입력해주세요.'),
  websiteUrl: yup.string().url('URL을 입력해주세요'),
  companyName: yup.string(),
  companyRole: yup.string(),
});

export default function ArtistForm({
  isEdit = undefined,
}: {
  isEdit?: CuratorForm | undefined;
}) {
  const { push } = useRouter();
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CuratorForm>({
    resolver: yupResolver(curatorSchema),
  });

  const onCuratorInfoSubmit = (data: ArtistForm) => {
    if (data.websiteUrl === '') {
      data.websiteUrl = undefined;
    }
    !isSubmitting && !isEdit
      ? jxios
          .post('/api/members/curator', data)
          .then(() => {
            push('/');
            toast.success('기획자 정보가 입력되었습니다.');
          })
          .catch((err) => {
            toast.error(err.response.data);
          })
      : jxios
          .put('/api/members/' + user?.username, {
            ...data,
            email: user?.email,
            name: user?.name,
            username: user?.username,
          })
          .then(() => {
            toast.success('기획자 정보가 수정되었습니다.');
          })
          .catch((err) => {
            toast.error(err.response.data);
          });
  };
  return (
    <form onSubmit={handleSubmit(onCuratorInfoSubmit)} className='space-y-2'>
      <Input
        type='text'
        label='기획자 소개 입력'
        defaultValue={isEdit?.introduction}
        placeholder='OO에서 활동하는 OO 기획자입니다.'
        required
        errorMessage={errors.introduction?.message}
        isInvalid={!!errors.introduction}
        {...register('introduction')}
      />
      <Input
        type='text'
        label='소속'
        defaultValue={isEdit?.companyName}
        placeholder='00미술관, 00회사'
        errorMessage={errors.companyName?.message}
        isInvalid={!!errors.companyName}
        {...register('companyName')}
      />
      <Input
        type='text'
        label='직책'
        defaultValue={isEdit?.companyRole}
        placeholder='직책을 입력해주세요.'
        errorMessage={errors.companyRole?.message}
        isInvalid={!!errors.companyRole}
        {...register('companyRole')}
      />
      <Textarea
        label='활동 정보 입력 (엔터키로 구분)'
        placeholder='OO전시 참여, OO상 수상 등'
        defaultValue={isEdit?.history}
        errorMessage={errors.history?.message}
        required
        maxRows={50}
        isInvalid={!!errors.history}
        {...register('history')}
      />
      <Input
        type='url'
        label='SNS 주소 입력'
        defaultValue={isEdit?.snsUrl}
        placeholder='https://www.instagram.com/...'
        errorMessage={errors.snsUrl?.message}
        required
        isInvalid={!!errors.snsUrl}
        {...register('snsUrl')}
      />
      <Input
        type='url'
        label='웹사이트 주소 입력'
        defaultValue={isEdit?.websiteUrl}
        placeholder='https://www.example.com'
        errorMessage={errors.websiteUrl?.message}
        isInvalid={!!errors.websiteUrl}
        {...register('websiteUrl')}
      />
      <Button type='submit' color='primary' fullWidth>
        기획자 정보 {isEdit ? '수정' : '입력'}
      </Button>
    </form>
  );
}
