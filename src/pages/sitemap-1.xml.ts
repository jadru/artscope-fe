import { NextPage } from 'next';

import jxios from '@/utils/jxios';

const Sitemap: NextPage = () => {
  return null;
};

const insideXMLString = (xmlContent: string): string => {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
      ${xmlContent}
    </urlset>
  `;
};

Sitemap.getInitialProps = async (ctx) => {
  const { res } = ctx;
  const posts = await jxios.get('/artworks', {
    params: {
      page: 0,
      size: 1000,
    },
  });

  let pagesXML = '';
  for (const post of posts.data.artworks) {
    pagesXML += `
      <url>
        <loc>https://www.artscope.kr/posts/${post.id}</loc>
        <lastmod>${
          post.updatedTime ? post.updatedTime : post.createdTime
        }</lastmod>
      </url>
    `;
  }
  const xmlContents = insideXMLString(pagesXML);

  if (res !== undefined) {
    // headers의 Content-Type을 text/xml로 설정해줍니다.
    res.setHeader('Content-Type', 'text/xml');

    // 완성된 XML 내용을 페이지에 노출될 수 있도록 write 함수를 사용합니다.
    res.write(xmlContents);

    res.end();
  }

  return {};
};

export default Sitemap;
