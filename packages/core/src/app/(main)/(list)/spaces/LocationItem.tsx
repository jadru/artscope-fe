import Link from 'next/link';

import StandardLabel from '@/components/StandardLabel';

import { LocationListItemType } from '@/types/location';

export default function LocationItem({
  location,
}: {
  location: LocationListItemType;
}) {
  return (
    <Link href={'/space/' + location.locationId}>
      <div className='hover:bg-default-100 w-full appearance-none rounded-2xl px-3 py-2 transition'>
        <h4 className='font-title flex w-full justify-between text-[1.1rem]'>
          <StandardLabel label={location.name} />
        </h4>
        {location.englishName && (
          <h4 className='font-normal'>
            <StandardLabel label={location.englishName} />
          </h4>
        )}
        <h5>
          <StandardLabel label={location.address} />
        </h5>
      </div>
    </Link>
  );
}
