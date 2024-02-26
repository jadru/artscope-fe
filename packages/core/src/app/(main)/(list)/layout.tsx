import React from 'react';

import Logo from '@/assets/images/logo_long.svg';
import { NEXT_PUBLIC_API_URL } from '@/constant/env';

import { categoryType } from '@/types/magazine';

const fetchCategories = async () =>
  await fetch(NEXT_PUBLIC_API_URL + '/api/magazine-category').then((res) =>
    res.json()
  );

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = (await fetchCategories()) as {
    categories: categoryType[];
  };
  return (
    <div className='px-0 md:px-0 w-screen flex justify-stretch'>
      <div className='w-1/3 bg-yellow-400 p-6 mb-2'>
        <Logo className='group-hover:fill-primary w-52 overflow-hidden fill-white px-2 pb-1 pt-1 transition duration-100 mb-4' />
        {categories.categories.map((category) => (
          <div key={category.id} className='text-2xl font-bold text-white'>
            {category.name}
          </div>
        ))}
      </div>
      <div className='w-2/3 self-stretch'>{children}</div>
    </div>
  );
}
