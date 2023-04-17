import Link from 'next/link';
import React from 'react';

interface Props {
  title?: string;
  className?: string;
  onSearchClick?: () => void;
  dark?: boolean;
}

export const NavBar: React.FC<Props> = ({
  // eslint-disable-next-line
  title,
  className,
  onSearchClick,
  dark = false,
}) => (
  <div
    className={`navbar fixed z-50 ${
      !dark ? 'bg-white/60' : 'bg-black/50 text-gray-200'
    } backdrop-blur-md dark:bg-base-100 ${className}`}
  >
    <div className='navbar-start' />
    <div className='navbar-center'>
      <Link className='btn-ghost btn text-xl font-bold normal-case' href='/'>
        Artscope
      </Link>
    </div>
    <div className='navbar-end'>
      {onSearchClick && (
        <button
          className='btn-ghost btn-circle btn dark:text-base-content'
          onClick={onSearchClick}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
        </button>
      )}
    </div>
  </div>
);
