import Link from 'next/link';

import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';
import Title from '@/components/Title';

const RedirectOAuth2 = () => {
  return (
    <>
      <Seo templateTitle='구글 로그인 실패'></Seo>
      <NavBar />
      <TabLayout classNameChild='space-y-2'>
        <Title>
          Failed to login with Google
          <br />
          구글 로그인이 실패되었습니다.
        </Title>
        <Link href='/user/auth/login' className='btn btn-primary'>
          로그인
        </Link>
      </TabLayout>
      <BottomBar tab='profile' />
      <Footer />
    </>
  );
};

export default RedirectOAuth2;
