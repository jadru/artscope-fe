import MainNavigation from '@/app/(list)/(feed)/MainNavigation';
import RecentArtworkWidget from '@/app/(list)/(feed)/RecentArtworkWidget';
import RecentPostWidget from '@/app/(list)/(feed)/RecentPostWidget';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className=' mx-auto flex justify-center '>
      <div className='flex w-full max-w-screen-sm md:max-w-screen-lg lg:max-w-screen-xl'>
        <div className='sticky top-11 h-max md:w-44 lg:w-52'>
          <MainNavigation />
        </div>
        <div className='w-full md:w-[calc(100%-26rem)] lg:w-[calc(100%-33rem)]'>
          {children}
        </div>
        <div className='sticky top-11 hidden h-max space-y-2 px-2 md:block md:w-60 lg:w-80'>
          <RecentPostWidget />
          <RecentArtworkWidget />
        </div>
      </div>
    </div>
  );
}
