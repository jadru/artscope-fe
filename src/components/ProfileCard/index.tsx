import Lottie from 'lottie-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Cookies } from 'react-cookie';
import { AiFillSafetyCertificate, AiOutlineFileImage } from 'react-icons/ai';
import { BiEdit, BiSave } from 'react-icons/bi';
import { HiOutlineDocumentSearch } from 'react-icons/hi';
import { ImCancelCircle } from 'react-icons/im';
import { toast } from 'react-toastify';

import jxios from '@/utils/jxios';

import { profileApiRequestType, profileApiType } from '@/types';

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
  const [formData, setFormData] = React.useState<profileApiRequestType>({});
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

  return (
    profileData && (
      <>
        <div className='relative flex w-full flex-col items-center justify-center space-y-4 border-2 border-black/50 p-6 dark:border-white/30 dark:text-gray-100'>
          {editable &&
            (editMode ? (
              <>
                <button
                  className='absolute bottom-5 right-12'
                  onClick={() => setEditMode(false)}
                >
                  <ImCancelCircle className='h-6 w-6 text-slate-600 hover:text-cyan-500' />
                </button>
                <label
                  className='absolute bottom-5 right-5'
                  htmlFor='submitbutton'
                >
                  <BiSave className='h-6 w-6 text-slate-600 hover:text-cyan-500' />
                </label>
              </>
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
                  (profileData.artistStatus === 'REJECTED' &&
                    '아티스트 심사가 거절되었습니다.') ||
                  (profileData.artistStatus === 'NONE' && (
                    <Link className='btn-secondary btn' href='/artist/info'>
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
                        width={150}
                        height={150}
                        className='object-cover'
                      />
                    ) : (
                      <Lottie
                        animationData={ProfileAnimation}
                        className='w-full'
                      />
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
            </>
          )}
          {(editable && editMode && (
            <>
              <form
                onSubmit={handleFormSubmit}
                className='flex flex-col items-center justify-center space-y-3 divide-solid text-center text-black dark:text-gray-100'
              >
                <input
                  id='name'
                  className='input-bordered input truncate text-center text-3xl font-light'
                  defaultValue={profileData.name}
                  onChange={handleFormChange}
                />
                <p className='text-md truncate font-bold'>
                  {'@' + profileData.username}
                </p>
                {profileData.artistStatus === 'NONE' ? (
                  <Link className='btn-secondary btn' href='/artist/info'>
                    아티스트 정보 입력
                  </Link>
                ) : (
                  <>
                    <input
                      id='introduction'
                      className='text-primary text-md input-bordered input w-full whitespace-pre-wrap text-center font-light'
                      defaultValue={profileData.introduction}
                      onChange={handleFormChange}
                    />
                    <textarea
                      id='history'
                      className='input-bordered input w-full text-left'
                      defaultValue={profileData.history}
                      onChange={handleFormChange}
                      rows={12}
                    />
                    <input
                      id='snsUrl'
                      className='input-bordered input w-full truncate text-center font-light'
                      defaultValue={profileData.snsUrl}
                      onChange={handleFormChange}
                    />
                    <input
                      id='websiteUrl'
                      className='input-bordered input w-full truncate text-center font-light'
                      defaultValue={profileData.websiteUrl}
                      onChange={handleFormChange}
                    />
                  </>
                )}

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
                      '아티스트 심사중입니다.') ||
                    (profileData.artistStatus === 'REJECTED' && '') ||
                    (profileData.artistStatus === 'NONE' && '')
                  }
                >
                  <span className='indicator-center indicator-bottom badge-secondary badge indicator-item'>
                    {(profileData.artistStatus === 'APPROVED' && (
                      <AiFillSafetyCertificate className='h-4 w-4' />
                    )) ||
                      (profileData.artistStatus === 'PENDING' && (
                        <HiOutlineDocumentSearch className='h-4 w-4' />
                      ))}
                  </span>
                  <div className='group avatar h-24 w-24'>
                    <div className='mask rounded-full border'>
                      {profileData.picture ? (
                        <Image
                          src={profileData.picture}
                          alt='profile'
                          width={150}
                          height={150}
                          className='object-cover'
                        />
                      ) : (
                        <Lottie
                          animationData={ProfileAnimation}
                          className='w-full'
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className='flex flex-col items-center justify-center space-y-3 divide-solid text-center text-black dark:text-gray-100'>
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
