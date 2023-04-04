import React from 'react';

import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';

const Profile = () => {
  return (
    <>
      <Seo templateTitle='Profile' />
      <TabLayout>
        <p>준비중</p>
      </TabLayout>
      <BottomBar tab='profile' />
    </>
  );
};

export default Profile;
