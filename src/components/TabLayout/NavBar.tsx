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

const Menus = [
  {
    label: '작품',
    href: '/artwork',
  },
  {
    label: '작가',
    href: '/artists',
  },
  {
    label: '전시',
    href: '/exhibitions',
  },
  {
    label: '커뮤니티',
    href: '/community',
  },
];

export const NavBar: React.FC<Props> = ({
  className,
  dark = false,
  transparent = false,
}) => {
  useAuth();
  const [userValue, setUserValue] = useRecoilState(userNameAndRoleAtom);
  const cookies = new Cookies();
  const { push, asPath } = useRouter();
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
      className={`min-h-14 navbar fixed z-50 h-24 flex-col border-b md:h-14 md:flex-row ${
        !dark ? 'bg-white' : 'bg-black text-gray-200'
      } ${transparent ? 'bg-transparent' : 'dark:bg-dark/70'} ${className}`}
    >
      <div className='navbar-start w-full md:w-1/2'>
        <Link
          className='btn-ghost btn px-2 text-left text-2xl font-bold normal-case'
          href='/'
        >
          Artscope
        </Link>
      </div>
      <div className='navbar-center w-full space-x-2.5 px-2 md:w-auto'>
        {Menus.map((menu) => (
          <Link
            href={menu.href}
            key={menu.label}
            className={`link text-2xl font-bold ${
              asPath.startsWith(menu.href) ? 'underline' : 'no-underline'
            } hover:underline`}
          >
            {menu.label}
          </Link>
        ))}
      </div>
      <div className='navbar-end space-x-2'>
        {userValue.role ? (
          <>
            <Link
              href='/upload'
              className='btn-ghost btn hidden lg:inline-flex'
            >
              업로드
              <IoCloudUploadSharp className='ml-2 inline-block h-5 w-5 stroke-current' />
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
                className='dropdown-content menu rounded-box menu-compact w-52 bg-base-100 p-2 shadow'
              >
                <li>
                  <Link
                    className='justify-between'
                    href={`/profile/${userValue.username}`}
                  >
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
            <Link href='/user/login' className='btn-ghost btn'>
              로그인
            </Link>
          </ul>
        )}
      </div>
    </div>
  );
};
