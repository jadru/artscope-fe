'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import Title from '@/components/Title';

import ApplyForm from '@/app/user/apply/ApplyForm';
import { useUser } from '@/states';

export default function UserApply() {
  const { user } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (user?.roleStatus !== 'NONE') {
      router.push('/user/settings');
    }
  }, [user, router]);
  return (
    <>
      <Title
        title='회원 정보 입력'
        description='작가님, 또는 기획자님의 정보를 입력해주세요.'
      />
      <ApplyForm />
    </>
  );
}
