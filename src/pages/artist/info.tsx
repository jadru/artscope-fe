import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';
import * as yup from 'yup';

import ErrorMessageInput from '@/components/ErrorMessageInput';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';

import { tokenSelector } from '@/states/selectors';

interface ArtistForm {
  introduction: string;
  history: string;
  snsUrl: string;
  websiteUrl: string;
}

const artistSchema = yup.object().shape({
  introduction: yup.string().required('아티스트 소개를 입력해주세요.'),
  history: yup.string(),
  snsUrl: yup.string().required('SNS 주소를 입력해주세요.'),
  websiteUrl: yup.string(),
});

const ArtistInfo = () => {
  const token = useRecoilValue(tokenSelector);
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
      axios
        .post('/api/members/artist', data, {
          headers: {
            Authorization: token,
          },
        })
        .then(() => {
          push('/profile').then(() =>
            toast.success('아티스트 정보가 입력되었습니다.')
          );
        })
        .catch((err) => {
          toast.error(err.response.data);
        });
  };

  return (
    <>
      <NavBar />
      <TabLayout classNameChild='sm:max-w-md'>
        <form
          onSubmit={handleSubmit(onArtistInfoSubmit)}
          className='mt-6 max-w-md space-y-2'
        >
          <h1>아티스트 정보 입력</h1>
          <div className='form-control w-full max-w-md'>
            <label className='label'>
              <span className='label-text'>아티스트 소개 입력</span>
            </label>
            <input
              type='text'
              placeholder='아티스트 소개를 입력해주세요'
              className='input-bordered input-primary input w-full'
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
            <input
              type='text'
              placeholder='활동 정보를 입력해주세요'
              className='input-bordered input-primary input w-full'
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
              placeholder='SNS 주소를 입력해주세요'
              className='input-bordered input-primary input w-full'
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
              placeholder='웹사이트 주소를 입력해주세요'
              className='input-bordered input-primary input w-full'
              {...register('websiteUrl')}
            />
            <ErrorMessageInput>
              {errors.websiteUrl ? errors.websiteUrl.message : ''}
            </ErrorMessageInput>
          </div>
          <button type='submit' className='btn-primary btn-block btn mt-4'>
            아티스트 승인 제출
          </button>
        </form>
      </TabLayout>
      <BottomBar tab='profile' />
    </>
  );
};

export default ArtistInfo;
