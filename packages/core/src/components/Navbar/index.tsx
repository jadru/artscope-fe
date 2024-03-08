'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

import Logo from '@/assets/images/logo_long.svg';

export default function Navbar({ light = true }: { light?: boolean }) {
  const prevScrollY = useRef(0);
  const [logoVisible, setLogoVisible] = useState(true);
  const logoRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (scrollY > prevScrollY.current) {
        if (scrollY > 100) {
          setLogoVisible(false);
        }
      } else {
        if (scrollY - prevScrollY.current < -5) {
          setLogoVisible(true);
        }
      }

      prevScrollY.current = scrollY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className='text-medium group box-border py-8 basis-0 flex-row items-center flex-nowrap justify-start whitespace-nowrap bg-transparent no-underline flex fixed top-0'>
      <Logo
        ref={logoRef}
        className={`group-hover:fill-blue-500 w-40 lg:w-52 overflow-hidden ${
          light ? 'fill-white' : 'fill-black'
        } pl-6 transition duration-500 ease-in-out ${
          logoVisible
            ? 'opacity-100 translate-y-0 cursor-pointer'
            : '-translate-y-full opacity-0'
        }`}
        style={{
          opacity: logoVisible ? 1 : 0,
        }}
        onClick={() => {
          logoVisible && router.push('/');
        }}
      />
      <div className='menu'>{/* 메뉴 아이템들 */}</div>
    </div>
  );
}
