'use client';

import Lottie from 'lottie-react';
import Image from 'next/image';
import React, { FormEvent, useEffect, useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import {
  AiFillDelete,
  AiOutlineCheck,
  AiOutlineFileImage,
} from 'react-icons/ai';
import { toast } from 'react-toastify';

import useAuth from '@/hooks/useAuth';

import Editor from '@/components/Editor';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';
import Title from '@/components/Title';

import { UPLOAD_MEDIA_MAX_INPUT_LENGTH } from '@/constant/config';

import { ArtWorkMediaType } from '@/types';

const FILETYPES = [
  'JPG',
  'JPEG',
  'PNG',
  'GIF',
  'MP4',
  'MOV',
  'AVI',
  'MP3',
  'WAV',
  'OGG',
];

const Page = () => {
  useAuth();
  const [fileUrls, setFileUrls] = useState<ArtWorkMediaType[]>([]);
  const [imgs, setImgs] = useState<string[]>([]);
  const [indexFileforModal, setIndexFileforModal] = useState<number>(0);
  const [linkInput, setLinkInput] = useState<string>('');

  const [thumbnail, setThumbnail] = useState<number>(0);
  const handleFileSelected = async (files: File[]) => {
    if (files.length > 10) {
      toast.warn('10개 이하의 파일까지 업로드할 수 있습니다.');
      return;
    }
    const urlList: ArtWorkMediaType[] = [];
    const imgList: string[] = [];
    for (let i = 0; i < files.length; i++) {
      urlList.push({
        mediaType: files[i].type.startsWith('image')
          ? 'image'
          : files[i].type.startsWith('video')
          ? 'video'
          : 'audio',
        file: files[i],
        description: '',
      });
      imgList.push(URL.createObjectURL(files[i]));
    }
    await setImgs(imgList);
    await setFileUrls(urlList);
  };

  const handleFileAdded = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      e.currentTarget.files &&
      fileUrls.length + e.currentTarget.files?.length > 10
    ) {
      toast.warn('10개 이하의 파일까지 업로드할 수 있습니다.');
      return;
    }
    if (e.currentTarget.files?.length === 0) return;

    const files = e.currentTarget.files as FileList;
    for (let i = 0; i < files.length; i++) {
      await setImgs((prev) => [...prev, URL.createObjectURL(files[i])]);
      await setFileUrls((prev) => [
        ...prev,
        {
          mediaType: files[i].type.startsWith('image')
            ? 'image'
            : files[i].type.startsWith('video')
            ? 'video'
            : 'audio',
          file: files[i],
          description: '',
        },
      ]);
    }
  };

  const handleLinkAdded = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (fileUrls.length + 1 > 10) {
      toast.warn('10개 이하의 파일까지 업로드할 수 있습니다.');
      return;
    }
    let link = e.currentTarget.link.value;

    if (
      link.startsWith('https://www.youtube.com/watch?v=') ||
      link.startsWith('http://www.youtube.com/watch?v=')
    ) {
      /* empty */
    } else if (link.startsWith('https://youtu.be/')) {
      link = link.replace(
        'https://youtu.be/',
        'https://www.youtube.com/watch?v='
      );
    } else {
      alert('유튜브 링크를 입력해주세요');
      return;
    }

    await setFileUrls((prev) => [
      ...prev,
      {
        mediaType: 'url',
        linkUrl: link,
        description: '',
      },
    ]);
    await setImgs((prev) => [...prev, link]);
    await setLinkInput('');
  };

  const handleDeleteFile = async (index: number) => {
    await setIndexFileforModal(0);
    if (confirm('미디어를 삭제하시겠습니까?')) {
      await setImgs((prev) => prev.filter((_, i) => i !== index));
      await setFileUrls((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const resetAfterUpload = () => {
    setFileUrls([]);
    setIndexFileforModal(0);
  };

  useEffect(() => {
    const unloadCallback = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', unloadCallback);
    return () => {
      window.removeEventListener('beforeunload', unloadCallback);
    };
  }, []);

  return (
    <>
      <NavBar />
      <TabLayout top>
        <Title>작품 업로드</Title>
        {fileUrls.length === 0 ? (
          <div className='flex flex-col items-center'>
            <Lottie
              loop={true}
              animationData={require('../../public/animation/110586-line-art.json')}
              className='w-1/3'
            />
            <div className='rounded-box grid h-48 w-full grid-cols-2 items-stretch justify-center justify-items-center md:border md:border-fuchsia-900'>
              <FileUploader
                handleChange={handleFileSelected}
                name='file'
                types={FILETYPES}
                multiple={true}
                onTypeError={() => toast.warn('지원하지 않는 파일 형식입니다')}
                onMaxSizeError={() => toast.warn('파일 용량이 너무 큽니다')}
                onMaxFilesError={() => toast.warn('파일 개수가 너무 많습니다')}
              >
                <div className='rounded-box flex h-full w-full cursor-pointer items-center justify-center justify-items-stretch hover:bg-gray-200/30'>
                  <p className='px-0 text-lg text-gray-800 dark:text-gray-200 md:px-12'>
                    사진, 동영상, 음원 <br />
                    <b>파일을 업로드하기</b>
                  </p>
                </div>
              </FileUploader>

              <label
                htmlFor='modal-add-link'
                className='rounded-box flex w-full cursor-pointer items-center justify-center hover:bg-gray-200/30'
              >
                <p className='text-lg text-gray-800 dark:text-gray-200'>
                  유튜브 링크를 <br /> <b>업로드하기</b>
                </p>
              </label>
            </div>
          </div>
        ) : (
          <>
            <div className='modal' id='modal-artwork-media'>
              <div className='modal-box flex flex-col items-center justify-center text-center'>
                <p className='text-lg'>미디어 설명 추가</p>
                {indexFileforModal <= fileUrls.length &&
                fileUrls[indexFileforModal]?.mediaType === 'image' ? (
                  <Image
                    src={imgs[indexFileforModal]}
                    alt='uploaded image'
                    width={300}
                    height={300}
                  />
                ) : fileUrls[indexFileforModal]?.mediaType === 'url' ? (
                  <iframe
                    width='100%'
                    height='300px'
                    src={
                      'https://www.youtube.com/embed/' + imgs[indexFileforModal]
                    }
                    title='YouTube video player'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                    allowFullScreen
                  ></iframe>
                ) : (
                  <video
                    src={imgs[indexFileforModal]}
                    width={300}
                    autoPlay
                    loop
                    muted
                    controls
                  />
                )}
                <input
                  type='text'
                  placeholder='제목, 매체, 사이즈, 제작연도 등'
                  value={fileUrls[indexFileforModal]?.description}
                  className='input input-bordered input-primary mt-2 w-[300px]'
                  onChange={(e) => {
                    const newFileUrls = [...fileUrls];
                    newFileUrls[indexFileforModal].description = e.target.value;
                    setFileUrls(newFileUrls);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      document
                        .querySelector('.modal-action .btn')
                        ?.dispatchEvent(new MouseEvent('click'));
                    }
                  }}
                  maxLength={UPLOAD_MEDIA_MAX_INPUT_LENGTH}
                />
                <div className='modal-action'>
                  {indexFileforModal > 0 && (
                    <button
                      className='btn btn-ghost'
                      onClick={() =>
                        setIndexFileforModal((prevState) => prevState - 1)
                      }
                    >
                      {'<--'}
                    </button>
                  )}
                  <a href='#' className='btn'>
                    확인
                  </a>
                  {indexFileforModal < fileUrls.length - 1 && (
                    <button
                      className='btn btn-ghost'
                      onClick={() =>
                        setIndexFileforModal((prevState) => prevState + 1)
                      }
                    >
                      {'-->'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        <div className='mt-4'>
          <div className='carousel w-full overflow-x-scroll'>
            {fileUrls.length > 0 &&
              fileUrls.map(
                (file, index) =>
                  fileUrls && (
                    <div
                      key={Math.random()}
                      className='w-full] carousel-item relative m-0'
                      onClick={() => setIndexFileforModal(index)}
                    >
                      {file.mediaType === 'image' ? (
                        <Image
                          className='h-48 w-48 border object-cover p-0'
                          src={imgs[index]}
                          alt={'uploaded image ' + index}
                          width={100}
                          height={100}
                        />
                      ) : file.mediaType === 'video' ? (
                        <video
                          className='m-0 h-48 w-48 border object-cover p-0'
                          src={imgs[index]}
                        />
                      ) : file.mediaType === 'audio' ? (
                        <div className='m-0 flex h-48 w-48 items-center justify-center border p-4'>
                          <p className='text-2xl font-extrabold'>
                            AUDIO
                            <br />
                            FILE
                          </p>
                        </div>
                      ) : (
                        <Image
                          className='h-48 w-48 border object-cover p-0'
                          src={
                            imgs[index]
                              ? 'https://img.youtube.com/vi/' +
                                imgs[index].substring(
                                  imgs[index].indexOf('=') + 1
                                ) +
                                '/default.jpg'
                              : imgs[index]
                          }
                          alt={'uploaded image ' + index}
                          width={100}
                          height={100}
                        />
                      )}
                      <a
                        href='#modal-artwork-media'
                        className='absolute left-0 top-0 h-full w-full'
                      />
                      <div className='absolute top-0 flex h-8 w-full items-center justify-between bg-white/50 px-2'>
                        {file.mediaType !== 'audio' &&
                        file.mediaType !== 'url' ? (
                          <button
                            className={`${
                              thumbnail === index
                                ? 'text-secondary'
                                : 'text-primary'
                            } tooltip tooltip-bottom h-5 w-5`}
                            data-tip='썸네일 선택'
                            onClick={() => setThumbnail(index)}
                          >
                            {thumbnail === index ? (
                              <AiOutlineCheck />
                            ) : (
                              <AiOutlineFileImage />
                            )}
                          </button>
                        ) : (
                          <div></div>
                        )}
                        <button
                          className='tooltip tooltip-bottom h-5 w-5'
                          data-tip='삭제'
                          onClick={() => handleDeleteFile(index)}
                        >
                          <AiFillDelete />
                        </button>
                      </div>
                      <div className='absolute bottom-0'>
                        <p className='bg-white/50 p-4 text-4xl font-black text-gray-700 dark:text-neutral-400'>
                          {index + 1}
                        </p>
                      </div>
                    </div>
                  )
              )}
            {fileUrls.length < 10 && fileUrls.length > 0 && (
              <>
                <input
                  type='file'
                  id='add-more'
                  className='hidden'
                  accept='image/jpeg, image/png, image/gif, video/mp4, video/mov, video/avi, audio/mp3, audio/sav, audio/ogg'
                  multiple
                  onChange={handleFileAdded}
                />
                <div className='h-48 w-48'>
                  <label
                    className='btn m-0 h-24 w-48 rounded-none text-xl'
                    htmlFor='add-more'
                  >
                    업로드
                  </label>
                  <label
                    className='btn m-0 h-24 w-48 rounded-none text-xl'
                    htmlFor='modal-add-link'
                  >
                    링크 추가
                  </label>
                </div>
              </>
            )}
          </div>

          {fileUrls.length > 0 && (
            <div>
              <p className='w-full text-sm font-light'>
                파일 갯수 : {fileUrls.length}개
                <br />
                파일 용량 :{' '}
                {(
                  fileUrls.reduce(
                    (acc, cur) => (cur.file ? cur.file.size + acc : acc),
                    0
                  ) / 1000000
                ).toFixed(2)}
                MB / <b className='font-bold'>100MB</b>
              </p>
              <p className='my-6 w-full text-sm font-bold text-gray-600 dark:text-neutral-400'>
                업로드한 미디어를 선택하면 설명을 추가할 수 있습니다.
              </p>
            </div>
          )}
        </div>
        <div className='flex h-full w-full flex-col items-center justify-center space-y-2'>
          <Editor
            type='create'
            fileUrls={fileUrls}
            resetAfterUpload={resetAfterUpload}
            thumbnail={thumbnail}
          />
        </div>
        <input type='checkbox' id='modal-add-link' className='modal-toggle' />
        <div className='modal'>
          <div className='modal-box relative'>
            <label
              htmlFor='modal-add-link'
              className='btn btn-circle btn-sm absolute right-2 top-2'
            >
              ✕
            </label>
            <h3 className='text-lg font-bold'>링크로 작품 미디어 추가</h3>
            <form className='form-control' onSubmit={handleLinkAdded}>
              <input
                type='link'
                id='link'
                placeholder='https://www.youtube.com/watch?v=...'
                className='input input-bordered w-full'
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
              />
              <button className='btn btn-primary mt-3 w-full' type='submit'>
                추가
              </button>
            </form>
          </div>
        </div>
      </TabLayout>
      <Seo templateTitle='작품 업로드' />
      <Footer />
      <BottomBar tab='upload' />
    </>
  );
};

export default Page;
