'use client';

import { Select, SelectItem } from '@nextui-org/react';
import React, { Dispatch, ReactElement } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const AnonymousSelectItems: {
  label: string;
  value: boolean;
  icon: ReactElement;
}[] = [
  { label: '익명', value: true, icon: <AiOutlineEyeInvisible /> },
  { label: '실명 (아이디 보이기)', value: false, icon: <AiOutlineEye /> },
];

const AnonymousCheckBox = ({
  setAnonymousType,
  anonymousType,
}: {
  setAnonymousType: Dispatch<boolean>;
  anonymousType: boolean;
}) => (
  <Select
    labelPlacement='outside'
    size='sm'
    color='primary'
    disallowEmptySelection
    startContent={!anonymousType ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
    defaultSelectedKeys={['true']}
    className='mb-1.5 w-[200px]'
    onSelectionChange={(select) => {
      if (Array.from(select)[0] === 'true') setAnonymousType(true);
      else setAnonymousType(false);
    }}
  >
    {AnonymousSelectItems.map((item) => (
      <SelectItem key={String(item.value)} startContent={item.icon}>
        {item.label}
      </SelectItem>
    ))}
  </Select>
);

export default AnonymousCheckBox;
