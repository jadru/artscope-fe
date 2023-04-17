import jwt_decode from 'jwt-decode';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { toast } from 'react-toastify';
import useSWR from 'swr';

import Footer from '@/components/Footer';
import ProfileCard from '@/components/ProfileCard';
import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';

import { NEXT_PUBLIC_MEDIA_STORAGE_URL } from '@/constant/env';
import jxios from '@/utils/jxios';

import { ArtworkType, profileApiType } from '@/types';

export const getServerSideProps: GetServerSideProps<{
  data: ArtworkType;
}> = async ({ params }) => {
  // Fetch data from external API
  const response = await jxios
    .get('https://api.artscope.kr/api/artworks/' + params?.slug)
    .then((res) => res);
  const data: ArtworkType = response.data;

  if (!data) {
    return {
      notFound: true,
    };
  }

  // Pass data to the page via props
  return { props: { data } };
};

const Slug = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const slug = (router.query.slug as string[]) || [];
  const fetcher = (url: string) => jxios.get(url).then((res) => res.data);
  const { data: profileData } = useSWR<profileApiType>(
    slug && data ? '/api/members/' + data?.member : undefined,
    fetcher
  );

  const [isEdit, setIsEdit] = useState(false);
  // eslint-disable-next-line
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (jxios.defaults.headers.common.Authorization) {
      let token = jxios.defaults.headers.common.Authorization as string;
      token = token.replace('Bearer ', '');
      const decodedToken: { sub: string } = jwt_decode(token);
      data.member === decodedToken.sub && setIsEdit(true);
    }
  }, [data]);

  return (
    <>
      <Seo
        description={data.description}
        templateTitle={data.title + ' - Artwork'}
        image={'https://www.artscope.kr/api/og-image?title=' + data.title}
      />
      <NavBar />
      <TabLayout>
        {data && (
          <div className='block space-y-1.5'>
            <h1 className='my-8 text-center text-4xl font-light'>
              {data?.title}
            </h1>
            <div className='my-8 text-lg'>
              <p className='text-center'>{data.description}</p>
            </div>
            {data.artworkMedias.map((artworkMedia) => (
              <>
                <div
                  key={artworkMedia.id}
                  className='unset relative h-auto w-full'
                >
                  {artworkMedia.mediaType === 'image' ? (
                    <Image
                      className='relative h-auto w-full'
                      src={artworkMedia.mediaUrl}
                      alt='artworkMedia'
                      width={artworkMedia.imageWidth}
                      height={artworkMedia.imageHeight}
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    />
                  ) : (
                    <video
                      className='relative h-auto w-full'
                      src={
                        NEXT_PUBLIC_MEDIA_STORAGE_URL +
                        '/' +
                        artworkMedia.mediaUrl
                      }
                      controls
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  )}
                  {artworkMedia.description && (
                    <p className='w-full rounded-b-2xl pt-0.5 text-left text-xl'>
                      {artworkMedia.description}
                    </p>
                  )}
                </div>
              </>
            ))}
            <div className='h-6'></div>
            {isEdit && (
              <div className='my-4 flex items-center justify-between'>
                <div className='btn-group'>
                  <button
                    className='btn-primary btn'
                    onClick={() => {
                      alert('작품 수정은 준비중입니다.');
                    }}
                  >
                    <AiOutlineEdit />
                  </button>
                  <button
                    className='btn-error btn'
                    onClick={() => {
                      confirm('정말 삭제하시겠습니까?') &&
                        jxios.delete('/api/artworks/' + data.id).then(() => {
                          router.push('/artwork').then(() => {
                            toast.success('작품이 삭제되었습니다.');
                          });
                        });
                    }}
                  >
                    <AiOutlineDelete />
                  </button>
                </div>
                <div className='text-right'>
                  <p>
                    작성일 :{' '}
                    {new Date(data.createdTime).toLocaleString('ko-KR')}
                  </p>
                  {data.updatedTime && (
                    <p>
                      업데이트 :{' '}
                      {new Date(data.updatedTime).toLocaleString('ko-KR')}
                    </p>
                  )}
                </div>
              </div>
            )}
            {profileData && <ProfileCard profileData={profileData} />}
          </div>
        )}
      </TabLayout>
      <Footer />
      <BottomBar tab='artwork' />
    </>
  );
};

export default Slug;
