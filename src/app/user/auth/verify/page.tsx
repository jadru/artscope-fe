'use client';

import { Button } from '@nextui-org/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AiOutlineMail } from 'react-icons/ai';

export default function EmailVerification() {
  const searchParams = useSearchParams();
  const { push } = useRouter();
  const email = searchParams.get('email');
  return (
    <>
      <h2>
        <AiOutlineMail
          size={65}
          className='drop-shadow-blue-500 mx-auto my-8 animate-pulse text-blue-500 drop-shadow-2xl'
        />
      </h2>
      <h2>{email}로 보낸 이메일을 확인해주세요</h2>
      <h4>이메일 애플리케이션 또는 웹사이트에서 확인할 수 있습니다.</h4>
      <br />
      <Button onClick={() => push('/')} color='primary'>
        홈으로 가기
      </Button>
    </>
  );
}
