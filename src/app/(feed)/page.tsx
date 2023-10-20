'use client';

import { useRouter } from 'next/navigation';
import {
  BiSolidCalendar,
  BiSolidHome,
  BiSolidNews,
  BiSolidPlanet,
  BiSolidZap,
} from 'react-icons/bi';

import Feed from '@/app/(feed)';
import RecentArtworkWidget from '@/app/(feed)/RecentArtworkWidget';
import RecentPostWidget from '@/app/(feed)/RecentPostWidget';

export default function Page() {
  const { push } = useRouter();
  return (
    <div className=' mx-auto flex justify-center '>
      <div className='relative flex w-full max-w-screen-sm md:max-w-screen-lg lg:max-w-screen-xl'>
        <div className='\border-l sticky top-[60px] hidden h-max w-64 flex-col space-y-3 p-4 md:block'>
          <button
            className='flex w-full rounded-3xl px-3 pb-1 pt-2 text-left text-black transition hover:bg-default-100'
            onClick={() => push('/')}
          >
            <BiSolidHome size={30} className='mr-3' />
            <p className='my-1 text-2xl'>홈</p>
          </button>
          <button
            className='flex w-full rounded-3xl px-3 pb-1 pt-2 text-left text-black transition hover:bg-default-100'
            onClick={() => push('/artworks')}
          >
            <BiSolidZap size={30} className='mr-3' />
            <p className='my-1 text-2xl'>작품</p>
          </button>
          <button
            className='flex w-full rounded-3xl px-3 pb-1 pt-2 text-left text-default-500 transition'
            onClick={() => push('/artworks')}
            disabled
          >
            <BiSolidCalendar size={30} className='mr-3' />
            <p className='my-1 text-2xl'>이벤트</p>
          </button>
          <button
            className='flex w-full rounded-3xl px-3 pb-1 pt-2 text-left text-default-500 transition'
            disabled
          >
            <BiSolidPlanet size={30} className='mr-3' />
            <p className='my-1 text-2xl'>네트워크</p>
          </button>
          <button
            className='flex w-full rounded-3xl px-3 pb-1 pt-2 text-left text-default-500 transition'
            disabled
          >
            <BiSolidNews size={30} className='mr-3' />
            <p className='my-1 text-2xl'>매거진</p>
          </button>
        </div>
        <Feed />
        <div className='sticky top-[60px] h-max'>
          <RecentPostWidget />
          <RecentArtworkWidget />
        </div>
      </div>
    </div>
  );
}
