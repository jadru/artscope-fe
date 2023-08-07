import Link from 'next/link';
import { useRouter } from 'next/router';

import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';
import Title from '@/components/Title';

const RedirectOAuth2 = () => {
  const { query } = useRouter();
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
        <p className='text-center'>
          {query.error ? query.error : '다시 구글 로그인을 해주세요.'}
        </p>
        <Link href='/user/login' className='btn-primary btn'>
          로그인
        </Link>
      </TabLayout>
      <BottomBar tab='profile' />
      <Footer />
    </>
  );
};

export default RedirectOAuth2;
