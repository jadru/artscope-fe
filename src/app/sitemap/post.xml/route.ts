import { getServerSideSitemap } from 'next-sitemap';

import { NEXT_PUBLIC_API_URL } from '@/constant/env';

import { PostListResponse } from '@/types/feed';

export async function GET(_request: Request) {
  // Method to source urls from cms
  const data: PostListResponse = await fetch(
    NEXT_PUBLIC_API_URL + '/api/posts',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        query: JSON.stringify({
          page: 0,
          size: 500,
        }),
      },
    }
  ).then((res) => res.json());

  return getServerSideSitemap(
    data.posts.map((post) => ({
      loc: `${NEXT_PUBLIC_API_URL}/artwork/${post.id}`,
      changefreq: 'daily',
      priority: 0.9,
      lastmod: String(post.updatedTime ?? post.createdTime),
    }))
  );
}
