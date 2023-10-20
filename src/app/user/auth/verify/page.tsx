'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AiOutlineMail } from 'react-icons/ai';

export default function EmailVerification() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  return (
    <>
      <h2>
        <AiOutlineMail
          size={60}
          className='drop-shadow-glow animate-flicker mx-auto text-blue-500'
        />
      </h2>
      <h2>{email}로 보낸 이메일을 확인해주세요</h2>
      <h4>이메일 애플리케이션 또는 웹사이트에서 확인할 수 있습니다.</h4>
      <br />
      <Link
        href='/'
        className='rounded-2xl bg-blue-500 p-3 text-white transition-colors duration-100 hover:text-gray-500'
      >
        홈으로 가기
      </Link>
    </>
  );
}
