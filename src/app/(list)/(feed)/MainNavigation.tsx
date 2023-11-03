import { useRouter } from 'next/navigation';
import {
  BiSearch,
  BiSolidCalendar,
  BiSolidHome,
  BiSolidNetworkChart,
  BiSolidNews,
  BiSolidPlanet,
  BiSolidZap,
} from 'react-icons/bi';

export default function MainNavigation() {
  const { push } = useRouter();
  return (
    <>
      <div className='hidden h-max w-full flex-col space-y-2.5 px-3 py-3 md:block'>
        <button
          className='flex w-full rounded-3xl px-4 pb-1 pt-2 text-left text-black transition hover:bg-default-100'
          onClick={() => push('/')}
        >
          <BiSolidHome size={23} className='my-0.5 mr-2' />
          <p className='my-1 text-lg'>홈</p>
        </button>
        <button
          className='flex w-full rounded-3xl px-4 pb-1 pt-2 text-left text-black transition hover:bg-default-100'
          onClick={() => push('/search')}
        >
          <BiSearch size={23} className='my-0.5 mr-2' />
          <p className='my-1 text-lg'>검색</p>
        </button>
        <button
          className='flex w-full rounded-3xl px-4 pb-1 pt-2 text-left text-black transition hover:bg-default-100'
          onClick={() => push('/artworks')}
        >
          <BiSolidZap size={23} className='my-0.5 mr-2' />
          <p className='my-1 text-lg'>작품</p>
        </button>
        <button
          className='flex w-full rounded-3xl px-4 pb-1 pt-2 text-left text-black transition hover:bg-default-100'
          onClick={() => push('/events')}
        >
          <BiSolidCalendar size={23} className='my-0.5 mr-2' />
          <p className='my-1 text-lg'>이벤트</p>
        </button>
        <button
          className='flex w-full rounded-3xl px-4 pb-1 pt-2 text-left text-black transition hover:bg-default-100'
          onClick={() => push('/agora')}
        >
          <BiSolidNetworkChart size={23} className='my-0.5 mr-2' />
          <p className='my-1 text-lg'>아고라</p>
        </button>
        <button
          className='flex w-full rounded-3xl px-4 pb-1 pt-2 text-left text-default-500 transition'
          disabled
        >
          <BiSolidPlanet size={23} className='my-0.5 mr-2' />
          <p className='my-1 text-lg'>네트워크</p>
        </button>
        <button
          className='flex w-full rounded-3xl px-4 pb-1 pt-2 text-left text-default-500 transition'
          disabled
        >
          <BiSolidNews size={23} className='my-0.5 mr-2' />
          <p className='my-1 text-lg'>매거진</p>
        </button>
      </div>
    </>
  );
}
