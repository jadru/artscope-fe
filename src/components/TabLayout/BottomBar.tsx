import Image from 'next/image';
import Link from 'next/link';
import React, { FunctionComponent } from 'react';

type Props = {
  tab: 'playlist' | 'artwork' | 'upload' | 'profile';
  dark?: boolean;
};
const BottomBar: FunctionComponent<Props> = ({
  tab = 'home',
  dark = false,
}) => {
  return (
    <div className={`pb-20 md:pb-28 ${dark ? 'bg-dark' : ''}`}>
      <div className='btm-nav md:bottom-8 md:left-1/2 md:-ml-48 md:w-96 md:rounded-2xl md:shadow-xl'>
        <Link
          className={`${tab === 'playlist' ? 'text-emerald-600' : ''}`}
          href='/'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            className='h-5 w-5'
          >
            <path
              fillRule='evenodd'
              d='M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z'
              clipRule='evenodd'
            />
          </svg>
          <span className='btm-nav-label'>Home</span>
        </Link>
        <Link
          className={tab !== 'artwork' ? '' : 'text-emerald-600'}
          href='/artwork'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='3.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <rect x='3' y='3' width='18' height='18' rx='2' />
            <path d='M21 12H3M12 3v18' />
          </svg>

          <span className='btm-nav-label'>ArtWork</span>
        </Link>
        <Link
          className={tab !== 'upload' ? '' : 'text-emerald-600'}
          href='/upload'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            className='h-5 w-5'
          >
            <path
              fillRule='evenodd'
              d='M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z'
              clipRule='evenodd'
            />
          </svg>

          <span className='btm-nav-label'>Upload</span>
        </Link>
        <Link
          className={tab !== 'profile' ? '' : 'text-emerald-600'}
          href='/profile'
        >
          <label tabIndex={0} className='avatar'>
            <div
              className={`${
                tab === 'profile' ? 'border-emerald-600' : ''
              } w-5 rounded-full border`}
            >
              <Image
                src='/images/profile_timcook.jpeg'
                alt='profile'
                width={20}
                height={20}
              />
            </div>
          </label>
          <span className='btm-nav-label'>Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomBar;
