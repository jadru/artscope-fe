import RecentAgoraWidget from '@/app/(main)/(list)/(feed)/RecentAgoraWidget';
import RecentArtworkWidget from '@/app/(main)/(list)/(feed)/RecentArtworkWidget';
import RecentEventWidget from '@/app/(main)/(list)/(feed)/RecentEventWidget';
import RecentPostWidget from '@/app/(main)/(list)/(feed)/RecentPostWidget';

export default function SidebarWidget() {
  return (
    <div className='h-full w-full space-y-2 self-start'>
      <RecentPostWidget />
      <RecentArtworkWidget />
      <RecentEventWidget />
      <RecentAgoraWidget />
    </div>
  );
}
