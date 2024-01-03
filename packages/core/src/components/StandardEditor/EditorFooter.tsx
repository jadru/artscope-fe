import { Button } from '@nextui-org/react';
import React from 'react';

export default function EditorFooter({
  isUpload,
  onSubmit,
  submitText = '업로드',
  footerContent,
}: {
  submitText?: string;
  isUpload: boolean;
  onSubmit: () => void;
  footerContent?: React.ReactNode;
}) {
  return (
    <>
      <div className='h-16'></div>
      <div className='bg-default-50 fixed bottom-0 z-40 flex h-16 w-full max-w-[718px] items-center justify-between border-t px-3'>
        {footerContent}
        <Button
          onClick={onSubmit}
          disabled={isUpload}
          spinnerPlacement='end'
          isLoading={isUpload}
          color='primary'
          className={`
            ${isUpload ? 'opacity-20' : ''}`}>
          {isUpload ? '업로드 중...' : submitText}
        </Button>
      </div>
    </>
  );
}
