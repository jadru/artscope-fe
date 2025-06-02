import Link from 'next/link';
import { FiCompass, FiInstagram } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className='bg-default-100 flex w-full flex-col items-center justify-center gap-1 pt-2'>
      <div className='text-default-500 flex items-center justify-center gap-2 flex-wrap space-y-0.5'>
        <Link
          href='https://jadru.notion.site/Artscope-5d99f78df8c64d019bd21a02eb1f80d2?pvs=4'
          target='_blank'
          className='hover:text-primary text-[0.88rem]'>
          가이드
        </Link>
        <Link
          href='https://jadru.notion.site/Artscope-6cd68452a7114d4facc175d70d20443b?pvs=4'
          target='_blank'
          className='hover:text-primary text-[0.88rem]'>
          이용 약관
        </Link>
        <Link
          href='https://forms.gle/F9V9gppnKXXBRE4d6'
          target='_blank'
          className='hover:text-primary text-[0.88rem]'>
          피드백
        </Link>
        <Link
          href='https://plip.kr/pcc/1bdbcbd7-0bde-4101-8ce2-cc4e1fc53eef/privacy-policy'
          target='_blank'
          className='hover:text-primary text-[0.88rem]'>
          개인정보 처리방침
        </Link>
      </div>
      <div className='text-default-500 flex justify-center gap-1 pb-12'>
        <Link
          href='https://www.instagram.com/artscope.kr/'
          target='_blank'
          className='hover:text-primary flex items-center gap-0.5'>
          <FiInstagram size={18} />
        </Link>
        <Link
          href='https://mediaxi.kr/'
          target='_blank'
          className='hover:text-primary flex items-center gap-0.5'>
          <FiCompass size={18} />
        </Link>
        <p className='px-2 text-center text-[0.88rem]'>© 2024 Artscope.</p>
      </div>
    </footer>
  );
}
