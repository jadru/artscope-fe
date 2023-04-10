import Lottie from 'lottie-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { toast } from 'react-toastify';

import Seo from '@/components/Seo';
import BottomBar from '@/components/TabLayout/BottomBar';
import Title from '@/components/Title';

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

const initialArtWork: ArtWorkApiRequestType = {
  dto: {
    title: '',
    description: '',
    visible: true,
    medias: [],
  },
  mediaFiles: [],
};

const Upload = () => {
  const { push } = useRouter();
  const [fileUrls, setFileUrls] = useState<ArtWorkMediaType[]>([]);
  const [imgs, setImgs] = useState<string[]>([]);
  const [indexFileforModal, setIndexFileforModal] = useState<number>(0);
  const [artwork, setArtwork] = useState<ArtWorkApiRequestType>(initialArtWork);
  const [isUpload, setIsUpload] = useState<boolean>(false);
  const [checkVisible, setCheckVisible] = useState<boolean>(true);
  const handleFileSelected = async (files: File[]) => {
    if (files.length > 8) {
      toast.warn('최대 8개의 파일만 업로드할 수 있습니다.');
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (isUpload) return;
    e.preventDefault();
    await setIsUpload(true);
    const newState = { ...artwork };
    const inputData = new FormData(e.target as HTMLFormElement);
    newState.dto.title = inputData.get('title') as string;
    newState.dto.description = inputData.get('description') as string;
    newState.dto.visible = checkVisible;

    const formData = new FormData();
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
                placeholder='작가, 제목, 작품기법, 사이즈, 제작연도 등'
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
              />
              <div className='modal-action'>
                {indexFileforModal > 0 && (
                  <button
                    className='btn-ghost btn'
                    onClick={() =>
                      setIndexFileforModal((prevState) => prevState - 1)
                    }
                  >
                    이전 미디어
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
                    다음 미디어
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
                    className='m-0'
                    href='#modal-artwork-media'
                    onClick={() => setIndexFileforModal(index)}
                  >
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
                placeholder='작품 제목'
                required
              />
              <textarea
                name='description'
                className='text-md textarea-primary textarea mb-2 h-64 w-[302px] resize-none'
                placeholder='작품에 대한 간단한 설명 입력'
                required
              />
              <div className='form-control mb-2 w-[302px] '>
                <label className='label cursor-pointer'>
                  <span className='label-text'>내 작품 플랫폼에 공개</span>
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
                className={`btn-primary btn w-[302px] ${isUpload && 'loading'}`}
                type='submit'
                disabled={fileUrls.length <= 0}
              >
                작품 업로드
              </button>
            </form>
          </div>
        </>
      )}
      <Seo templateTitle='Upload' />
      <BottomBar tab='upload' />
    </div>
  );
};

export default Upload;
