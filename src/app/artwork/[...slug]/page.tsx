'use client';

import jwt_decode from 'jwt-decode';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
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

const Page = () => {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const isEditMode = params.slug[1] === 'edit';

  const isTokenRefreshing = useRecoilValue(isTokenLoadingAtom);
  const likeButtonTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const usernameAndrole = useRecoilValue(userNameAndRoleAtom);

  const [data, setData] = useState<ArtworkType | null>(null);
  const [likedMembers, setLikedMembers] =
    useState<likeMemberApiResponseType | null>(null);
  const [profileData, setProfileData] = useState<profileApiType | null>(null);

  const [isLike, setIsLike] = useState<boolean>(false);
  const [isFirstLike, setFirstLike] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);

  const [isEdit, setIsEdit] = useState<boolean>(params.slug[1] === 'edit');
  const [editMode, setEditMode] = useState<boolean>(false);

  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [isLikedMembersLoading, setIsLikedMembersLoading] =
    useState<boolean>(true);
  const [isProfileDataLoading, setIsProfileDataLoading] =
    useState<boolean>(true);

  useEffect(() => {
    isDataLoading &&
      artwork.detail(params.slug[0]).then((res) => {
        setData(res.data);
        setIsDataLoading(false);
      });
    isLikedMembersLoading &&
      artwork.likeMembers(params.slug[0]).then((res) => {
        setLikedMembers(res.data);
        setIsLikedMembersLoading(false);
      });
    isProfileDataLoading &&
      !isDataLoading &&
      data &&
      profile.get(data.artwork.authorUsername).then((res) => {
        setProfileData(res.data);
        setIsProfileDataLoading(false);
      });
  }, [
    data,
    isDataLoading,
    isLikedMembersLoading,
    isProfileDataLoading,
    params.slug,
  ]);

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
    if (data && pathname === '/artwork/' + data.artwork.id) {
      setEditMode(false);
    }
  }, [data, pathname]);

  useEffect(() => {
    // calculate like count
    if (!data) return;
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
  }, [isLike, isFirstLike, setLikeCount, data?.artwork.likes, data]);

  useEffect(() => {
    if (!data) return;
    jxios.defaults.headers.common.Authorization &&
      artwork.isLike(data.artwork.id).then((res) => {
        setIsLike(Boolean(res.data));
        setFirstLike(Boolean(res.data));
      });
  }, [data?.artwork.id, data]);

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
      {data && (
        <Seo
          description={data?.artwork.description.substring(0, 120)}
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
      )}
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

              {likedMembers && (
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
                      {new Date(data.artwork.createdTime).toLocaleString(
                        'ko-KR'
                      )}
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
                          className='btn btn-accent'
                          href={'/artwork/' + data.artwork.id + '/edit'}
                        >
                          <AiOutlineEdit className='h-6 w-6' />
                        </Link>
                        <button
                          className='btn btn-warning'
                          onClick={() => {
                            confirm('정말 삭제하시겠습니까?') &&
                              artwork.delete(data.artwork.id).then(() => {
                                router.push('/');
                                router.refresh();
                                toast.success('작품이 삭제되었습니다.');
                              });
                          }}
                        >
                          <AiOutlineDelete className='h-6 w-6' />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
              {profileData && <ProfileCard profileData={profileData} />}
            </div>
          )
        ) : (
          <div className='w-2xl'>
            {data && <Editor data={data} type='edit' />}
          </div>
        )}
      </TabLayout>
      <Footer />
      <BottomBar tab='artwork' />
    </>
  );
};

export default Page;
