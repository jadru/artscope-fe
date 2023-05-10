import Lottie from 'lottie-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Cookies } from 'react-cookie';
import { AiOutlineFileImage } from 'react-icons/ai';
import { BiEdit, BiSave } from 'react-icons/bi';
import { ImCancelCircle } from 'react-icons/im';
import { toast } from 'react-toastify';
import { useSetRecoilState } from 'recoil';
import useSWR from 'swr';

import AudioFileGridItem from '@/components/AudioFileGridItem';
import Skeleton from '@/components/Skeleton';

import { userNameAndRoleAtom } from '@/states/atom';
import jxios from '@/utils/jxios';

import {
  ArtWorkApiResponseType,
  profileApiRequestType,
  profileApiType,
} from '@/types';

import ProfileAnimation from '~/animation/8020-profile.json';

interface ProfileCardProps {
  profileData: profileApiType;
  editable?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profileData,
  editable = false,
}) => {
  const fetcher = (url: string) =>
    jxios
      .get(url, {
        params: {
          page: 0,
          size: 12,
        },
      })
      .then((res) => res.data);
  const { data: userArtworksData, isLoading: userArtworkLoading } =
    useSWR<ArtWorkApiResponseType>(
      '/api/artworks/member/' + profileData?.username,
      fetcher
    );
  const cookies = new Cookies();
  const setUserValue = useSetRecoilState(userNameAndRoleAtom);
  const { push, reload } = useRouter();
  const [editMode, setEditMode] = React.useState(false);
  const [formData, setFormData] = React.useState<profileApiRequestType>({});
  const handleLogout = () => {
    jxios.post('/api/logout').then(() => {
      cookies.remove('refreshToken', { path: '/' });
      jxios.defaults.headers.common['Authorization'] = undefined;
      setUserValue({
        username: undefined,
        role: undefined,
        profileImage: undefined,
      });
      push('/').then(() => toast.success('로그아웃 되었습니다.'));
    });
  };

  const handleEdit = () => {
    setEditMode((prevState) => !prevState);
  };

  const handleDeleteMember = () => {
    if (window.confirm(profileData?.name + '님, 정말로 탈퇴하시겠습니까?')) {
      jxios.delete('/api/members/' + profileData?.username).then(() => {
        cookies.remove('refreshToken', { path: '/' });
        jxios.defaults.headers.common['Authorization'] = undefined;
        push('/').then(() => toast.success('회원 탈퇴 되었습니다.'));
      });
    } else {
      return;
    }
  };
  const handleEditSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('profile', file);
    jxios
      .put('/api/members/' + profileData?.username + '/picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        toast.success('프로필 사진이 변경되었습니다.');
        reload();
      });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    jxios
      .put('/api/members/' + profileData?.username, formData)
      .then(async () => {
        await reload();
        await toast.success('프로필 정보가 변경되었습니다.');
      });
  };

  const handleFormChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  if (!editable)
    return (
      <div className='flex w-full flex-col md:border-2'>
        <div className='relative flex w-full flex-col items-center justify-center p-6 dark:text-gray-100 md:flex-row md:space-x-12'>
          <div className='group avatar h-24 w-24'>
            <div className='mask rounded-full border'>
              {profileData.picture ? (
                <Image
                  src={profileData.picture}
                  alt='profile'
                  width={250}
                  height={250}
                  className='object-cover'
                />
              ) : (
                <Lottie animationData={ProfileAnimation} className='w-full' />
              )}
            </div>
          </div>
          <div className='mt-3 space-y-1.5 divide-solid text-center text-black dark:text-gray-100 md:mt-0'>
            <p className='truncate text-3xl font-bold'>{profileData.name}</p>
            {/* <p className='text-md truncate font-bold'> */}
            {/*   {'@' + profileData.username} */}
            {/* </p> */}
            {profileData.introduction && (
              <p className='text-primary whitespace-pre-wrap text-left text-xl font-light'>
                {profileData.introduction}
              </p>
            )}
            {profileData.history && (
              <p className='whitespace-pre-wrap text-left'>
                {profileData.history}
              </p>
            )}
            <div className='link space-x-3 text-left font-black'>
              {profileData.snsUrl && (
                <Link
                  href={profileData.snsUrl}
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  SNS
                </Link>
              )}
              {profileData.websiteUrl && (
                <Link
                  href={profileData.websiteUrl}
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  WEBSITE
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className='grid w-full grid-cols-3 gap-0.5 md:gap-1 md:border-t-2'>
          {userArtworksData &&
            userArtworksData.artworks.map((artwork) => (
              <Link
                key={artwork.id}
                className='group relative'
                href={'/artwork/' + artwork.id}
              >
                {artwork.thumbnail.mediaType === 'image' ? (
                  <Image
                    src={artwork.thumbnail.mediaUrl}
                    alt='artwork'
                    width={200}
                    height={200}
                    className='aspect-square w-full object-cover'
                  />
                ) : (
                  <AudioFileGridItem className='aspect-square w-full object-cover' />
                )}
                {/* {artwork.title && ( */}
                {/*   <p className='md:text-md absolute bottom-2 left-2 mr-2 rounded-md bg-dark/40 px-3 py-2 text-left text-sm font-bold text-white backdrop-blur'> */}
                {/*     {artwork.title} */}
                {/*   </p> */}
                {/* )} */}
              </Link>
            ))}
          {userArtworkLoading && <Skeleton className='h-full w-2/3' />}
        </div>
      </div>
    );
  else
    return (
      <div className='relative flex w-full flex-col items-center justify-center space-y-4 p-6 dark:text-gray-100'>
        <>
          <p className='font-bold text-info'>
            {(profileData.artistStatus === 'APPROVED' &&
              '인증된 아티스트입니다.') ||
              (profileData.artistStatus === 'NONE' && (
                <Link className='btn-ghost btn' href='/artist/info'>
                  아티스트 정보 입력
                </Link>
              ))}
          </p>
          <input
            type='file'
            id='file'
            className='hidden'
            onChange={handleEditSubmit}
            itemType='image'
          />
          <label className='h-18 w-18' htmlFor='file'>
            <a className='group avatar relative h-24 w-24 cursor-pointer'>
              <div className='mask -z-0 rounded-full border'>
                {profileData.picture ? (
                  <Image
                    src={profileData.picture}
                    alt='profile'
                    width={250}
                    height={250}
                    className='object-cover'
                  />
                ) : (
                  <Lottie animationData={ProfileAnimation} className='w-full' />
                )}
              </div>
              <div
                className='absolute bottom-0 right-0 z-20 flex h-full w-full flex-col items-center justify-center rounded-full bg-dark/50 text-gray-100 opacity-0 group-hover:opacity-50 dark:bg-white/50'
                style={{ display: 'flex' }}
              >
                <AiOutlineFileImage className='h-12 w-12' />
              </div>
            </a>
          </label>
          <div className='space-y-1.5 divide-solid text-center text-black dark:text-gray-100'>
            <p className='truncate text-3xl font-light'>{profileData.name}</p>
            <p className='text-md truncate font-bold'>
              {'@' + profileData.username}
            </p>
            {profileData.introduction && (
              <p className='text-primary whitespace-pre-wrap text-left text-xl font-light'>
                {profileData.introduction}
              </p>
            )}
            {profileData.history && (
              <p className='whitespace-pre-wrap text-left'>
                {profileData.history}
              </p>
            )}
            <div className='link space-x-3 text-left font-black'>
              {profileData.snsUrl && (
                <Link
                  href={profileData.snsUrl}
                  className='hover:text-emerald-600'
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  SNS
                </Link>
              )}
              {profileData.websiteUrl && (
                <Link
                  href={profileData.websiteUrl}
                  className='hover:text-emerald-600'
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  WEBSITE
                </Link>
              )}
            </div>
          </div>
        </>
        {editMode ? (
          <form
            onSubmit={handleFormSubmit}
            className='flex flex-col items-center justify-center space-y-3 divide-solid text-center text-black dark:text-gray-100'
          >
            <div className='form-control w-full max-w-xs'>
              <label className='label'>
                <span className='label-text'>작가 활동명 입력</span>
              </label>
              <input
                id='name'
                className='input-bordered input truncate text-center text-3xl font-light'
                defaultValue={profileData.name}
                onChange={handleFormChange}
              />
            </div>
            <p className='text-md truncate font-bold'>
              {'@' + profileData.username}
            </p>
            {profileData.artistStatus === 'NONE' ? (
              <Link className='btn-secondary btn' href='/artist/info'>
                아티스트 정보 입력
              </Link>
            ) : (
              <>
                <div className='form-control w-full max-w-xs'>
                  <label className='label'>
                    <span className='label-text'>아티스트 소개 입력</span>
                  </label>
                  <input
                    id='introduction'
                    className='text-primary text-md input-bordered input w-full whitespace-pre-wrap text-center font-light'
                    defaultValue={profileData.introduction}
                    onChange={handleFormChange}
                  />
                </div>
                <div className='form-control w-full max-w-xs'>
                  <label className='label'>
                    <span className='label-text'>아티스트 약력 입력</span>
                  </label>
                  <textarea
                    id='history'
                    className='input-bordered input w-full text-left'
                    defaultValue={profileData.history}
                    onChange={handleFormChange}
                    rows={12}
                  />
                </div>
                <div className='form-control w-full max-w-xs'>
                  <label className='label'>
                    <span className='label-text'>아티스트 SNS URL 입력</span>
                  </label>
                  <input
                    id='snsUrl'
                    className='input-bordered input w-full truncate text-center font-light'
                    defaultValue={profileData.snsUrl}
                    onChange={handleFormChange}
                  />
                </div>
                <div className='form-control w-full max-w-xs'>
                  <label className='label'>
                    <span className='label-text'>
                      아티스트 웹사이트(포트폴리오) 입력
                    </span>
                  </label>
                  <input
                    id='websiteUrl'
                    className='input-bordered input w-full truncate text-center font-light'
                    defaultValue={profileData.websiteUrl}
                    onChange={handleFormChange}
                  />
                </div>
              </>
            )}

            <button id='submitbutton' type='submit' className='hidden' />
          </form>
        ) : (
          <>
            <div className='grid w-full grid-cols-3 gap-1'>
              {userArtworksData &&
                userArtworksData.artworks.map((artwork) => (
                  <Link
                    key={artwork.id}
                    className='group relative'
                    href={'/artwork/' + artwork.id}
                  >
                    {artwork.thumbnail.mediaType === 'image' ? (
                      <Image
                        src={artwork.thumbnail.mediaUrl}
                        alt='artwork'
                        width={200}
                        height={200}
                        className='aspect-square w-full object-cover'
                      />
                    ) : (
                      <AudioFileGridItem className='aspect-square w-full object-cover' />
                    )}
                    {/* {artwork.title && ( */}
                    {/*   <p className='text-md absolute bottom-2 left-2 mr-2 rounded-md bg-dark/40 px-3 py-2 text-left font-bold text-white backdrop-blur'> */}
                    {/*     {artwork.title} */}
                    {/*   </p> */}
                    {/* )} */}
                  </Link>
                ))}
              {userArtworkLoading && <Skeleton className='h-full w-2/3' />}
            </div>
            <div className='flex w-full justify-between'>
              <button className='btn-primary btn' onClick={handleLogout}>
                로그아웃
              </button>

              {editMode ? (
                <div className='btn-group'>
                  <button
                    className='btn-warning btn'
                    onClick={() => setEditMode(false)}
                  >
                    <ImCancelCircle className='h-6 w-6' />
                  </button>
                  <label className='btn-success btn' htmlFor='submitbutton'>
                    <BiSave className='h-6 w-6' />
                  </label>
                </div>
              ) : (
                <button className='btn-accent btn' onClick={handleEdit}>
                  <BiEdit className='h-6 w-6 text-slate-600 hover:text-cyan-500' />
                </button>
              )}
            </div>
            <button className='btn-ghost btn' onClick={handleDeleteMember}>
              회원탈퇴
            </button>
          </>
        )}
      </div>
    );
};
export default ProfileCard;
