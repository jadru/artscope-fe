import {
  BreadcrumbList,
  ItemList,
  Organization,
  SearchAction,
} from 'schema-dts';

export const jsonLdOrg: Organization = {
  '@type': 'Organization',
  name: 'Artscope',
  image: 'https://www.artscope.kr/favicon/apple-touch-icon.png',
  legalName: 'Media Xi',
  url: 'https://www.artscope.kr',
  alternateName: 'MexiaXi, 아트스코프, 아트스코프.kr',
  description:
    'Artscope은 예술가들의 성장과 교류를 위한 플랫폼입니다. ' +
    '작품 등록, 예술가 검색, 소통 기능, 프로젝트 제안, 예술 관련 정보 제공 등 다양한 기능을 제공합니다. ' +
    '예술에 관심 있는 모든 분들이 Artscope를 통해 새로운 경험을 할 수 있기를 기대합니다.',
};

export const jsonLdNav: ItemList = {
  '@type': 'ItemList',
  itemListElement: [
    {
      '@type': 'SiteNavigationElement',
      position: 1,
      name: '피드',
      description: '피드에서 Artscope의 다양한 컨텐츠를 만나보세요.',
      url: 'https://www.artscope.kr/',
    },
    {
      '@type': 'SiteNavigationElement',
      position: 2,
      name: '작품',
      description: '감각적인 예술 작품들을 살펴보세요.',
      url: 'https://www.artscope.kr/artworks',
    },
    {
      '@type': 'SiteNavigationElement',
      position: 3,
      name: '이벤트',
      description: '다양한 예술 이벤트를 살펴보세요.',
      url: 'https://www.artscope.kr/events',
    },
    {
      '@type': 'SiteNavigationElement',
      position: 4,
      name: '아고라',
      description: '예술에 대해 토론하고 투표하세요.',
      url: 'https://www.artscope.kr/agoras',
    },
  ],
};

export const jsonLdSearch: SearchAction = {
  '@type': 'SearchAction',
  target: {
    '@type': 'EntryPoint',
    urlTemplate: 'https://www.artscope.kr/search?c={search_term_string}',
  },
};

export const jsonLdThumb: BreadcrumbList = {
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'SiteNavigationElement',
      position: 1,
      name: '피드',
      description: '피드에서 Artscope의 다양한 컨텐츠를 만나보세요.',
      url: 'https://www.artscope.kr/',
    },
    {
      '@type': 'SiteNavigationElement',
      position: 2,
      name: '작품',
      description: '감각적인 예술 작품들을 살펴보세요.',
      url: 'https://www.artscope.kr/artwork',
    },
    {
      '@type': 'SiteNavigationElement',
      position: 3,
      name: '이벤트',
      description: '다양한 예술 이벤트를 살펴보세요.',
      url: 'https://www.artscope.kr/event',
    },
    {
      '@type': 'SiteNavigationElement',
      position: 4,
      name: '아고라',
      description: '예술에 대해 토론하고 투표하세요.',
      url: 'https://www.artscope.kr/agora',
    },
  ],
};
