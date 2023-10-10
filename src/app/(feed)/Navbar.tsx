'use client';

import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@nextui-org/react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { BiSearch } from 'react-icons/bi';

import LoginModal from '@/app/(feed)/LoginModalButton';
import Logo from '@/assets/images/logo_long.svg';
import {
  NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_MEDIA_STORAGE_URL,
} from '@/constant/env';

import { profileApiResponseType } from '@/types';

export default function NavBar({
  theme,
  user,
  isLoading,
}: {
  theme: 'light' | 'dark';
  isLoading?: boolean;
  user?: profileApiResponseType;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { push } = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      name: '피드',
      url: '/',
    },
    {
      name: '작품',
      url: '/artwork',
    },
    {
      name: '이벤트',
      url: '/event',
    },
    {
      name: '네트워크',
      url: '/network',
    },
    {
      name: '매거진',
      url: '/magazine',
    },
  ];

  return (
    <Navbar
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
          <Link
            href='/'
            className='group box-border flex flex-grow basis-0 flex-row flex-nowrap items-center justify-start whitespace-nowrap bg-transparent text-medium no-underline'
          >
            <Logo className='mt-2 h-24 w-36 overflow-hidden fill-black transition duration-100 group-hover:fill-blue-500' />
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className='hidden gap-4 sm:flex' justify='center'>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              color={
                index === 0
                  ? pathname === '/'
                    ? 'primary'
                    : 'foreground'
                  : pathname.startsWith(item.url)
                  ? 'primary'
                  : 'foreground'
              }
              className='w-full text-lg'
              href={item.url === '/' ? item.url : item.url + 's'}
              size='lg'
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarContent>
      <NavbarContent justify='end'>
        <NavbarItem>
          <Link href='/search'>
            <Button
              variant='light'
              startContent={<BiSearch className='mt-0.5 h-5 w-5' />}
            >
              검색
            </Button>
          </Link>
        </NavbarItem>
        {!isLoading &&
          (!user ? (
            <NavbarItem className='hidden md:inline'>
              <LoginModal
                btnText='로그인 / 회원가입'
                title='구글로 로그인 / 회원가입'
                description={
                  <>
                    <p>아티스트 커뮤니티에 참여하세요</p>
                    <p>
                      창의력이 핵심인 <b>아티스트</b>들의 커뮤니티에 함께하세요.
                      전국의 다양한 예술가들과 네트워크를 구축하고 함께 일하며
                      성장하세요.
                    </p>
                    <p>
                      포트폴리오를 만드세요. 예술가들의 포트폴리오를 쉽게 만들
                      수 있게 도와줍니다.
                    </p>
                    <p>
                      좋은 <b>전시 기획자</b>를 만나보세요. 전시에 참여하고 싶은
                      예술가들을 쉽게 찾을 수 있습니다.
                    </p>
                  </>
                }
                link={NEXT_PUBLIC_API_URL + '/oauth2/authorization/google'}
              />
            </NavbarItem>
          ) : (
            <Dropdown placement='bottom-end'>
              <DropdownTrigger>
                <Avatar
                  as='button'
                  color='secondary'
                  className='transition-transform'
                  name={user.name}
                  size='sm'
                  src={
                    user.picture.startsWith('http')
                      ? user.picture
                      : NEXT_PUBLIC_MEDIA_STORAGE_URL + '/' + user.picture ||
                        undefined
                  }
                />
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
          ))}
      </NavbarContent>
      <NavbarMenu>
        {!isLoading &&
          (!user ? (
            <LoginModal
              btnText='로그인 / 회원가입'
              title='구글로 로그인 / 회원가입'
              description={
                <>
                  <p>아티스트 커뮤니티에 참여하세요</p>
                  <p>
                    창의력이 핵심인 <b>아티스트</b>들의 커뮤니티에 함께하세요.
                    전국의 다양한 예술가들과 네트워크를 구축하고 함께 일하며
                    성장하세요.
                  </p>
                  <p>
                    포트폴리오를 만드세요. 예술가들의 포트폴리오를 쉽게 만들 수
                    있게 도와줍니다.
                  </p>
                  <p>
                    좋은 <b>전시 기획자</b>를 만나보세요. 전시에 참여하고 싶은
                    예술가들을 쉽게 찾을 수 있습니다.
                  </p>
                </>
              }
              link={NEXT_PUBLIC_API_URL + '/oauth2/authorization/google'}
            />
          ) : (
            <div></div>
          ))}
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              color={
                index === 0
                  ? pathname === '/'
                    ? 'primary'
                    : 'foreground'
                  : pathname.startsWith(item.url.slice(0, -1))
                  ? 'primary'
                  : 'foreground'
              }
              className='w-full'
              href={item.url === '/' ? item.url : item.url + 's'}
              size='lg'
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
