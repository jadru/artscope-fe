import Lottie from 'lottie-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Cookies } from 'react-cookie';
import { AiFillSafetyCertificate } from 'react-icons/ai';
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
  const { push } = useRouter();

  const handleLogout = () => {
    jxios.post('/api/logout').then(() => {
      cookies.remove('refreshToken', { path: '/' });
      jxios.defaults.headers.common['Authorization'] = undefined;
      push('/').then(() => toast.success('로그아웃 되었습니다.'));
    });
  };

  return (
    profileData && (
      <>
        <div className='justify-Center shadow-3xl flex w-full flex-col items-center space-y-4 rounded-3xl border bg-white/60 p-6'>
          <div className='indicator'>
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
          <div className='flex flex-col items-center justify-center space-y-3 divide-solid text-center text-black'>
            <p className='truncate text-3xl font-light'>{profileData.name}</p>
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
          <hr />
        </div>
        {editable && (
          <button className='btn-ghost btn' onClick={handleLogout}>
            로그아웃
          </button>
        )}
      </>
    )
  );
};

export default ProfileCard;
