import jwt_decode from 'jwt-decode';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import {
  AiFillHeart,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineHeart,
} from 'react-icons/ai';
import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';

import Editor from '@/components/Editor';
import ReadOnlyEditor from '@/components/Editor/ReadOnlyEditor';
import Footer from '@/components/Footer';
import ProfileCard from '@/components/ProfileCard';
import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';

import { artwork, profile } from '@/api';
import {
  NEXT_PUBLIC_MEDIA_STORAGE_URL,
  NEXT_PUBLIC_ROOT_URL,
} from '@/constant/env';
import { isTokenLoadingAtom, userNameAndRoleAtom } from '@/states/atom';
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
  profileData: profileApiType;
}> = async ({ params }) => {
  if (!params?.slug) {
    return {
      notFound: true,
    };
  }
  const id = params.slug[0];
  const response = await artwork.detail(id).then((res) => res);
  const data: ArtworkType = response.data;

  const likeResponse = await artwork.likeMembers(id).then((res) => res);

  const profileData = await profile
    .get(data.artwork.authorUsername)
    .then((res) => res.data);
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
      profileData,
    },
  };
};

const Slug = ({
  data,
  isEditMode,
  likedMembers,
  profileData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const slug = (router.query.slug as string[]) || [];
  const isTokenRefreshing = useRecoilValue(isTokenLoadingAtom);
  const likeButtonTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const usernameAndrole = useRecoilValue(userNameAndRoleAtom);

  const [isLike, setIsLike] = useState<boolean>(false);
  const [isFirstLike, setFirstLike] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(data.artwork.likes);

  const [isEdit, setIsEdit] = useState<boolean>(slug[1] === 'edit');
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

  useEffect(() => {
    // calculate like count
    if (isFirstLike) {
      if (isLike) {
        setLikeCount(() => data.artwork.likes);
      } else {
        setLikeCount(() => data.artwork.likes - 1);
      }
    } else {
      if (isLike) {
        setLikeCount(() => data.artwork.likes + 1);
      } else {
        setLikeCount(() => data.artwork.likes);
      }
    }
  }, [isLike, isFirstLike, setLikeCount, data.artwork.likes]);

  useEffect(() => {
    jxios.defaults.headers.common.Authorization &&
      artwork.isLike(data.artwork.id).then((res) => {
        setIsLike(Boolean(res.data));
        setFirstLike(Boolean(res.data));
      });
  }, [data.artwork.id]);

  const onLikeButtonClick = async () => {
    if (!data) return;
    if (!isTokenRefreshing && jxios.defaults.headers.common.Authorization) {
      likeButtonTimeoutRef.current &&
        clearTimeout(likeButtonTimeoutRef.current);
      setIsLike((prev) => !prev);
      likeButtonTimeoutRef.current = setTimeout(async () => {
        try {
          await artwork.like(data.artwork.id).then((response) => {
            if (response.status === 200) {
              setIsLike(true);
            } else if (response.status === 204) {
              setIsLike(false);
            }
          });
        } catch (error) {
          /* empty */
        }
      }, 100);
    } else {
      toast.error('로그인 이후 좋아요가 가능합니다!');
    }
  };
  return (
    <>
      <Seo
        description={data.artwork.description.substring(0, 120)}
        templateTitle={`${data.artwork.title} - ${data.artwork.authorName} 작품`}
        image={
          NEXT_PUBLIC_ROOT_URL +
          '/api/og-image?title=' +
          data.artwork.title +
          '&thumbnail=' +
          data.artwork.thumbnail.mediaUrl +
          '&name=' +
          data.artwork.authorName
        }
        tag={`${data.artwork.authorName}, ${data.artwork.tags.toString()}`}
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
                        className='aspect-video w-full'
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
                    {(likeCount <= 0 && '아직 좋아요가 없습니다.') ||
                      (likeCount === 1 &&
                        (likedMembers.memberUsernames[0]
                          ? likedMembers.memberUsernames[0] ===
                            usernameAndrole.username
                            ? likedMembers.memberUsernames[1]
                            : likedMembers.memberUsernames[0]
                          : isLike
                          ? usernameAndrole.username
                          : 'user') + '님이 좋아합니다.') ||
                      likedMembers.memberUsernames[0] +
                        '님 외 ' +
                        (likeCount - 1) +
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
                            artwork.delete(data.artwork.id).then(() => {
                              router.push('/').then(() => {
                                router.reload();
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
