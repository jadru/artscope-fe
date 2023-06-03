import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';
import Title from '@/components/Title';

import { auth } from '@/api';

const EmailConfirmPage = () => {
  const router = useRouter();
  const [valid, setValid] = useState<boolean>(false);
  useEffect(() => {
    if (router.query.code) {
      auth
        .email(router.query.code as string)
        .then(() => {
          setValid(true);
        })
        .catch(() => {
          setValid(false);
        });
    }
  }, [router.query.code]);

  return (
    <>
      <Seo templateTitle='이메일 검증 확인' />
      <NavBar />
      <TabLayout classNameChild='items-center flex-col flex space-y-2'>
        {valid ? (
          <>
            <Title>
              Verification with Email
              <br />
              이메일이 확인되었습니다
            </Title>
            <p className='text-center'>
              이메일이 확인되었습니다. <br /> 이제 로그인을 해주세요.
            </p>
            <Link href='/user/login' className='btn-primary btn'>
              로그인
            </Link>
          </>
        ) : (
          <>
            <Title>
              Error Verification with Email
              <br />
              이메일이 확인에 문제가 생겼습니다.
            </Title>
            <p className='text-center'>5분 후에 다시 회원가입을 해주세요</p>
            <Link href='/user/signup' className='btn-primary btn'>
              회원가입
            </Link>
          </>
        )}
      </TabLayout>
      <BottomBar tab='profile' />
      <Footer />
    </>
  );
};

export default EmailConfirmPage;
