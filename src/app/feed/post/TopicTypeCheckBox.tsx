import { Select, SelectItem } from '@nextui-org/react';
import React, { Dispatch } from 'react';

export type TopicType = 'default' | 'artwork' | 'exhibition';

const TopicTypeSelectItems: { label: string; value: TopicType }[] = [
  { label: '기본', value: 'default' },
  { label: '작품', value: 'artwork' },
  { label: '전시회', value: 'exhibition' },
];

const TopicTypeCheckBox = ({
  setPostType,
}: {
  postType: TopicType;
  setPostType: Dispatch<TopicType>;
}) => (
  <Select
    labelPlacement='outside'
    color='secondary'
    disallowEmptySelection
    defaultSelectedKeys={['default']}
    description='토픽 선택'
    className='mb-1.5 w-[200px]'
    onChange={(e) => {
      setPostType(e.target.value as TopicType);
    }}
  >
    {TopicTypeSelectItems.map((item) => (
      <SelectItem key={item.value}>{item.label}</SelectItem>
    ))}
  </Select>
);

export default TopicTypeCheckBox;
