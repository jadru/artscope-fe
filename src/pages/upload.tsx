import Lottie from 'lottie-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { toast } from 'react-toastify';

import Seo from '@/components/Seo';
import Skeleton from '@/components/Skeleton';
import BottomBar from '@/components/TabLayout/BottomBar';

import { NEXT_PUBLIC_MEDIA_STORAGE_URL } from '@/constant/env';
import jxios from '@/utils/jxios';

import { ArtWorkMediaType, ArtWorkType } from '@/types';

const FILETYPES = ['JPG', 'JPEG', 'PNG', 'GIF', 'MP4', 'MOV'];

const initialArtWork: ArtWorkType = {
  title: '',
  description: '',
  visible: true,
  mediaUrls: [],
};

const Upload = () => {
  const { push } = useRouter();
  const [fileUrls, setFileUrls] = useState<ArtWorkMediaType[]>([]);
  const [indexFileforModal, setIndexFileforModal] = useState<number>(0);
  const [artwork, setArtwork] = useState<ArtWorkType>(initialArtWork);
  const singleUploadMedia = async (file: File, index: number) => {
    const formData = new FormData();
    formData.append('multipartFile', file);
    jxios
      .post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        setFileUrls((prev) => {
          const newState = [...prev];
          newState[index].mediaUrl = res.data;
          return newState;
        });
      })
      .catch((err) => {
        toast.error(err.response.data);
      });
  };

  const convertFiletoUrl = async (files: File[]) => {
    const urlList: ArtWorkMediaType[] = [];
    for (let i = 0; i < files.length; i++) {
      urlList.push({
        mediaType: files[i].type.startsWith('image') ? 'image' : 'video',
        mediaUrl: '',
        file: files[i],
        description: '',
      });
    }
    await setFileUrls(urlList);
    await urlList.forEach((file, index) => {
      singleUploadMedia(file.file, index);
    });
  };
  const alertError = (ErrorMessege: string) => {
    toast.warn(ErrorMessege, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newState = { ...artwork };
    newState.mediaUrls = [];
    fileUrls.forEach((media) => {
      newState.mediaUrls.push({
        mediaType: media.mediaType,
        mediaUrl: media.mediaUrl,
        description: media.description,
      });
    });
    jxios
      .post('/api/artworks', newState)
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
      });
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    e.target.name === 'visible'
      ? setArtwork((prev) => {
          return { ...artwork, visible: !prev.visible };
        })
      : setArtwork({
          ...artwork,
          [e.target.name]: e.target.value,
        });
  };

  return (
    <>
      {fileUrls.length === 0 ? (
        <>
          <div className='mb-12 flex h-full w-full flex-col items-center justify-center space-y-2 py-12'>
            <p className='mb-8 text-4xl font-bold'>작품 업로드</p>
            <FileUploader
              handleChange={convertFiletoUrl}
              name='file'
              types={FILETYPES}
              multiple={true}
              label='사진과 동영상을 여기에 끌어오세요'
              hoverTitle='여기에 놓기'
              onTypeError={() => alertError('지원하지 않는 파일 형식입니다')}
              onMaxSizeError={() => alertError('파일 용량이 너무 큽니다')}
              onMaxFilesError={() => alertError('파일 개수가 너무 많습니다')}
            >
              <div className='md:border-1 rounded-box flex w-96 flex-col items-center justify-center space-y-3 p-12 md:border md:border-fuchsia-900'>
                <Lottie
                  loop={true}
                  animationData={require('../../public/animation/110586-line-art.json')}
                  height={300}
                  width={300}
                />
                <p className='text-xl font-medium text-gray-800 dark:text-gray-200'>
                  작품(사진과 동영상)을 <br /> 여기에 끌어다 놓으세요
                </p>
                <p className='btn-primary btn'>업로드하기</p>
              </div>
            </FileUploader>
          </div>
        </>
      ) : (
        <div className='flex h-full w-full flex-col items-center justify-center pt-12'>
          <div className='modal' id='modal-artwork-media'>
            <div className='modal-box flex flex-col items-center justify-center text-center'>
              <p className='text-lg'>미디어 설명 추가</p>
              {fileUrls[indexFileforModal].mediaType === 'image' ? (
                <Image
                  src={fileUrls[indexFileforModal].mediaUrl}
                  alt='uploaded image'
                  width={300}
                  height={300}
                />
              ) : (
                <video
                  src={
                    NEXT_PUBLIC_MEDIA_STORAGE_URL +
                    '/' +
                    fileUrls[indexFileforModal].mediaUrl
                  }
                  width={300}
                  autoPlay
                  loop
                />
              )}
              <input
                type='text'
                placeholder='설명을 입력해주세요'
                value={fileUrls[indexFileforModal].description}
                className='input-bordered input-primary input mt-2 w-[300px]'
                onChange={(e) => {
                  const newFileUrls = [...fileUrls];
                  newFileUrls[indexFileforModal].description = e.target.value;
                  setFileUrls(newFileUrls);
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
          <p className='mb-8 text-4xl font-bold'>작품 업로드</p>
          <div className='grid w-[302px] grid-cols-3 flex-col items-center justify-center space-y-0 space-x-0'>
            {fileUrls &&
              fileUrls.length > 0 &&
              fileUrls.map((file, index) =>
                file.mediaUrl === '' ? (
                  <Skeleton className='m-0 h-24 w-24' key={index + '_'} />
                ) : (
                  <a
                    key={index + '_'}
                    className='m-0'
                    href={file.mediaUrl !== '' ? '#modal-artwork-media' : ''}
                    onClick={() =>
                      file.mediaUrl !== '' && setIndexFileforModal(index)
                    }
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
                          className='border'
                          src={file.mediaUrl}
                          alt={'uploaded image ' + index}
                          style={{ margin: 0, padding: 0, objectFit: 'cover' }}
                          fill
                        />
                      ) : (
                        <video
                          className='m-0 h-24 w-24 border object-cover p-0'
                          src={
                            NEXT_PUBLIC_MEDIA_STORAGE_URL + '/' + file.mediaUrl
                          }
                        />
                      )}
                    </div>
                  </a>
                )
              )}
          </div>
          <p className='my-6 text-sm font-bold text-gray-700'>
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
              onChange={handleChange}
            />
            <textarea
              name='description'
              className='text-md textarea-primary textarea mb-2 h-64 w-[302px] resize-none'
              placeholder='작품에 대한 간단한 설명 입력'
              onChange={handleChange}
            />
            <div className='form-control mb-2 w-[302px] '>
              <label className='label cursor-pointer'>
                <span className='label-text'>내 작품 공개</span>
                <input
                  type='checkbox'
                  className='toggle-success toggle'
                  name='visible'
                  onChange={handleChange}
                  checked={artwork.visible}
                />
              </label>
            </div>
            <button className='btn-primary btn w-[302px]' type='submit'>
              작품 업로드
            </button>
            <p>작품을 업로드하면 2023 금샘미술관 작품 공모에 공모됩니다.</p>
          </form>
        </div>
      )}
      <Seo templateTitle='Upload' />
      <BottomBar tab='upload' />
    </>
  );
};

export default Upload;
