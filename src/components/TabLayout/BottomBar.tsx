import Link from 'next/link';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { AiFillHome } from 'react-icons/ai';
import {
  BsFillBrushFill,
  BsFillGrid1X2Fill,
  BsFillPersonFill,
} from 'react-icons/bs';

import jxios from '@/utils/jxios';

type Props = {
  tab: 'playlist' | 'artwork' | 'upload' | 'profile' | 'login';
  dark?: boolean;
};
const BottomBar: FunctionComponent<Props> = ({
  tab = 'home',
  dark = false,
}) => {
  const [isArtist, setIsArtist] = useState(false);
  useEffect(() => {
    if (jxios.defaults.headers.common['Authorization']) {
      setIsArtist(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jxios.defaults.headers.common['Authorization']]);
  return (
    <div className={`pb-20 md:pb-28 ${dark ? 'bg-dark' : ''}`}>
      <div className='btm-nav z-30 md:bottom-8 md:left-1/2 md:-ml-48 md:w-96 md:rounded-2xl md:shadow-xl'>
        <Link
          className={`${tab === 'playlist' ? 'text-blue-600' : ''}`}
          href='/'
        >
          <AiFillHome className='h-5 w-5' />
          <span className='btm-nav-label'>홈</span>
        </Link>
        <Link
          className={tab !== 'artwork' ? '' : 'text-blue-600'}
          href='/artwork'
        >
          <BsFillGrid1X2Fill className='h-5 w-5' />

          <span className='btm-nav-label'>아트워크</span>
        </Link>
        {isArtist ? (
          <>
            <Link
              className={tab !== 'upload' ? '' : 'text-blue-600'}
              href='/upload'
            >
              <BsFillBrushFill className='h-5 w-5' />

              <span className='btm-nav-label'>업로드</span>
            </Link>
            <Link
              className={tab !== 'profile' ? '' : 'text-blue-600'}
              href='/profile'
            >
              <BsFillPersonFill className='h-5 w-5' />
              <span className='btm-nav-label'>프로필</span>
            </Link>
          </>
        ) : (
          <Link
            className={tab !== 'login' ? '' : 'text-blue-600'}
            href='/login'
          >
            <BsFillPersonFill className='h-5 w-5' />
            <span className='btm-nav-label'>로그인</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default BottomBar;
