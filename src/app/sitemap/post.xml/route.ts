import { getServerSideSitemap } from 'next-sitemap';

import { NEXT_PUBLIC_API_URL } from '@/constant/env';

import { PostListResponse } from '@/types/feed';

export const dynamic = 'force-dynamic';
export const revalidate = 3600 * 24;

export async function GET(_request: Request) {
  // Method to source urls from cms
  const data: PostListResponse = await fetch(
    NEXT_PUBLIC_API_URL + '/api/posts?size=1000&page=0',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        accept: '*/*',
      },
    }
  ).then((res) => res.json());

  return getServerSideSitemap(
    data.posts.map((post) => ({
      loc: `${NEXT_PUBLIC_API_URL}/post/${post.id}`,
      changefreq: 'daily',
      priority: 0.9,
      lastmod: String(post.updatedTime ?? post.createdTime),
    }))
  );
}
