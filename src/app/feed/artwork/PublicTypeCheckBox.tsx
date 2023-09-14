import { Select, SelectItem } from '@nextui-org/react';
import React, { Dispatch, ReactElement } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

export type PublicType = 'public' | 'private';

const PublicTypeSelectItems: {
  label: string;
  value: PublicType;
  icon: ReactElement;
}[] = [
  { label: '전체 공개', value: 'public', icon: <AiOutlineEye /> },
  { label: '나만 보기', value: 'private', icon: <AiOutlineEyeInvisible /> },
];

const PublicTypeCheckBox = ({
  setPublicType,
  publicType,
}: {
  publicType: PublicType;
  setPublicType: Dispatch<PublicType>;
}) => (
  <Select
    labelPlacement='outside'
    size='sm'
    color='primary'
    disallowEmptySelection
    startContent={
      publicType === 'public' ? <AiOutlineEye /> : <AiOutlineEyeInvisible />
    }
    defaultSelectedKeys={['public']}
    className='mb-1.5 w-[130px]'
    onChange={(e) => {
      setPublicType(e.target.value as PublicType);
    }}
  >
    {PublicTypeSelectItems.map((item) => (
      <SelectItem key={item.value} startContent={item.icon}>
        {item.label}
      </SelectItem>
    ))}
  </Select>
);

export default PublicTypeCheckBox;
