import React from 'react';
import TextareaAutoSize from 'react-textarea-autosize';

import PublicTypeCheckBox from '@/components/New/Artworks/PublicTypeCheckBox';
import { PublicType } from '@/components/New/Artworks/PublicTypeCheckBox';
import UserInfo from '@/components/UserInfo';

type Props = {
  postTitle: string;
  setPostTitle: React.Dispatch<React.SetStateAction<string>>;
  postContent: string;
  setPostContent: React.Dispatch<React.SetStateAction<string>>;
  publicType: PublicType;
  setPublicType: React.Dispatch<React.SetStateAction<PublicType>>;
  isExpanded: boolean;
  placeholder: string;
};

export default function NewArtworkForm({
  postTitle,
  setPostTitle,
  postContent,
  setPostContent,
  publicType,
  setPublicType,
  isExpanded,
  placeholder,
}: Props) {
  return (
    <>
      <div className='flex flex-row gap-2'>
        <UserInfo />
        <PublicTypeCheckBox
          publicType={publicType}
          setPublicType={setPublicType}
        />
      </div>
      <input
        defaultValue={postTitle}
        placeholder='작품 제목'
        autoFocus
        className='mt-1 w-full text-xl font-bold'
        onChange={(e) => {
          setPostTitle(e.currentTarget.value);
        }}
        onKeyDown={(e) => {
          if (e.nativeEvent.isComposing) return;
        }}
      />
      <TextareaAutoSize
        defaultValue={postContent}
        placeholder={placeholder}
        minRows={isExpanded ? undefined : 5}
        maxRows={isExpanded ? undefined : 12}
        className='min-h-12 mt-0.5 max-h-[90%] w-full resize-none !border-0 px-0 text-lg focus:border-none focus:shadow-none focus:shadow-transparent focus:ring-0'
        onChange={(e) => {
          setPostContent(e.currentTarget.value);
        }}
        onKeyDown={(e) => {
          if (e.nativeEvent.isComposing) return;
        }}
        onFocus={(e) => {
          const val = e.target.value;
          e.target.value = '';
          e.target.value = val;
        }}
      />
    </>
  );
}
