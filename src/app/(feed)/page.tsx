import RootLayout from '@/components/RootLayout';

import Feed from '@/app/(feed)';

export default function Page() {
  return (
    <RootLayout maxWidth='max-w-screen-sm'>
      <Feed />
    </RootLayout>
  );
}
