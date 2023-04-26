import Lottie from 'lottie-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { AiOutlineCheck, AiOutlineFileImage } from 'react-icons/ai';
import { toast } from 'react-toastify';

import useAuth from '@/hooks/useAuth';

import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';
import Title from '@/components/Title';

import {
  UPLOAD_DESCRIPTION_MAX_INPUT_LENGTH,
  UPLOAD_MEDIA_MAX_INPUT_LENGTH,
  UPLOAD_TITLE_MAX_INPUT_LENGTH,
} from '@/constant/config';
import jxios from '@/utils/jxios';

import { ArtWorkApiRequestType, ArtWorkMediaType } from '@/types';

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

const getVideoCover = (file: File, seekTo = 0.0) => {
  return new Promise((resolve, reject) => {
    // load the file to a video player
    const videoPlayer = document.createElement('video');
    videoPlayer.setAttribute('src', URL.createObjectURL(file));
    videoPlayer.load();
    videoPlayer.addEventListener('error', (ex: ErrorEvent) => {
      reject('error when loading video file' + ex);
    });
    // load metadata of the video to get video duration and dimensions
    videoPlayer.addEventListener('loadedmetadata', () => {
      // seek to user defined timestamp (in seconds) if possible
      if (videoPlayer.duration < seekTo) {
        reject('video is too short.');
        return;
      }
      // delay seeking or else 'seeked' event won't fire on Safari
      setTimeout(() => {
        videoPlayer.currentTime = seekTo;
      }, 200);
      // extract video thumbnail once seeking is complete
      videoPlayer.addEventListener('seeked', () => {
        // define a canvas to have the same dimension as the video
        const canvas = document.createElement('canvas');
        canvas.width = videoPlayer.videoWidth;
        canvas.height = videoPlayer.videoHeight;
        // draw the video frame to canvas
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
        // return the canvas image as a blob
        ctx.canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          'image/jpeg',
          0.75 /* quality */
        );
      });
    });
  });
};

const initialArtWork: ArtWorkApiRequestType = {
  dto: {
    title: '',
    description: '',
    visible: true,
    tags: [],
    medias: [],
    thumbnail: { mediaType: 'image', description: '' },
  },
  mediaFiles: [],
  thumbnailFile: undefined,
};

const Upload = () => {
  useAuth();
  const { push } = useRouter();
  const [fileUrls, setFileUrls] = useState<ArtWorkMediaType[]>([]);
  const [imgs, setImgs] = useState<string[]>([]);
  const [indexFileforModal, setIndexFileforModal] = useState<number>(0);
  const [artwork, setArtwork] = useState<ArtWorkApiRequestType>(initialArtWork);
  const [isUpload, setIsUpload] = useState<boolean>(false);
  const [checkVisible, setCheckVisible] = useState<boolean>(true);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (isUpload) return;
    e.preventDefault();
    await setIsUpload(true);
    const newState = { ...artwork };
    const inputData = new FormData(e.target as HTMLFormElement);
    newState.dto.title = inputData.get('title') as string;
    newState.dto.description = inputData.get('description') as string;
    const tagString = inputData.get('tags') as string;
    newState.dto.tags = tagString.split(',') as string[];
    newState.dto.visible = checkVisible;

    const formData = new FormData();
    if (fileUrls[thumbnail].mediaType === 'video') {
      const cover = (await getVideoCover(
        fileUrls[thumbnail].file,
        1.5
      )) as Blob;
      formData.append(
        'thumbnailFile',
        new File([cover], 'thumbnail.jpg', { type: 'image/jpeg' })
      );
    } else if (fileUrls[thumbnail].mediaType === 'image') {
      formData.append('thumbnailFile', fileUrls[thumbnail].file);
    }

    newState.dto.medias = [];
    await fileUrls.forEach((media) => {
      formData.append('mediaFiles', media.file);
      newState.dto.medias.push({
        mediaType: media.mediaType,
        description: media.description,
      });
    });
    await formData.append(
      'dto',
      new Blob([JSON.stringify(newState.dto)], { type: 'application/json' })
    );
    await jxios
      .post('/api/artworks', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      })
      .then((res) => {
        setFileUrls([]);
        setIndexFileforModal(0);
        setArtwork(initialArtWork);

        if (res.status === 201) {
          push('/artwork').then(() =>
            toast.success('작품이 업로드되었습니다.')
          );
        }
      })
      .catch((err) => {
        toast.error(err.response.data);
      })
      .finally(() => {
        setIsUpload(false);
      });
  };

  return (
    <div>
      <NavBar />
      <TabLayout>
        <Title className='hidden'>작품 업로드</Title>
        {fileUrls.length === 0 ? (
          <>
            <div className='mb-12 flex h-full w-full flex-col items-center justify-center space-y-2 py-12'>
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
                <div className='md:border-1 rounded-box flex w-96 flex-col items-center justify-center space-y-3 p-12 md:border md:border-fuchsia-900'>
                  <Lottie
                    loop={true}
                    animationData={require('../../public/animation/110586-line-art.json')}
                    height={300}
                    width={300}
                  />
                  <p className='text-xl font-medium text-gray-800 dark:text-gray-200'>
                    작품(사진과 동영상, 음원)을 <br /> 여기에 끌어다 놓으세요
                  </p>
                  <p className='btn-primary btn'>업로드하기</p>
                </div>
              </FileUploader>
            </div>
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
            <div className='flex h-full w-full flex-col items-center justify-center pt-12'>
              <p className='mb-8 text-4xl font-bold'>작품 업로드</p>
              <div className='grid w-[302px] grid-cols-3 flex-col items-center justify-center space-y-0 space-x-0'>
                {fileUrls &&
                  fileUrls.length > 0 &&
                  fileUrls.map((file, index) => (
                    <a
                      key={Math.random()}
                      className='relative m-0'
                      href='#modal-artwork-media'
                      onClick={() => setIndexFileforModal(index)}
                    >
                      {file.mediaType !== 'audio' && (
                        <button
                          className={`${
                            thumbnail === index
                              ? 'badge-secondary'
                              : 'badge-primary'
                          } badge tooltip absolute top-2 left-2 z-40`}
                          data-tip='썸네일 선택'
                          onClick={() => setThumbnail(index)}
                        >
                          {thumbnail === index ? (
                            <AiOutlineCheck />
                          ) : (
                            <AiOutlineFileImage />
                          )}
                        </button>
                      )}

                      <div
                        className={`${
                          fileUrls[index].description !== ''
                            ? 'tooltip tooltip-bottom'
                            : ''
                        } relative m-0 mt-1 h-24 w-24 p-0`}
                        data-tip={fileUrls[index].description}
                      >
                        {file.mediaType === 'image' ? (
                          <Image
                            className='h-auto border object-contain'
                            src={imgs[index]}
                            alt={'uploaded image ' + index}
                            fill
                          />
                        ) : file.mediaType === 'video' ? (
                          <video
                            className='m-0 h-24 w-24 border object-cover p-0'
                            src={imgs[index]}
                          />
                        ) : (
                          <div className='m-0 flex h-24 w-24 items-center justify-center border'>
                            <p className='text-2xl font-extrabold'>
                              AUDIO
                              <br />
                              FILE
                            </p>
                          </div>
                        )}
                      </div>
                    </a>
                  ))}
              </div>
              <p className='my-6 text-sm font-bold text-gray-700 dark:text-neutral-400'>
                업로드한 미디어를 선텍하면 설명을 추가할 수 있습니다.
              </p>
              <form
                className='flex h-full w-full flex-col items-center justify-center space-y-2'
                onSubmit={handleSubmit}
              >
                <input
                  type='text'
                  name='title'
                  className='text-md input-primary input mb-2 w-[302px]'
                  placeholder='작품 컬렉션 제목'
                  required
                  maxLength={UPLOAD_TITLE_MAX_INPUT_LENGTH}
                />
                <textarea
                  name='description'
                  className='text-md textarea-primary textarea mb-2 h-64 w-[302px] resize-none'
                  placeholder='작품 컬렉션에 대한 간단한 설명'
                  required
                  maxLength={UPLOAD_DESCRIPTION_MAX_INPUT_LENGTH}
                />
                <input
                  type='text'
                  name='tags'
                  className='text-md input-primary input mb-2 w-[302px]'
                  placeholder='작품 컬렉션 태그 (","로 구분)'
                  maxLength={UPLOAD_TITLE_MAX_INPUT_LENGTH}
                />
                <div className='form-control mb-2 w-[302px] '>
                  <label className='label cursor-pointer'>
                    <span className='label-text'>
                      작품 컬렉션 Artscope 플랫폼에 공개
                    </span>
                    <input
                      type='checkbox'
                      className='toggle-success toggle'
                      name='visible'
                      onClick={() => setCheckVisible((prev) => !prev)}
                      checked={checkVisible}
                    />
                  </label>
                </div>
                <p className='text-sm font-light text-slate-600 dark:text-neutral-400'>
                  작품을 업로드하면 2023 금샘미술관 전시에 공모됩니다.
                </p>
                <button
                  className={`btn-primary btn w-[302px] ${
                    isUpload && 'loading'
                  }`}
                  type='submit'
                  disabled={fileUrls.length <= 0}
                >
                  작품 업로드
                </button>
              </form>
            </div>
          </>
        )}
      </TabLayout>
      <Seo templateTitle='Upload' />
      <Footer />
      <BottomBar tab='upload' />
    </div>
  );
};

export default Upload;
