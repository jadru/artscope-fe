'use client';

import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import LoginModal from '@/app/LoginModalButton';
import { NEXT_PUBLIC_API_URL } from '@/constant/env';
import { userStore } from '@/states';

export default function NavBar() {
  const { user, isLoading } = userStore();
  const { push } = useRouter();
  const pathname = usePathname();
  return (
    <Navbar>
      <NavbarBrand>
        <Link
          href='/'
          className='box-border flex flex-grow basis-0 flex-row flex-nowrap items-center justify-start whitespace-nowrap bg-transparent text-medium no-underline'
        >
          <Logo />
          <p className='font-bold text-inherit'>Artscope</p>
        </Link>
      </NavbarBrand>
      <NavbarContent className='hidden gap-4 sm:flex' justify='center'>
        <NavbarItem isActive={pathname === '/'}>
          <Link color='foreground' href='/'>
            피드
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname.startsWith('/artworks')}>
          <Link color='foreground' href='/artworks'>
            작품
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname.startsWith('/exhibitions')}>
          <Link color='foreground' href='/exhibitions'>
            전시
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname.startsWith('/artists')}>
          <Link color='foreground' href='/artists'>
            작가
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname.startsWith('/spaces')}>
          <Link color='foreground' href='/spaces'>
            장소
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname.startsWith('/news')}>
          <Link color='foreground' href='/news'>
            뉴스
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname.startsWith('/magazine')}>
          <Link color='foreground' href='/magazine'>
            매거진
          </Link>
        </NavbarItem>
      </NavbarContent>
      {!isLoading &&
        (!user.username ? (
          <NavbarContent justify='end'>
            <NavbarItem>
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
          </NavbarContent>
        ) : (
          <NavbarContent as='div' justify='end'>
            <Dropdown placement='bottom-end'>
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as='button'
                  color='secondary'
                  className='transition-transform'
                  name={user.name}
                  size='sm'
                  src={user.profilePicture}
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
                      push('/settings');
                      break;
                    case 'feedback':
                      push('/feedback');
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
          </NavbarContent>
        ))}
    </Navbar>
  );
}

const Logo = () => (
  <svg fill='none' height='36' viewBox='0 0 32 32' width='36'>
    <path
      clipRule='evenodd'
      d='M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z'
      fill='currentColor'
      fillRule='evenodd'
    />
  </svg>
);
