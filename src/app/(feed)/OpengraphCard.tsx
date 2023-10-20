import Link from 'next/link';
import { useEffect, useState } from 'react';

import ASNextImage from '@/components/ASNextImage';

import jxios from '@/utils/jxios';

type OgData = {
  ogTitle: string;
  ogUrl: string;
  ogImage: string;
  ogDescription: string;
};

const OpengraphCard = ({ externalUrl }: { externalUrl: string }) => {
  const [ogData, setOgData] = useState<OgData | undefined>();

  useEffect(() => {
    const getOgData = async () => {
      const data = await jxios
        .get(`/api/opengraph?url=${encodeURI(externalUrl)}`)
        .then((res) => res.data);

      setOgData(data);
    };
    getOgData();
  }, [externalUrl]);

  return ogData ? (
    <Link
      href={encodeURI(externalUrl)}
      target='_blank'
      className='group mt-1.5 animate-appearance-in hover:text-black'
      onClick={(e) => e.stopPropagation()}
    >
      <div className='flex h-24 rounded-2xl border transition group-hover:bg-default-200'>
        <ASNextImage
          src={ogData.ogImage}
          alt={ogData.ogTitle}
          width={200}
          height={200}
          className='h-24 w-24 rounded-xl object-cover'
        />
        <div className='w-[calc(100%-6rem)] px-3 py-3'>
          <h5 className='truncate text-lg font-bold'>{ogData.ogTitle}</h5>
          <p className='line-clamp-2 text-default-600'>
            {ogData.ogDescription}
          </p>
        </div>
      </div>
    </Link>
  ) : (
    <></>
  );
};

export default OpengraphCard;
