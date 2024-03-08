'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { BiMenu, BiX } from 'react-icons/bi';

import Logo from '@/assets/images/logo_long.svg';
import { useUser } from '@/states';

export default function Navbar({ light = true }: { light?: boolean }) {
  const { user } = useUser();
  const prevScrollY = useRef(0);
  const [logoVisible, setLogoVisible] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
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
    <>
      <div
        className={`px-6 box-border py-8 items-center justify-between flex fixed top-0 w-full transition duration-500 ease-in-out ${
          logoVisible
            ? 'opacity-100 translate-y-0 cursor-pointer'
            : '-translate-y-full opacity-0'
        }`}>
        <Logo
          className={`hover:fill-blue-500 w-40 lg:w-52 overflow-hidden ${
            light ? 'fill-white' : 'fill-black'
          } transition duration-200`}
          onClick={() => {
            logoVisible && router.push('/');
          }}
        />
        <button
          className={`hover:text-blue-500 overflow-hidden transition duration-200 ${
            light ? 'text-white' : 'text-black'
          }`}
          onClick={() => setMenuVisible(true)}>
          <BiMenu size={48} />
        </button>
      </div>
      {menuVisible && (
        <div className='fixed right-0 top-0 h-screen w-full lg:w-1/2 bg-white text-black p-8 flex flex-col animate-fade-in'>
          <button
            className='hover:text-blue-500 overflow-hidden transition duration-200 text-black absolute top-8 right-6'
            onClick={() => setMenuVisible(false)}>
            <BiX size={48} />
          </button>
          <Link
            href='/editor'
            className='text-4xl hover:text-blue-600 transition duration-100'>
            EDITOR
          </Link>
          <Link
            href='/about'
            className='text-4xl hover:text-blue-600 transition duration-100'>
            ABOUT
          </Link>
          {user ? (
            <>
              <Link
                href='/user/signout'
                className='text-4xl hover:text-blue-600 transition duration-100'>
                LOGOUT
              </Link>
            </>
          ) : (
            <>
              <Link
                href='/user/login'
                className='text-4xl hover:text-blue-600 transition duration-100'>
                LOGIN
              </Link>
            </>
          )}
        </div>
      )}
    </>
  );
}
