import React, { MutableRefObject, useRef, useState } from 'react';

const MAX_COUNT = 7;
const Upload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const hiddenFileInput = useRef() as MutableRefObject<HTMLInputElement>;
  const handleUploadFiles = (files: File[]) => {
    let limitExceeded = false;
    const uploaded: File[] = [...uploadedFiles];
    files.some((file: File) => {
      if (uploaded.findIndex((f) => f.name === file.name) === -1) {
        uploaded.push(file);
      }
      if (uploaded.length > MAX_COUNT) limitExceeded = true;
    });
    if (!limitExceeded) setUploadedFiles(uploaded);
  };
  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    handleUploadFiles(chosenFiles);
  };
  return (
    <>
      <div className='flex h-full w-full flex-col items-center justify-center space-y-2 py-12'>
        <p className='text-5xl font-medium'>새 Artwork 포스팅</p>
        <button
          className='btn-primary btn'
          onClick={() =>
            hiddenFileInput !== undefined && hiddenFileInput.current.click()
          }
        >
          컴퓨터에서 선택
        </button>
        <input
          id='fileupload'
          type='file'
          className='hidden'
          ref={hiddenFileInput}
          onChange={onFileUpload}
          multiple
          accept='video/mp4, image/png, image/jpeg'
        />
        <div className='m-12 flex w-[400px] min-w-full flex-row overflow-x-scroll'>
          {Array.from({ length: 7 }).map((value, index) => (
            <div className='rounded-md bg-orange-400 p-16' key={index + '_'}>
              <button className='btn' />
              <p className='text-white'>{index + 1}</p>
              <input type='text' />
            </div>
          ))}
        </div>
        <textarea
          className='textarea-primary textarea resize-none'
          placeholder='Bio'
        />
        <button className='btn-primary btn' type='submit'>
          Submit
        </button>
      </div>
    </>
  );
};

export default Upload;
