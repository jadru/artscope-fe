import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AiOutlineLink, AiOutlinePhone } from 'react-icons/ai';

import StandardLabel from '@/components/StandardLabel';

import MapPage from '@/app/(main)/(viewer)/space/[[...slug]]/map';
import { NEXT_PUBLIC_API_URL } from '@/constant/env';
import jxios from '@/utils/jxios';
import { stringToPhoneNumber } from '@/utils/stringConverter';

import { LocationDataType } from '@/types/location';

const fetchSpace = async (id: string) =>
  await jxios
    .get(NEXT_PUBLIC_API_URL + '/api/location/' + id)
    .then((res) => res.data as LocationDataType);

export default async function SpacePage({
  params,
}: {
  params: { slug: string[] };
}) {
  if (!params.slug) redirect('/');
  const data = await fetchSpace(params.slug[0]);
  if (!data) throw new Error('Failed to fetch data');
  return (
    <div className='space-y-3 px-3 py-3 md:px-0'>
      <h1 className='break-keep text-[2.3rem] font-normal'>
        <StandardLabel label={data.name} />{' '}
        <StandardLabel label={data.englishName} />
      </h1>
      <p>
        <StandardLabel label={data.address} />
      </p>
      <div>
        <div className='flex items-center gap-1'>
          <AiOutlinePhone size={24} />
          <StandardLabel label={stringToPhoneNumber(data.phoneNumber)} />
        </div>
        {data.snsUrl && (
          <Link
            href={data.snsUrl}
            target='_blank'
            className='flex items-center gap-1'
          >
            <AiOutlineLink size={24} />
            <StandardLabel label={data.snsUrl} />
          </Link>
        )}
        {data.webSiteUrl && (
          <Link
            href={data.webSiteUrl}
            target='_blank'
            className='flex items-center gap-1'
          >
            <AiOutlineLink size={24} />
            <StandardLabel label={data.webSiteUrl} />
          </Link>
        )}
      </div>
      <MapPage
        latitude={data.latitude}
        longitude={data.longitude}
        name={data.name}
        address={data.address}
      />
    </div>
  );
}
