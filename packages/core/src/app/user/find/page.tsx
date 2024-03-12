import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { AiOutlineMail } from 'react-icons/ai';
import { MdPassword } from 'react-icons/md';

export default function FindPWID() {
  return (
    <div className='w-full flex flex-col gap-2'>
      <Link href='/user/find/username'>
        <Button
          color='primary'
          variant='solid'
          fullWidth
          size='lg'
          startContent={<AiOutlineMail size={23} />}>
          아이디 찾기
        </Button>
      </Link>
      <Link href='/user/find/password'>
        <Button
          color='warning'
          variant='solid'
          fullWidth
          size='lg'
          startContent={<MdPassword size={23} />}>
          비밀번호 찾기
        </Button>
      </Link>
    </div>
  );
}
