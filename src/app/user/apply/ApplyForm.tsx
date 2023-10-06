'use client';

import { CardBody } from '@nextui-org/card';
import { Card, Tab, Tabs } from '@nextui-org/react';
import React from 'react';

import ArtistForm from '@/app/user/apply/ArtistForm';
import CuratorForm from '@/app/user/apply/CuratorForm';
import GeneralForm from '@/app/user/apply/GeneralForm';

const SignupForm = () => {
  return (
    <Tabs aria-label='Options' fullWidth>
      <Tab key='general' title='일반 General'>
        <Card>
          <CardBody>
            <GeneralForm />
          </CardBody>
        </Card>
      </Tab>
      <Tab key='artsit' title='작가 Artist'>
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
