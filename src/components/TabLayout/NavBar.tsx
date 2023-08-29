import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
    label: '검색',
    href: '/search',
  },
  // {
  //   label: '작가',
  //   href: '/artists',
  // },
  // {
  //   label: '전시',
  //   href: '/exhibitions',
  // },
  // {
  //   label: '커뮤니티',
  //   href: '/community',
  // },
  {
    label: '블로그',
    href: '/blog',
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
  const { push } = useRouter();
  const asPath = usePathname();
  const handleLogout = () => {
    jxios.post('/api/logout').then(() => {
      cookies.remove('refreshToken', { path: '/' });
      jxios.defaults.headers.common['Authorization'] = undefined;
      setUserValue({
        username: undefined,
        role: undefined,
        profileImage: undefined,
      });
      push('/');
      toast.success('로그아웃 되었습니다.');
    });
  };

  return (
    <>
      <div
        className={`dark:bg-dark/80 navbar min-h-12 z-50 h-12 overflow-y-visible bg-white/80 pb-0 backdrop-blur-xl lg:min-h-16 lg:fixed lg:h-16 lg:pb-2 ${className} hidden`}
      >
        <div className='navbar-start w-full items-center md:w-1/2'>
          <Link
            className='link px-2 text-left text-2xl font-bold normal-case no-underline hover:underline'
            href='/'
          >
            <p>Artscope</p>
          </Link>
        </div>
        <div className='navbar-end space-x-2'>
          {userValue.role ? (
            <>
              <Link
                href='/upload'
                className='btn btn-ghost hidden lg:inline-flex'
              >
                업로드
                <IoCloudUploadSharp className='ml-2 inline-block h-5 w-5 stroke-current' />
              </Link>
              <div className='dropdown dropdown-end hidden lg:inline-block'>
                <label tabIndex={0} className='avatar btn btn-circle btn-ghost'>
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
                  className='menu-compact menu dropdown-content rounded-box w-52 bg-base-100 p-2 shadow'
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
              <Link href='/user/auth/login' className='btn btn-ghost'>
                로그인
              </Link>
            </ul>
          )}
        </div>
      </div>
      <div
        className={`min-h-14 dark:bg-dark/90 navbar sticky top-0 z-50 flex hidden h-12 w-full items-center justify-start space-x-2.5 px-4 backdrop-blur-xl lg:fixed lg:left-1/2 lg:w-auto lg:translate-x-[-50%] lg:bg-transparent lg:backdrop-blur-none ${
          !dark ? 'bg-white/80' : 'bg-black/90 text-gray-200 dark:bg-black/90'
        } ${transparent ? 'bg-transparent' : ''} ${className}`}
      >
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
    </>
  );
};
