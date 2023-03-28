import Lottie from 'lottie-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { toast } from 'react-toastify';

import Seo from '@/components/Seo';
import BottomBar from '@/components/TabLayout/BottomBar';

const FILETYPES = ['JPG', 'PNG', 'GIF', 'MP4', 'MOV'];

const Upload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileUrls, setFileUrls] = useState<
    { type: string; url: string; file: File; description: string }[]
  >([]);
  const [indexFileforModal, setIndexFileforModal] = useState<number>(0);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(uploadedFiles);
    convertFiletoUrl(uploadedFiles);
  }, [uploadedFiles]);
  const handleFileChange = (file: File[]) => {
    if (file) setUploadedFiles(file);
  };
  const convertFiletoUrl = (files: File[]) => {
    const urlList: {
      type: string;
      url: string;
      file: File;
      description: string;
    }[] = [];
    for (let i = 0; i < files.length; i++) {
      urlList.push({
        type: files[i].type,
        url: URL.createObjectURL(files[i]),
        file: files[i],
        description: '',
      });
    }
    setFileUrls(urlList);
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
  return (
    <>
      {fileUrls.length === 0 ? (
        <>
          <div className='mb-12 flex h-full w-full flex-col items-center justify-center space-y-2 py-12'>
            <p className='mb-8 text-4xl font-bold'>작품 업로드</p>
            <FileUploader
              handleChange={handleFileChange}
              name='file'
              types={FILETYPES}
              multiple={true}
              label='사진과 동영상을 여기에 끌어오세요'
              hoverTitle='여기에 놓기'
              onTypeError={() => alertError('지원하지 않는 파일 형식입니다')}
              onMaxSizeError={() => alertError('파일 용량이 너무 큽니다')}
              onMaxFilesError={() => alertError('파일 개수가 너무 많습니다')}
            >
              <div className='border-1 rounded-box flex w-96 flex-col items-center justify-center space-y-3 border border-fuchsia-900 p-12'>
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
        <div className='flex h-full w-full flex-col items-center justify-center py-12'>
          <div className='modal' id='modal-artwork-media'>
            <div className='modal-box flex flex-col items-center justify-center text-center'>
              <p className='text-lg'>미디어 설명 추가</p>
              {fileUrls[indexFileforModal].type.startsWith('image') ? (
                <Image
                  src={fileUrls[indexFileforModal].url}
                  alt='uploaded image'
                  width={300}
                  height={300}
                />
              ) : (
                <video
                  src={fileUrls[indexFileforModal].url}
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
          <div className='flex grid w-[302px] grid-cols-3 flex-col items-center justify-center space-y-0 space-x-0'>
            {fileUrls &&
              fileUrls.length > 0 &&
              fileUrls.map((file, index) => (
                <a
                  key={index + '_'}
                  className='m-0'
                  href='#modal-artwork-media'
                  onClick={() => setIndexFileforModal(index)}
                >
                  <div
                    className={`${
                      fileUrls[index].description !== ''
                        ? 'tooltip tooltip-bottom'
                        : ''
                    } relative m-0 mt-1 h-24 w-24 border p-0`}
                    data-tip={fileUrls[index].description}
                  >
                    {file.type.startsWith('image') ? (
                      <Image
                        src={file.url}
                        alt={'uploaded image ' + index}
                        style={{ margin: 0, padding: 0, objectFit: 'cover' }}
                        fill
                      />
                    ) : (
                      <video
                        className='h-24 w-24 object-cover'
                        src={file.url}
                      />
                    )}
                  </div>
                </a>
              ))}
          </div>
          <p className='my-6 text-sm font-bold '>
            업로드한 미디어를 선텍하면 설명을 추가할 수 있습니다.
          </p>
          <input
            className='text-md input-primary input mb-2 w-[302px]'
            placeholder='작품 제목'
          />
          <textarea
            className='text-md textarea-primary textarea mb-2 h-64 w-[302px] resize-none'
            placeholder='작품에 대한 간단한 설명 입력'
          />
          <div className='form-control mb-2 w-[302px] '>
            <label className='label cursor-pointer'>
              <span className='label-text'>내 작품 숨기기</span>
              <input type='checkbox' className='toggle-success toggle' />
            </label>
          </div>
          <button className='btn-primary btn w-[302px]'>작품 업로드</button>
        </div>
      )}
      <Seo templateTitle='Upload' />
      <BottomBar tab='upload' />
    </>
  );
};

export default Upload;
