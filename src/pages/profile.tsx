import jwt_decode from 'jwt-decode';
import React from 'react';

import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';

import jxios from '@/utils/jxios';

const Profile = () => {
  const decodedToken =
    jxios.defaults.headers.common.Authorization &&
    (jwt_decode(jxios.defaults.headers.common.Authorization as string) as {
      sub: string;
    });
  return (
    <>
      <Seo templateTitle='Profile' />
      <TabLayout>
        <p>{decodedToken ? decodedToken.sub : '준비중'}</p>
      </TabLayout>
      <BottomBar tab='profile' />
    </>
  );
};

export default Profile;
