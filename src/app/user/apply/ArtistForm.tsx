import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input, Textarea } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import { useUser } from '@/states';
import jxios from '@/utils/jxios';

import { ArtistForm } from '@/types/member';

const artistSchema = yup.object().shape({
  introduction: yup.string().required('아티스트 소개를 입력해주세요.'),
  history: yup.string().required('활동 정보를 입력해주세요.'),
  snsUrl: yup
    .string()
    .url('URL을 입력해주세요')
    .required('SNS 주소를 입력해주세요.'),
  websiteUrl: yup.string().url('URL을 입력해주세요'),
});

export default function ArtistForm({
  isEdit = undefined,
}: {
  isEdit?: ArtistForm | undefined;
}) {
  const { push } = useRouter();
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ArtistForm>({
    resolver: yupResolver(artistSchema),
  });

  const onArtistInfoSubmit = (data: ArtistForm) => {
    !isSubmitting && !isEdit
      ? jxios
          .post('/api/members/artist', data)
          .then(() => {
            push('/');
            toast.success('아티스트 정보가 입력되었습니다.');
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
            toast.success('아티스트 정보가 수정되었습니다.');
          })
          .catch((err) => {
            toast.error(err.response.data);
          });
  };
  return (
    <form onSubmit={handleSubmit(onArtistInfoSubmit)} className='space-y-2'>
      <Input
        type='text'
        label='아티스트 소개 입력'
        defaultValue={isEdit?.introduction}
        placeholder='OO에서 활동하는 OO 아티스트입니다.'
        required
        errorMessage={errors.introduction?.message}
        isInvalid={!!errors.introduction}
        {...register('introduction')}
      />
      <Textarea
        label='활동 정보 입력'
        placeholder='OO전시 참여, OO상 수상 등'
        defaultValue={isEdit?.history}
        errorMessage={errors.history?.message}
        required
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
        아티스트 정보 {isEdit ? '수정' : '입력'}
      </Button>
    </form>
  );
}
