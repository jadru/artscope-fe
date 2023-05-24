import jwt_decode from 'jwt-decode';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import {
  AiFillHeart,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineHeart,
} from 'react-icons/ai';
import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';
import useSWR from 'swr';

import Editor from '@/components/Editor';
import ReadOnlyEditor from '@/components/Editor/ReadOnlyEditor';
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
import { isTokenLoadingAtom } from '@/states/atom';
import jxios from '@/utils/jxios';

import {
  ArtworkType,
  likeMemberApiResponseType,
  profileApiType,
} from '@/types';

export const getServerSideProps: GetServerSideProps<{
  data: ArtworkType;
  isEditMode: boolean;
  likedMembers: likeMemberApiResponseType;
}> = async ({ params }) => {
  if (!params?.slug) {
    return {
      notFound: true,
    };
  }
  const id = params.slug[0];
  const response = await jxios
    .get(NEXT_PUBLIC_API_URL + '/api/artworks/' + id)
    .then((res) => res);
  const data: ArtworkType = response.data;

  const likeResponse = await jxios
    .get(NEXT_PUBLIC_API_URL + '/api/artworks/' + id + '/likes')
    .then((res) => res);

  const likedMembers: likeMemberApiResponseType = likeResponse.data;

  if (!data) {
    return {
      notFound: true,
    };
  }

  const isEditMode = params.slug[1] === 'edit';

  return {
    props: {
      data,
      isEditMode,
      likedMembers,
    },
  };
};

const Slug = ({
  data,
  isEditMode,
  likedMembers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const slug = (router.query.slug as string[]) || [];
  const isTokenRefreshing = useRecoilValue(isTokenLoadingAtom);
  const fetcher = (url: string) => jxios.get(url).then((res) => res.data);
  const { data: profileData } = useSWR<profileApiType>(
    slug && data ? '/api/members/' + data?.artwork.authorUsername : undefined,
    fetcher
  );
  const [isLike, setIsLike] = useState<boolean>(false);

  const [isEdit, setIsEdit] = useState<boolean>(data.isLike);
  // eslint-disable-next-line
  const [editMode, setEditMode] = useState<boolean>(false);

  useEffect(() => {
    if (
      !isTokenRefreshing &&
      data &&
      jxios.defaults.headers.common.Authorization
    ) {
      let token = jxios.defaults.headers.common.Authorization as string;
      token = token.replace('Bearer ', '');
      const decodedToken: { sub: string; auth: string } = jwt_decode(token);
      if (
        data.artwork.authorUsername === decodedToken.sub ||
        decodedToken.auth.includes('ROLE_ADMIN')
      ) {
        setIsEdit(true);
        isEditMode && setEditMode(true);
      }
    }
  }, [data, isEditMode, isTokenRefreshing]);

  useEffect(() => {
    if (data && router.asPath === '/artwork/' + data.artwork.id) {
      setEditMode(false);
    }
  }, [data, router.asPath]);

  const onLikeButtonClick = async () => {
    if (!data) return;
    if (!isTokenRefreshing && jxios.defaults.headers.common.Authorization) {
      const response = await jxios
        .post('/api/artworks/' + data.artwork.id + '/like')
        .then((res) => res);
      if (response.status === 200) {
        if (response.data.liked) {
          setIsLike(true);
        } else {
          setIsLike(false);
        }
      }
    } else {
      toast.error('로그인 이후 좋아요가 가능합니다!');
    }
  };
  return (
    <>
      <Seo
        description={data.artwork.description}
        templateTitle={data.artwork.title + ' - Artwork'}
        image={
          NEXT_PUBLIC_ROOT_URL +
          '/api/og-image?title=' +
          data.artwork.title +
          '&thumbnail=' +
          data.artwork.thumbnail.mediaUrl
        }
      />
      <NavBar />
      <TabLayout top>
        {!editMode ? (
          data && (
            <div className='block space-y-1.5'>
              <h1 className='my-8 text-center text-4xl font-light'>
                {data.artwork?.title}
              </h1>
              <div className='flex items-center justify-center space-x-1'>
                {data.artwork.tags &&
                  data.artwork.tags.length > 0 &&
                  data.artwork.tags[0] !== '' &&
                  data.artwork.tags.map((tag) => (
                    <span key={tag} className='text-md badge p-2 uppercase'>
                      {tag.replace("'", '')}
                    </span>
                  ))}
              </div>
              <div className='my-12'>
                <ReadOnlyEditor data={data.artwork.description} />
              </div>
              {data.artwork.artworkMedias.map((artworkMedia) => (
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
                        width={300}
                        height={300}
                        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                      />
                    ) : artworkMedia.mediaType === 'url' ? (
                      <iframe
                        width='100%'
                        height='330px'
                        src={
                          'https://www.youtube.com/embed/' +
                          artworkMedia.mediaUrl.substring(
                            artworkMedia.mediaUrl.indexOf('=') + 1
                          )
                        }
                        title='YouTube video player'
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <video
                        className='relative h-auto w-full'
                        src={
                          NEXT_PUBLIC_MEDIA_STORAGE_URL +
                          '/' +
                          artworkMedia.mediaUrl
                        }
                        controls
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
                <button
                  onClick={onLikeButtonClick}
                  className='mb-4 flex items-center'
                >
                  {isLike ? (
                    <AiFillHeart className='h-7 w-7 text-orange-500' />
                  ) : (
                    <AiOutlineHeart className='h-7 w-7' />
                  )}
                  <span className='ml-2 font-bold'>
                    {(data.artwork.likes + (isLike ? 1 : 0) === 0 &&
                      '아직 좋아요가 없습니다.') ||
                      (data.artwork.likes + (isLike ? 1 : 0) === 1 &&
                        likedMembers.memberUsernames[0] + '님이 좋아합니다.') ||
                      likedMembers.memberUsernames[0] +
                        '님 외 ' +
                        (data.artwork.likes - 1 + (isLike ? 1 : 0)) +
                        '명이 좋아합니다.'}
                  </span>
                </button>

                <div className='text-left'>
                  <p>
                    작성일 :{' '}
                    {new Date(data.artwork.createdTime).toLocaleString('ko-KR')}
                  </p>
                  {data.artwork.updatedTime && (
                    <p>
                      업데이트 :{' '}
                      {new Date(data.artwork.updatedTime).toLocaleString(
                        'ko-KR'
                      )}
                    </p>
                  )}
                </div>
                {isEdit && (
                  <>
                    <p>조회수 : {data.artwork.views}</p>
                    <div className='btn-group mt-2'>
                      <Link
                        className='btn-accent btn'
                        href={'/artwork/' + data.artwork.id + '/edit'}
                      >
                        <AiOutlineEdit className='h-6 w-6' />
                      </Link>
                      <button
                        className='btn-warning btn'
                        onClick={() => {
                          confirm('정말 삭제하시겠습니까?') &&
                            jxios
                              .delete('/api/artworks/' + data.artwork.id)
                              .then(() => {
                                router.push('/').then(() => {
                                  toast.success('작품이 삭제되었습니다.');
                                });
                              });
                        }}
                      >
                        <AiOutlineDelete className='h-6 w-6' />
                      </button>
                    </div>
                  </>
                )}
              </div>
              {profileData && <ProfileCard profileData={profileData} />}
            </div>
          )
        ) : (
          <div className='w-2xl'>
            <Editor data={data} type='edit' />
          </div>
        )}
      </TabLayout>
      <Footer />
      <BottomBar tab='artwork' />
    </>
  );
};

export default Slug;
