import Link from 'next/link';

import { magazineItemType } from '@/types/magazine';

export default function MagazineItem({
  magazine,
}: {
  magazine: magazineItemType;
}) {
  const colorCodes: string[] = [
    '#e154e5',
    '#99a681',
    '#4c3999',
    '#ee12c6',
    '#74edda',
    '#3bfd1d',
    '#1413ed',
    '#a2c1a2',
    '#5f1e41',
    '#1c5208',
    '#086351',
    '#40eef5',
    '#5af4ae',
    '#8efc4b',
    '#b7de6a',
    '#da895d',
  ];

  return (
    <Link
      className='h-96'
      style={{ background: colorCodes[magazine.id % 16] }}
      href={'/magazine/' + magazine.id}>
      <h2 className='p-4 text-3xl text-white break-keep'>{magazine.title}</h2>
      <h3 className='px-4 text-2xl text-white break-keep'>
        {magazine.author.authorName}
      </h3>
    </Link>
  );
}
