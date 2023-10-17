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
    <Link className='h-24 w-full' href={ogData.ogUrl} target='_blank'>
      <ASNextImage
        src={ogData.ogImage}
        alt={ogData.ogTitle}
        width={200}
        height={200}
      />
      <div className='text-2xl font-bold'>{ogData.ogTitle}</div>
    </Link>
  ) : (
    <></>
  );
};

export default OpengraphCard;
