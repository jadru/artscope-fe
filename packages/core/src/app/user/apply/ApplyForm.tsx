'use client';

import { Card, CardBody, Tab, Tabs } from '@nextui-org/react';
import React from 'react';

import ArtistForm from '@/app/user/apply/ArtistForm';
import CuratorForm from '@/app/user/apply/CuratorForm';

const SignupForm = () => {
  return (
    <Tabs aria-label='Options' fullWidth defaultSelectedKey='artist'>
      <Tab key='artist' title='작가 Artist'>
        <Card>
          <CardBody>
            <ArtistForm />
          </CardBody>
        </Card>
      </Tab>
      <Tab key='curator' title='기획자 Curator'>
        <Card>
          <CardBody>
            <CuratorForm />
          </CardBody>
        </Card>
      </Tab>
    </Tabs>
  );
};

export default SignupForm;
