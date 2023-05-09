import Lottie from 'lottie-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
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

const Upload = () => {
  useAuth();
  const [fileUrls, setFileUrls] = useState<ArtWorkMediaType[]>([]);
  const [imgs, setImgs] = useState<string[]>([]);
  const [indexFileforModal, setIndexFileforModal] = useState<number>(0);

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

  const handleDeleteFile = async (index: number) => {
    if (confirm('미디어를 삭제하시겠습니까?')) {
      await setIndexFileforModal(0);
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
    <div>
      <NavBar />
      <TabLayout top>
        <Title>작품 업로드</Title>
        {fileUrls.length === 0 ? (
          <>
            <FileUploader
              handleChange={handleFileSelected}
              name='file'
              types={FILETYPES}
              multiple={true}
              label='사진과 동영상을 여기에 끌어오세요'
              hoverTitle='여기에 놓기'
              onTypeError={() => toast.warn('지원하지 않는 파일 형식입니다')}
              onMaxSizeError={() => toast.warn('파일 용량이 너무 큽니다')}
              onMaxFilesError={() => toast.warn('파일 개수가 너무 많습니다')}
            >
              <div className='md:border-1 rounded-box flex cursor-pointer flex-col items-center justify-center space-x-3 p-12 text-center hover:bg-gray-200 md:flex-row md:border md:border-fuchsia-900 md:text-left'>
                <Lottie
                  loop={true}
                  animationData={require('../../public/animation/110586-line-art.json')}
                  className='h-48 w-48'
                />
                <p className='text-xl font-medium text-gray-800 dark:text-gray-200'>
                  작품(사진과 동영상, 음원)을 <br /> 여기에 끌어다 놓으세요{' '}
                  <br /> <b>업로드하기</b>
                </p>
              </div>
            </FileUploader>
          </>
        ) : (
          <>
            <div className='modal' id='modal-artwork-media'>
              <div className='modal-box flex flex-col items-center justify-center text-center'>
                <p className='text-lg'>미디어 설명 추가</p>
                {fileUrls[indexFileforModal].mediaType === 'image' ? (
                  <Image
                    src={imgs[indexFileforModal]}
                    alt='uploaded image'
                    width={300}
                    height={300}
                  />
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
                  value={fileUrls[indexFileforModal].description}
                  className='input-bordered input-primary input mt-2 w-[300px]'
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
                      className='btn-ghost btn'
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
                      className='btn-ghost btn'
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
                      ) : (
                        <div className='m-0 flex h-48 w-48 items-center justify-center border p-4'>
                          <p className='text-2xl font-extrabold'>
                            AUDIO
                            <br />
                            FILE
                          </p>
                        </div>
                      )}
                      <a
                        href='#modal-artwork-media'
                        className='absolute top-0 left-0 h-full w-full'
                      />
                      <div className='absolute top-0 flex h-8 w-full items-center justify-between bg-white/50 px-2'>
                        {file.mediaType !== 'audio' ? (
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
                <label
                  className='btn-ghost btn m-0 h-48 w-48 rounded-none bg-gray-700/50 text-3xl'
                  htmlFor='add-more'
                >
                  +
                </label>
              </>
            )}
          </div>

          {fileUrls.length > 0 && (
            <div>
              <p className='w-full text-sm font-light'>
                파일 갯수 : {fileUrls.length + 1}
                <br />
                파일 용량 :{' '}
                {(
                  fileUrls.reduce((acc, cur) => cur.file.size + acc, 0) /
                  1000000
                ).toFixed(2)}
                MB / <b className='font-bold'>100MB</b>
              </p>
              <p className='my-6 w-full text-sm font-bold text-gray-700 dark:text-neutral-400'>
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
      </TabLayout>
      <Seo templateTitle='Upload' />
      <Footer />
      <BottomBar tab='upload' />
    </div>
  );
};

export default Upload;
