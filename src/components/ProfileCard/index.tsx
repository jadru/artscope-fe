import Lottie from 'lottie-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Cookies } from 'react-cookie';
import { AiFillSafetyCertificate } from 'react-icons/ai';
import { BiEdit, BiSave } from 'react-icons/bi';
import { BsFillImageFill } from 'react-icons/bs';
import { HiOutlineDocumentSearch } from 'react-icons/hi';
import { toast } from 'react-toastify';

import jxios from '@/utils/jxios';

import { profileApiType } from '@/types';

import ProfileAnimation from '~/animation/8020-profile.json';

interface ProfileCardProps {
  profileData: profileApiType;
  editable?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profileData,
  editable = false,
}) => {
  const cookies = new Cookies();
  const { push, reload } = useRouter();
  const [editMode, setEditMode] = React.useState(false);
  const handleLogout = () => {
    jxios.post('/api/logout').then(() => {
      cookies.remove('refreshToken', { path: '/' });
      jxios.defaults.headers.common['Authorization'] = undefined;
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
    jxios.put('/api/members/' + profileData?.username, editedData).then(() => {
      toast.success('프로필 정보가 변경되었습니다.');
      reload();
    });
  };

  return (
    profileData && (
      <>
        <div className='justify-Center shadow-3xl relative flex w-full flex-col items-center space-y-4 rounded-3xl border bg-white/60 p-6'>
          {editable &&
            (editMode ? (
              <label
                className='absolute bottom-5 right-5'
                htmlFor='submitbutton'
              >
                <BiSave className='h-6 w-6 text-slate-600 hover:text-cyan-500' />
              </label>
            ) : (
              <button
                className='absolute bottom-5 right-5'
                onClick={handleEdit}
              >
                <BiEdit className='h-6 w-6 text-slate-600 hover:text-cyan-500' />
              </button>
            ))}

          {editable && (
            <>
              <p className='font-bold text-info'>
                {(profileData.artistStatus === 'APPROVED' &&
                  '아티스트입니다.') ||
                  (profileData.artistStatus === 'PENDING' &&
                    '아티스트 심사중입니다.') ||
                  (profileData.artistStatus === 'NONE' &&
                    '아티스트 정보를 입력해주세요.') ||
                  '아티스트 심사가 거절되었습니다.'}
              </p>
              <input
                type='file'
                id='file'
                className='hidden'
                onChange={handleEditSubmit}
                itemType='image'
              />
              <label className='' htmlFor='file'>
                <a className='avatar'>
                  <div className='mask w-24 rounded-full bg-neutral-600 text-cyan-50 hover:bg-neutral-700 hover:bg-blend-darken'>
                    {profileData.picture ? (
                      <Image
                        className='hover:opacity-50'
                        src={profileData.picture}
                        alt='profile'
                        width={200}
                        height={200}
                      />
                    ) : (
                      <>
                        <div className='flex h-full w-full items-center justify-center'>
                          <BsFillImageFill className='absolute h-8 w-8 self-center' />
                        </div>
                      </>
                    )}
                  </div>
                </a>
              </label>
            </>
          )}
          {(editable && editMode && (
            <>
              <form
                onSubmit={handleFormSubmit}
                className='flex flex-col items-center justify-center space-y-3 divide-solid text-center text-black'
              >
                <input
                  id='name'
                  className='input-bordered input truncate text-center text-3xl font-light'
                  defaultValue={profileData.name}
                />
                <input
                  id='username'
                  className='text-md input-bordered input w-full truncate text-center font-bold'
                  defaultValue={profileData.username}
                />
                <input
                  id='introduction'
                  className='text-primary text-md input-bordered input w-full whitespace-pre-wrap text-center font-light'
                  defaultValue={profileData.introduction}
                />
                <textarea
                  id='history'
                  className='input-bordered input w-full text-left'
                  defaultValue={profileData.history}
                  rows={12}
                />
                <input
                  id='snsUrl'
                  className='input-bordered input w-full truncate text-center font-light'
                  defaultValue={profileData.snsUrl}
                />
                <input
                  id='websiteUrl'
                  className='input-bordered input w-full truncate text-center font-light'
                  defaultValue={profileData.websiteUrl}
                />
                <button id='submitbutton' type='submit' className='hidden' />
              </form>
            </>
          )) || (
            <>
              {!editable && (
                <div
                  className='tooltip tooltip-bottom indicator'
                  data-tip={
                    (profileData.artistStatus === 'APPROVED' &&
                      '아티스트입니다.') ||
                    (profileData.artistStatus === 'PENDING' &&
                      '아티스트 심사중입니다.')
                  }
                >
                  <span className='badge-secondary badge indicator-item'>
                    {(profileData.artistStatus === 'APPROVED' && (
                      <AiFillSafetyCertificate className='h-4 w-4' />
                    )) ||
                      (profileData.artistStatus === 'PENDING' && (
                        <HiOutlineDocumentSearch className='h-4 w-4' />
                      ))}
                  </span>
                  <div className='avatar'>
                    <div className='mask w-24 rounded-full bg-white/50'>
                      {profileData.picture ? (
                        <Image
                          src={profileData.picture}
                          alt='profile'
                          width={200}
                          height={200}
                        />
                      ) : (
                        <Lottie
                          animationData={ProfileAnimation}
                          className='h-24 w-24'
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className='flex flex-col items-center justify-center space-y-3 divide-solid text-center text-black'>
                <p className='truncate text-3xl font-light'>
                  {profileData.name}
                </p>
                <p className='text-md truncate font-bold'>
                  {'@' + profileData.username}
                </p>
                <p className='text-primary whitespace-pre-wrap text-xl font-light'>
                  {profileData.introduction}
                </p>
                <p className='whitespace-pre-wrap text-left'>
                  {profileData.history}
                </p>
                <div className='link space-x-3 font-black'>
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
            </>
          )}
        </div>
        {editable && (
          <div className='flex w-full justify-between'>
            <button className='btn-ghost btn' onClick={handleLogout}>
              로그아웃
            </button>
            <button
              className='btn-ghost btn text-error'
              onClick={handleDeleteMember}
            >
              회원탈퇴
            </button>
          </div>
        )}
      </>
    )
  );
};

export default ProfileCard;
