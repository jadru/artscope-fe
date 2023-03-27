import Link from 'next/link';
import React from 'react';

interface Props {
  title?: string;
  className?: string;
  onSearchClick?: () => void;
}

export const NavBar: React.FC<Props> = ({
  title,
  className,
  onSearchClick,
}) => (
  <div className={`navbar fixed z-50 bg-white/95 ${className}`}>
    <div className='navbar-start' />
    <div className='navbar-center'>
      <Link className='link' href='/'>
        {title ? title : 'title'}
      </Link>
    </div>
    <div className='navbar-end'>
      <button className='btn-ghost btn-circle btn' onClick={onSearchClick}>
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
    </div>
  </div>
);
