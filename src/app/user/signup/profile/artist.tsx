'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import ErrorMessageInput from '@/components/ErrorMessageInput';
import Title from '@/components/Title';

import { profile } from '@/api';

import { ArtistForm } from '@/types/artist';

const artistSchema = yup.object().shape({
  introduction: yup.string().required('아티스트 소개를 입력해주세요.'),
  history: yup.string().required('활동 정보를 입력해주세요.'),
  snsUrl: yup
    .string()
    .url('URL을 입력해주세요')
    .required('SNS 주소를 입력해주세요.'),
  websiteUrl: yup.string().url('URL을 입력해주세요'),
});

const ArtistInfo = () => {
  const { push } = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ArtistForm>({
    resolver: yupResolver(artistSchema),
  });

  const onArtistInfoSubmit = (data: ArtistForm) => {
    !isSubmitting &&
      profile
        .input(data)
        .then(() => {
          push('/');
          toast.success('아티스트 정보가 입력되었습니다.');
        })
        .catch((err) => {
          toast.error(err.response.data);
        });
  };

  return (
    <form
      onSubmit={handleSubmit(onArtistInfoSubmit)}
      className='mt-6 max-w-md space-y-2'
    >
      <Title>아티스트 정보 입력</Title>
      <div className='form-control w-full max-w-md'>
        <label className='label'>
          <span className='label-text'>아티스트 소개 입력</span>
        </label>
        <input
          type='text'
          placeholder='OO에서 활동하는 OO 아티스트입니다.'
          className='input input-bordered w-full'
          {...register('introduction')}
        />
        <ErrorMessageInput>
          {errors.introduction ? errors.introduction.message : ''}
        </ErrorMessageInput>
      </div>
      <div className='form-control w-full max-w-md'>
        <label className='label'>
          <span className='label-text'>활동 정보</span>
        </label>
        <textarea
          placeholder='OO전시 참여, OO상 수상 등'
          className='textarea textarea-bordered w-full'
          {...register('history')}
        />
        <ErrorMessageInput>
          {errors.history ? errors.history.message : ''}
        </ErrorMessageInput>
      </div>
      <div className='form-control w-full max-w-md'>
        <label className='label'>
          <span className='label-text'>SNS 주소 입력</span>
        </label>
        <input
          type='url'
          placeholder='https://www.instagram.com/...'
          className='input input-bordered w-full'
          {...register('snsUrl')}
        />
        <ErrorMessageInput>
          {errors.snsUrl ? errors.snsUrl.message : ''}
        </ErrorMessageInput>
      </div>
      <div className='form-control w-full max-w-md'>
        <label className='label'>
          <span className='label-text'>웹사이트 주소 입력</span>
        </label>
        <input
          type='url'
          placeholder='https://www.example.com'
          className='input input-bordered w-full'
          {...register('websiteUrl')}
        />
        <ErrorMessageInput>
          {errors.websiteUrl ? errors.websiteUrl.message : ''}
        </ErrorMessageInput>
      </div>
      <button type='submit' className='btn btn-primary btn-block mt-4'>
        아티스트 정보 저장
      </button>
    </form>
  );
};

export default ArtistInfo;
