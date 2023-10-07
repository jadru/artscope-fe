'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

import useUser from '@/hooks/useUser';

import Title from '@/components/Title';

import ApplyForm from '@/app/user/apply/ApplyForm';

export default function UserApply() {
  const user = useUser();
  const { push } = useRouter();

  useEffect(() => {
    if (!user) {
      push('/login');
      toast.warn('로그인 후 이용해주세요.');
    }
    if (!user?.role.includes('ROLE_GUEST')) {
      push('/');
    }
  }, [user, push]);

  return (
    <>
      <div className='mx-auto my-3 flex max-w-md flex-col items-stretch gap-2 p-4'>
        <Title>회원 정보 입력</Title>
        <ApplyForm />
      </div>
    </>
  );
}
