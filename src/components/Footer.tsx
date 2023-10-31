import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='flex h-24 w-full flex-col items-center justify-center border-y bg-default-100'>
      <Link
        href='https://jadru.notion.site/Artscope-5d99f78df8c64d019bd21a02eb1f80d2?pvs=4'
        target='_blank'
      >
        커뮤니티 이용약관
      </Link>
      <p className='text-md px-8 text-center font-bold text-gray-600'>
        © 2023 Artscope by Media Xi from Busan
        <br /> All rights reserved.
      </p>
    </footer>
  );
}
