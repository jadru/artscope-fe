'use client';

import { debounce } from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { BiMenu, BiX } from 'react-icons/bi';

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

    window.addEventListener('scroll', debounce(handleScroll, 10));

    return () => {
      window.removeEventListener('scroll', debounce(handleScroll, 50));
    };
  }, []);

  return (
    <>
      <div
        className={`px-6 box-border py-6 lg:py-8 items-center justify-between flex fixed top-0 w-full transition duration-500 ease-in-out ${
          logoVisible ? 'opacity-100 cursor-pointer' : 'opacity-0'
        }`}>
        <span
          className={`font-logo hover:text-[#b9cdd1] text-4xl lg:text-5xl -tracking-[.05em] overflow-hidden ${
            light ? 'text-gray-300/70' : 'text-gray-700/70'
          } transition duration-200`}
          onClick={() => {
            if (logoVisible) {
              router.push('/');
              setMenuVisible(false);
            }
          }}>
          ARTSCOPE
        </span>
        <button
          className={`overflow-hidden transition duration-200 hover:text-[#b9cdd1] ${
            light ? 'text-gray-300/70' : 'text-gray-700/70'
          }`}
          onClick={() => setMenuVisible(true)}>
          <BiMenu size={48} />
        </button>
      </div>
      {menuVisible && (
        <div className='fixed right-0 top-0 h-screen w-full lg:w-1/2 bg-[#F2EBD7] text-black p-8 flex flex-col z-50'>
          <button
            className='hover:text-[#b9cdd1] overflow-hidden transition duration-200 text-black absolute top-8 right-6'
            onClick={() => setMenuVisible(false)}>
            <BiX size={48} />
          </button>
          <Link
            onClick={() => setMenuVisible(false)}
            href='/editor'
            className='text-4xl hover:text-[#b9cdd1] transition duration-100'>
            EDITOR
          </Link>
          <Link
            onClick={() => setMenuVisible(false)}
            href='/about'
            className='text-4xl hover:text-[#b9cdd1] transition duration-100'>
            ABOUT
          </Link>
          {user ? (
            <>
              <Link
                onClick={() => setMenuVisible(false)}
                href='/user/signout'
                className='text-4xl hover:text-[#b9cdd1] transition duration-100'>
                LOGOUT
              </Link>
              <Link
                href={`/profile/${user.username}`}
                onClick={() => setMenuVisible(false)}>
                <div className='text-4xl hover:text-[#b9cdd1] transition duration-100'>
                  PROFILE
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link
                onClick={() => setMenuVisible(false)}
                href='/user/login'
                className='text-4xl hover:text-[#b9cdd1] transition duration-100'>
                LOGIN
              </Link>
            </>
          )}
        </div>
      )}
    </>
  );
}
