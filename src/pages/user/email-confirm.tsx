import Link from 'next/link';

import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';
import Title from '@/components/Title';

const EmailConfirmPage = () => {
  return (
    <>
      <Seo templateTitle='이메일 검증 확인' />
      <NavBar />
      <TabLayout classNameChild='items-center flex-col flex space-y-2'>
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
      </TabLayout>
      <BottomBar tab='profile' />
      <Footer />
    </>
  );
};

export default EmailConfirmPage;
