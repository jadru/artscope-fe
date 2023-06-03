import Link from 'next/link';
import * as React from 'react';

import { getDatabase } from '@/utils/notion';

import Footer from '../../components/Footer';
import Seo from '../../components/Seo';
import TabLayout from '../../components/TabLayout';
import BottomBar from '../../components/TabLayout/BottomBar';
import { NavBar } from '../../components/TabLayout/NavBar';
import Title from '../../components/Title';

export const getStaticProps = async () => {
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!databaseId) {
    throw new Error('Missing NOTION_DATABASE_ID');
  }
  const database = await getDatabase(databaseId);

  return {
    props: {
      posts: database,
    },
    revalidate: 10, // In seconds
  };
};

const Blog = ({ posts }) => {
  return (
    <>
      <Seo templateTitle='블로그' />
      <NavBar />
      <TabLayout top>
        <div className='breadcrumbs text-sm'>
          <ul>
            <li>
              <Link href='/'>Home</Link>
            </li>
            <li>
              <Link href='#'>Blog</Link>
            </li>
          </ul>
        </div>
        <Title>Blog</Title>
        <div className='flex flex-col'>
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className='group relative w-full justify-center border-b border-b-neutral-600 py-4 px-3'
            >
              <p className='text-3xl font-light duration-100 group-hover:font-bold group-hover:underline group-hover:underline-offset-2 group-hover:ease-in'>
                {post.properties.title.title[0]?.plain_text}
              </p>
              <p className='duration-100 group-hover:font-bold group-hover:ease-in'>
                {new Date(post.created_time).toLocaleDateString('ko-KR')}
              </p>
            </Link>
          ))}
        </div>
      </TabLayout>
      <Footer />
      <BottomBar tab='playlist' />
    </>
  );
};

export default Blog;
