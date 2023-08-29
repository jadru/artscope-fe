'use client';

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/react';
import Link from 'next/link';

import LoginModal from '@/app/new/LoginModalButton';

export default function NavBar() {
  return (
    <Navbar>
      <NavbarBrand>
        <Logo />
        <p className='font-bold text-inherit'>Artscope</p>
      </NavbarBrand>
      <NavbarContent className='hidden gap-4 sm:flex' justify='center'>
        <NavbarItem>
          <Link color='foreground' href='#'>
            소개
          </Link>
        </NavbarItem>
        <NavbarItem>
          {/* <Link href='#' aria-current='page'> */}
          <Link color='foreground' href='#'>
            작가
          </Link>
        </NavbarItem>
      </NavbarContent>
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
                  포트폴리오를 만드세요. 예술가들의 포트폴리오를 쉽게 만들 수
                  있게 도와줍니다.
                </p>
                <p>
                  좋은 <b>전시 기획자</b>를 만나보세요. 전시에 참여하고 싶은
                  예술가들을 쉽게 찾을 수 있습니다.
                </p>
              </>
            }
            link='/login'
          />
        </NavbarItem>
      </NavbarContent>
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
