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

import {
  NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_MEDIA_STORAGE_URL,
  NEXT_PUBLIC_ROOT_URL,
} from '@/constant/env';
import jxios from '@/utils/jxios';

import { ArtworkType, profileApiType } from '@/types';

export const getServerSideProps: GetServerSideProps<{
  data: ArtworkType;
}> = async ({ params }) => {
  // Fetch data from external API
  const response = await jxios
    .get(NEXT_PUBLIC_API_URL + '/api/artworks/' + params?.slug)
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
    if (data && jxios.defaults.headers.common.Authorization) {
      let token = jxios.defaults.headers.common.Authorization as string;
      token = token.replace('Bearer ', '');
      const decodedToken: { sub: string; auth: string } = jwt_decode(token);
      data.member === decodedToken.sub ||
        (decodedToken.auth.includes('ROLE_ADMIN') && setIsEdit(true));
    }
  }, [data]);

  return (
    <>
      <Seo
        description={data.description}
        templateTitle={data.title + ' - Artwork'}
        image={NEXT_PUBLIC_ROOT_URL + '/api/og-image?title=' + data.title}
      />
      <NavBar />
      <TabLayout>
        {data && (
          <div className='block space-y-1.5'>
            <h1 className='my-8 text-center text-4xl font-light'>
              {data?.title}
            </h1>
            <div className='flex items-center justify-center space-x-1'>
              {data.tags &&
                data.tags.length > 0 &&
                data.tags[0] !== '' &&
                data.tags.map((tag) => (
                  <span key={tag} className='text-md badge p-2 uppercase'>
                    {tag}
                  </span>
                ))}
            </div>
            <div className='my-12 text-lg'>
              <p className='break-keep text-left'>{data.description}</p>
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
                    <p className='w-full pt-0.5 text-left text-lg'>
                      {artworkMedia.description}
                    </p>
                  )}
                </div>
              </>
            ))}
            <div className='h-8'></div>

            <div className='my-4 flex flex-col'>
              <div className='text-left'>
                <p>
                  작성일 : {new Date(data.createdTime).toLocaleString('ko-KR')}
                </p>
                {data.updatedTime && (
                  <p>
                    업데이트 :{' '}
                    {new Date(data.updatedTime).toLocaleString('ko-KR')}
                  </p>
                )}
              </div>
              {isEdit && (
                <div className='btn-group mt-2'>
                  <button
                    className='btn-accent btn'
                    onClick={() => {
                      alert('작품 수정은 준비중입니다.');
                    }}
                  >
                    <AiOutlineEdit className='h-6 w-6' />
                  </button>
                  <button
                    className='btn-warning btn'
                    onClick={() => {
                      confirm('정말 삭제하시겠습니까?') &&
                        jxios.delete('/api/artworks/' + data.id).then(() => {
                          router.push('/artwork').then(() => {
                            toast.success('작품이 삭제되었습니다.');
                          });
                        });
                    }}
                  >
                    <AiOutlineDelete className='h-6 w-6' />
                  </button>
                </div>
              )}
            </div>

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
