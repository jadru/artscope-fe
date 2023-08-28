'use client';

import Link from 'next/link';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Cookies } from 'react-cookie';
import { AiFillHome } from 'react-icons/ai';
import { BsFillBrushFill, BsFillPersonFill } from 'react-icons/bs';
import { useRecoilValue } from 'recoil';

import { userNameAndRoleAtom } from '@/states/atom';
import jxios from '@/utils/jxios';

type Props = {
  tab: 'playlist' | 'artwork' | 'upload' | 'profile' | 'login';
  dark?: boolean;
  noSpace?: boolean;
};
const BottomBar: FunctionComponent<Props> = ({
  tab = 'home',
  dark = false,
  noSpace = false,
}) => {
  const [isArtist, setIsArtist] = useState(false);
  const userValue = useRecoilValue(userNameAndRoleAtom);
  const cookies = new Cookies();
  useEffect(() => {
    if (
      jxios.defaults.headers.common['Authorization'] ||
      cookies.get('refreshToken')
    ) {
      setIsArtist(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div
      className={`${noSpace ? 'h-0' : 'pb-20 md:pb-28'} ${
        dark ? 'bg-black' : ''
      } dark:bg-dark lg:hidden`}
    >
      <div
        className={`btm-nav z-30 md:bottom-8 md:left-1/2 md:-ml-48 md:w-96 md:rounded-2xl md:shadow-xl ${
          dark ? 'bg-black/20 text-gray-100 backdrop-blur md:shadow-none' : ''
        }`}
      >
        <Link
          className={`${tab === 'playlist' ? 'text-blue-600' : ''} ${
            dark ? 'bg-transparent text-emerald-300 md:rounded-l-2xl' : ''
          }`}
          href='/'
        >
          <AiFillHome className='h-5 w-5' />
          <span className='btm-nav-label'>홈</span>
        </Link>
        {!isArtist ? (
          <>
            <Link
              className={`${tab === 'login' ? 'text-blue-600' : ''} ${
                dark ? 'bg-transparent md:rounded-r-2xl' : ''
              }`}
              href='/user/auth/login'
            >
              <BsFillPersonFill className='h-5 w-5' />
              <span className='btm-nav-label'>로그인</span>
            </Link>
          </>
        ) : (
          <>
            <Link
              className={`${tab === 'upload' ? 'text-blue-600' : ''} ${
                dark ? 'bg-transparent' : ''
              }`}
              href='/upload'
            >
              <BsFillBrushFill className='h-5 w-5' />

              <span className='btm-nav-label'>업로드</span>
            </Link>
            <Link
              className={`${tab === 'profile' ? 'text-blue-600' : ''} ${
                dark ? 'bg-transparent md:rounded-r-2xl' : ''
              }`}
              href={`/profile/${userValue.username}`}
            >
              <BsFillPersonFill className='h-5 w-5' />
              <span className='btm-nav-label'>프로필</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default BottomBar;
