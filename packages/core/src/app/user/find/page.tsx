import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function FindPWID() {
  return (
    <div className='w-full flex flex-col gap-2'>
      <Link href='/user/find/username'>
        <Button color='primary' size='lg'>
          아이디 찾기
        </Button>
      </Link>
      <Link href='/user/find/password'>
        <Button color='warning' size='lg'>
          비밀번호 찾기
        </Button>
      </Link>
    </div>
  );
}
