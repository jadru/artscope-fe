'use client';

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@nextui-org/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import ASNextImage from '@/components/ASNextImage';
import LoginModal from '@/components/Navbar/LoginModalButton';
import { menuItems } from '@/components/Navbar/Menus';

import Logo from '@/assets/images/logo_long.svg';
import { NEXT_PUBLIC_API_URL } from '@/constant/env';
import { useUser } from '@/states';

export default function Index({
  theme,
}: {
  theme: 'light' | 'dark';
  isLoading?: boolean;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { push } = useRouter();
  const { user, isLogin } = useUser();
  const pathname = usePathname();

  return (
    <Navbar
      isMenuOpen={isMobileMenuOpen}
      onMenuOpenChange={setIsMobileMenuOpen}
      maxWidth='xl'
      motionProps={{
        animate: {
          x: 100,
        },
        transition: { delay: 1 },
      }}
      className={`${
        theme === 'light'
          ? 'bg-white text-default-900'
          : 'bg-default-900 text-white'
      } border-b border-default-200`}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          className='md:hidden'
        />
        <NavbarBrand>
          <div
            onClick={() => push('/')}
            className='group box-border flex flex-grow basis-0 cursor-pointer flex-row flex-nowrap items-center justify-start whitespace-nowrap bg-transparent text-medium no-underline'
          >
            <Logo className='h-20 w-24 overflow-hidden fill-[#22bce0] transition duration-100 group-hover:fill-secondary' />
          </div>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className='hidden gap-4 sm:flex' justify='center'>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              href={item.url}
              className={`w-full cursor-pointer text-lg transition hover:font-bold hover:text-black ${
                index === 0
                  ? pathname === '/'
                    ? 'text-primary'
                    : 'text-default-800'
                  : pathname.startsWith(item.slug)
                  ? 'text-primary'
                  : 'text-default-800'
              }`}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarContent>
      <NavbarContent justify='end'>
        {isLogin === undefined ? (
          <></>
        ) : !user ? (
          <NavbarItem className='hidden md:inline'>
            <LoginModal
              btnText='로그인 / 회원가입'
              title='로그인 / 회원가입'
              link={NEXT_PUBLIC_API_URL + '/oauth2/authorization/google'}
            />
          </NavbarItem>
        ) : (
          <Dropdown placement='bottom-end'>
            <DropdownTrigger>
              <button>
                <ASNextImage
                  className='h-10 w-10 transform rounded-full border-2 border-default-500 object-cover transition-transform hover:scale-110 hover:border-primary'
                  alt={user.name}
                  width={32}
                  height={32}
                  src={user.picture ?? 'prod/images/default.jpg'}
                />
              </button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label='Profile Actions'
              variant='flat'
              onAction={(key) => {
                switch (key) {
                  case 'profile':
                    push('/profile/' + user.username);
                    break;
                  case 'settings':
                    push('/user/settings');
                    break;
                  case 'feedback':
                    push('https://ad21pifdjli.typeform.com/to/kg4KHrj4');
                    break;
                  case 'logout':
                    push('/user/signout');
                    break;
                }
              }}
            >
              <DropdownItem key='profile' className='h-14 gap-1'>
                <p className='text-lg font-semibold'>{user.name}</p>
                <p className='font-semibold'>@{user.username}</p>
              </DropdownItem>
              <DropdownItem key='settings'>설정</DropdownItem>
              <DropdownItem key='feedback'>피드백</DropdownItem>
              <DropdownItem key='logout' color='danger'>
                로그아웃
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </NavbarContent>
      <NavbarMenu>
        {isLogin === undefined ? (
          <></>
        ) : !isLogin ? (
          <LoginModal
            btnText='로그인 / 회원가입'
            title='구글로 로그인 / 회원가입'
            link={NEXT_PUBLIC_API_URL + '/oauth2/authorization/google'}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        ) : (
          <div></div>
        )}

        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              href={item.url}
              className={`w-full cursor-pointer text-lg hover:font-bold hover:text-secondary ${
                index === 0
                  ? pathname === '/'
                    ? 'text-primary'
                    : 'text-default-800'
                  : pathname.startsWith(item.slug)
                  ? 'text-primary'
                  : 'text-default-800'
              }`}
              onClick={() => {
                setIsMobileMenuOpen(false);
              }}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
