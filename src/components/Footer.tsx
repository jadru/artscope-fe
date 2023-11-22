import { Divider } from '@nextui-org/react';
import Link from 'next/link';
import { FiCompass, FiInstagram } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className='flex h-24 w-full flex-col items-center justify-center gap-1 border-y bg-default-100'>
      <div className='flex items-center gap-2'>
        <Link
          href='https://jadru.notion.site/Artscope-5d99f78df8c64d019bd21a02eb1f80d2?pvs=4'
          target='_blank'
          className='font-bold hover:text-primary'
        >
          가이드
        </Link>
        <Link
          href='https://forms.gle/F9V9gppnKXXBRE4d6'
          target='_blank'
          className='font-bold hover:text-primary'
        >
          피드백
        </Link>
        <Link
          href='https://www.plip.kr/pcc/1bdbcbd7-0bde-4101-8ce2-cc4e1fc53eef/privacy-policy'
          target='_blank'
          className='font-bold hover:text-primary'
        >
          개인정보 처리방침
        </Link>
        <Divider orientation='vertical' />
        <Link
          href='https://www.instagram.com/artscope.kr/'
          target='_blank'
          className='flex items-center gap-0.5 hover:text-primary'
        >
          <FiInstagram size={20} />
        </Link>
        <Link
          href='https://mediaxi.kr/'
          target='_blank'
          className='flex items-center gap-0.5 hover:text-primary'
        >
          <FiCompass size={20} />
        </Link>
      </div>
      <p className='text-md px-8 text-center text-gray-600'>
        © 2023 Artscope by Media Xi from Busan
        <br /> All rights reserved.
      </p>
    </footer>
  );
}
