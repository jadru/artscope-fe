import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Cookies } from 'react-cookie';
import { IoCloudUploadSharp, IoPersonCircleOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { useRecoilState } from 'recoil';

import useAuth from '@/hooks/useAuth';

import { userNameAndRoleAtom } from '@/states/atom';
import jxios from '@/utils/jxios';

interface Props {
  title?: string;
  className?: string;
  dark?: boolean;
  transparent?: boolean;
}

export const NavBar: React.FC<Props> = ({
  className,
  dark = false,
  transparent = false,
}) => {
  useAuth();
  const [userValue, setUserValue] = useRecoilState(userNameAndRoleAtom);
  const cookies = new Cookies();
  const { push } = useRouter();
  const handleLogout = () => {
    jxios.post('/api/logout').then(() => {
      cookies.remove('refreshToken', { path: '/' });
      jxios.defaults.headers.common['Authorization'] = undefined;
      setUserValue({
        username: undefined,
        role: undefined,
        profileImage: undefined,
      });
      push('/').then(() => toast.success('로그아웃 되었습니다.'));
    });
  };

  return (
    <div
      className={`navbar fixed z-50 ${
        !dark ? 'bg-white/70' : 'bg-black/50 text-gray-200'
      } backdrop-blur-md ${
        transparent ? 'bg-transparent' : 'dark:bg-dark/70'
      } ${className}`}
    >
      <div className='navbar-start' />
      <div className='navbar-center'>
        <Link className='btn-ghost btn text-xl font-bold normal-case' href='/'>
          Artscope
        </Link>
      </div>
      <div className='navbar-end space-x-2'>
        {userValue.role ? (
          <>
            <Link
              href='/upload'
              className='btn-ghost btn-square btn hidden lg:inline-flex'
            >
              <IoCloudUploadSharp className='inline-block h-5 w-5 stroke-current' />
            </Link>
            <div className='dropdown-end dropdown hidden lg:inline-block'>
              <label tabIndex={0} className='btn-ghost btn-circle avatar btn'>
                <div className='w-10 rounded-full'>
                  {userValue.profileImage ? (
                    <Image
                      src={userValue.profileImage}
                      width='40'
                      height='40'
                      alt='profile image'
                    />
                  ) : (
                    <IoPersonCircleOutline className='h-10 w-10 rounded-full' />
                  )}
                </div>
              </label>
              <ul
                tabIndex={0}
                className='dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow'
              >
                <li>
                  <Link className='justify-between' href='/profile'>
                    프로필
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout}>로그아웃</button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <ul className='menu menu-horizontal hidden px-1 lg:inline-block'>
            <li>
              <Link href='/login'>로그인</Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};
