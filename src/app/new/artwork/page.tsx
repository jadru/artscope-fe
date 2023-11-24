'use client';

import { Button } from '@nextui-org/react';
import { Bold } from '@tiptap/extension-bold';
import { BulletList } from '@tiptap/extension-bullet-list';
import { Document } from '@tiptap/extension-document';
import { Heading } from '@tiptap/extension-heading';
import { Italic } from '@tiptap/extension-italic';
import { Link } from '@tiptap/extension-link';
import { ListItem } from '@tiptap/extension-list-item';
import { OrderedList } from '@tiptap/extension-ordered-list';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Strike } from '@tiptap/extension-strike';
import { Text } from '@tiptap/extension-text';
import { Underline } from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import { useDebounce } from '@toss/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import {
  BiArrowBack,
  BiBold,
  BiItalic,
  BiListOl,
  BiListUl,
  BiStrikethrough,
  BiUnderline,
} from 'react-icons/bi';
import { toast } from 'react-toastify';
import { Markdown } from 'tiptap-markdown';

import '@/styles/editor.scss';

import getVideoCoverFromLocal from '@/components/New/Artworks/getVideoCoverFromLocal';
import { initialArtWork } from '@/components/New/Artworks/initialArtworkSchema';
import PublicTypeCheckBox, {
  PublicType,
} from '@/components/New/Artworks/PublicTypeCheckBox';
import NewMediaView from '@/components/New/Media/NewMediaView';
import NewTagView from '@/components/New/Tag/NewTagView';

import jxios from '@/utils/jxios';

import { ArtWorkMediaType } from '@/types/artwork';

const NewArtwork = () => {
  const [fileUrls, setFileUrls] = useState<ArtWorkMediaType[]>([]);
  const [tagCount, setTagCount] = useState<string[]>([]);
  const [imgs, setImgs] = useState<string[]>([]);
  const { push } = useRouter();
  const [isUpload, setIsUpload] = useState(false);
  const [publicType, setPublicType] = useState<PublicType>('public');
  const placeholderText = '작품을 자유롭게 설명해주세요.';

  const CustomDocument = Document.extend({
    content: 'heading block* paragraph+',
  });

  const editor = useEditor({
    extensions: [
      CustomDocument,
      Heading.configure({
        levels: [1],
      }),
      Link.configure({
        protocols: ['http', 'https'],
      }),
      Text,
      Bold,
      Italic,
      Markdown.configure({
        html: false,
        tightLists: true,
        linkify: true,
        transformPastedText: true,
        transformCopiedText: true,
      }),
      Strike,
      Underline,
      BulletList,
      ListItem,
      OrderedList,
      Paragraph,
      Placeholder.configure({
        emptyNodeClass: 'is-artwork-editor-empty',
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return '작품 제목을 입력해주세요.';
          }
          return placeholderText;
        },
        showOnlyCurrent: false,
      }),
    ],
    content: '',
    autofocus: true,
  });

  const handleCreateSaveButton = useDebounce(async () => {
    if (isUpload) return;
    try {
      if (fileUrls.length === 0) {
        toast.warn('이미지, 영상 또는 썸네일을 업로드해주세요.');
        return;
      }
      if (
        editor?.getHTML().substring(4, editor?.getHTML().indexOf('<', 4))
          .length === 0
      ) {
        toast.warn('제목을 입력해주세요.');
        return;
      }
      if (
        fileUrls.reduce(
          (acc, cur) => (cur.file ? cur.file.size + acc : acc),
          0
        ) /
          1000000 >
        100
      ) {
        setIsUpload(false);
        toast.warn('파일 용량이 너무 큽니다.');
        return;
      }
      setIsUpload(true);
      const newState = { ...initialArtWork };
      const markdownContent = editor?.storage.markdown.getMarkdown() || '';
      newState.dto.title =
        editor?.getHTML().substring(4, editor?.getHTML().indexOf('<', 4)) || '';
      newState.dto.description = markdownContent.slice(
        markdownContent.indexOf('\n') + 2
      );
      newState.dto.tags = tagCount;
      newState.dto.visible = publicType === 'public';

      const formData = new FormData();
      if (fileUrls[0].mediaType === 'video') {
        const cover = (await getVideoCoverFromLocal(
          fileUrls[0].file as File,
          1.5
        )) as Blob;
        formData.append(
          'thumbnailFile',
          new File([cover], 'thumbnail.jpg', { type: 'image/jpeg' })
        );
      } else if (fileUrls[0].mediaType === 'image') {
        formData.append('thumbnailFile', fileUrls[0].file as File);
      } else {
        fileUrls[0].linkUrl &&
          formData.append(
            'thumbnailFile',
            await fetch(
              'https://img.youtube.com/vi/' +
                fileUrls[0].linkUrl.substring(
                  fileUrls[0].linkUrl.indexOf('=') + 1
                ) +
                '/maxresdefault.jpg',
              {
                mode: 'no-cors',
                headers: {
                  'Access-Control-Allow-Origin': '*',
                  Accept: '*/*',
                  'Content-Type': 'image/jpeg',
                },
              }
            ).then((res) => res.blob()),
            'yt_thumbnail.jpg'
          );
      }
      newState.dto.medias = [];
      fileUrls.forEach((media) => {
        media.mediaType === 'url'
          ? formData.append(
              'mediaFiles',
              new File([media.linkUrl as string], 'mediaFiles', {
                type: 'text/plain',
              })
            )
          : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            formData.append('mediaFiles', media.file);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        newState.dto.medias.push({
          mediaType: media.mediaType,
          description: media.description,
        });
      });
      formData.append(
        'dto',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
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
          if (res.status === 201) {
            toast.success('작품이 업로드되었습니다.');
            push('/artworks');
          }
        })
        .catch((err) => {
          toast.error(err.response.data);
        });
    } catch (err) {
      toast.error((err as string) || '작품 업로드에 실패했습니다.');
    } finally {
      setIsUpload(false);
    }
  }, 500);

  const handleBackButton = () => {
    if (editor?.getHTML() !== '<p></p>' || fileUrls.length > 0) {
      if (confirm('작성 중인 내용이 있습니다. 정말로 나가시겠습니까?')) {
        push('/');
      }
    } else {
      push('/');
    }
  };

  return (
    <>
      <div className='fixed top-0 z-50 flex h-16 w-full max-w-[718px] items-center justify-between gap-5 border-b bg-default-50 px-5'>
        <button onClick={handleBackButton}>
          <BiArrowBack className='h-6 w-6 hover:text-blue-600' />
        </button>
        <div className='flex items-center justify-center gap-5'>
          <button
            onClick={() => {
              if (editor) {
                editor.chain().focus().toggleBold().run();
              }
            }}
            className={`hover:text-primary ${
              editor?.isActive('bold') ? 'text-black' : 'text-default'
            }`}
          >
            <BiBold size={25} />
          </button>
          <button
            onClick={() => {
              if (editor) {
                editor.chain().focus().toggleItalic().run();
              }
            }}
            className={`hover:text-primary ${
              editor?.isActive('italic') ? 'text-black' : 'text-default'
            }`}
          >
            <BiItalic size={25} />
          </button>
          <button
            onClick={() => {
              if (editor) {
                editor.chain().focus().toggleStrike().run();
              }
            }}
            className={`hover:text-primary ${
              editor?.isActive('strike') ? 'text-black' : 'text-default'
            }`}
          >
            <BiStrikethrough size={25} />
          </button>
          <button
            onClick={() => {
              if (editor) {
                editor.chain().focus().toggleUnderline().run();
              }
            }}
            className={`hover:text-primary ${
              editor?.isActive('underline') ? 'text-black' : 'text-default'
            }`}
          >
            <BiUnderline size={25} />
          </button>
          <button
            onClick={() => {
              if (editor) {
                editor.chain().focus().toggleBulletList().run();
              }
            }}
            className={`hover:text-primary ${
              editor?.isActive('bulletList') ? 'text-black' : 'text-default'
            }`}
          >
            <BiListUl size={25} />
          </button>
          <button
            onClick={() => {
              if (editor) {
                editor.chain().focus().toggleOrderedList().run();
              }
            }}
            className={`hover:text-primary ${
              editor?.isActive('orderedList') ? 'text-black' : 'text-default'
            }`}
          >
            <BiListOl size={25} />
          </button>
        </div>
        <div></div>
      </div>
      <div className='h-16'></div>
      <div className='w-full space-y-2 overflow-y-scroll p-4'>
        {editor && <EditorContent editor={editor} className='min-h-[80px]' />}
        <NewTagView tagCount={tagCount} setTagCount={setTagCount} />
        <NewMediaView
          fileUrls={fileUrls}
          setFileUrls={setFileUrls}
          setImgs={setImgs}
          imgs={imgs}
          header='작품 미디어 또는 링크 업로드'
        />
      </div>
      <div className='h-16'></div>
      <div className='fixed bottom-0 z-50 flex h-16 w-full max-w-[718px] items-center justify-between border-t bg-default-50 px-3'>
        <PublicTypeCheckBox
          publicType={publicType}
          setPublicType={setPublicType}
        />
        <Button
          onClick={handleCreateSaveButton}
          disabled={isUpload}
          spinnerPlacement='end'
          isLoading={isUpload}
          color='primary'
          className={`
            h-12 ${isUpload ? 'opacity-20' : ''}`}
        >
          {isUpload ? '업로드 중...' : '작품 업로드'}
        </Button>
      </div>
    </>
  );
};

export default NewArtwork;
