import Link from 'next/link';

import { getDatabase } from '@/utils/notion';

import Seo from '../../components/Seo';
import TabLayout from '../../components/TabLayout';
import BottomBar from '../../components/TabLayout/BottomBar';
import { NavBar } from '../../components/TabLayout/NavBar';
import Title from '../../components/Title';

const databaseId = process.env.NOTION_DATABASE_ID;

export const getStaticProps = async () => {
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
      <Seo templateTitle='Blog' />
      <NavBar />
      <TabLayout>
        <Title>Artscope Blog</Title>
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.id}`}
            className='relative w-full justify-center overflow-hidden'
          >
            <p className='bg-sky-500 py-4 text-3xl font-light hover:bg-sky-700'>
              {post.properties.title.title[0]?.plain_text}
            </p>
            <hr />
          </Link>
        ))}
      </TabLayout>
      <BottomBar tab='playlist' />
    </>
  );
};

export default Blog;
