import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';
import Title from '@/components/Title';

const EmailVerificationPage = () => {
  return (
    <>
      <Seo templateTitle='이메일 검증' />
      <NavBar />
      <TabLayout classNameChild='space-y-2'>
        <Title>
          Verification with Email
          <br />
          이메일 검증
        </Title>
        <p className='text-center'>이메일 앱을 열어 이메일을 확인해주세요.</p>
      </TabLayout>
      <BottomBar tab='profile' />
      <Footer />
    </>
  );
};

export default EmailVerificationPage;
