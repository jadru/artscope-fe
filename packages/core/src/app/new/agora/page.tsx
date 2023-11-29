'use client';

import { Button, Input } from '@nextui-org/react';
import { Bold } from '@tiptap/extension-bold';
import { BulletList } from '@tiptap/extension-bullet-list';
import { Document } from '@tiptap/extension-document';
import { Heading } from '@tiptap/extension-heading';
import { History } from '@tiptap/extension-history';
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
  BiImage,
  BiItalic,
  BiListOl,
  BiListUl,
  BiStrikethrough,
  BiUnderline,
} from 'react-icons/bi';
import { toast } from 'react-toastify';
import { Markdown } from 'tiptap-markdown';

import '@/styles/editor.scss';

import NewMediaView from '@/components/New/Media/NewMediaView';

import AnonymousCheckBox from '@/app/new/agora/AnonymousCheckBox';
import { initialAgoraSchema } from '@/app/new/agora/initialAgoraSchema';
import jxios from '@/utils/jxios';

import { ArtWorkMediaType } from '@/types/artwork';

const NewArtwork = () => {
  const [fileUrls, setFileUrls] = useState<ArtWorkMediaType[]>([]);
  const [imgs, setImgs] = useState<string[]>([]);
  const { push } = useRouter();
  const [anonymousType, setAnonymousType] = useState<boolean>(true);
  const [isUpload, setIsUpload] = useState(false);
  const [insertImage, setInsertImage] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState<{
    agreeText: string;
    naturalText: string;
    disagreeText: string;
  }>({
    agreeText: '',
    naturalText: '',
    disagreeText: '',
  });
  const placeholderText = '주제에 대한 아고라 제안 이유를 설명해주세요.';

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
      History,
      OrderedList,
      Paragraph,
      Placeholder.configure({
        emptyNodeClass: 'is-artwork-editor-empty',
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return '토론한 주제를 입력해주세요.';
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
      if (buttonText.disagreeText.length === 0) {
        toast.warn('반대 의견 텍스트를 입력해주세요.');
        return;
      }
      if (buttonText.agreeText.length === 0) {
        toast.warn('찬성 의견 텍스트를 입력해주세요.');
        return;
      }
      if (buttonText.naturalText.length === 0) {
        toast.warn('중립 의견 텍스트를 입력해주세요.');
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
        fileUrls.length > 0 &&
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
      const newState = { ...initialAgoraSchema };
      const markdownContent = editor?.storage.markdown.getMarkdown() || '';
      newState.dto.title =
        editor?.getHTML().substring(4, editor?.getHTML().indexOf('<', 4)) || '';
      newState.dto.content = markdownContent.slice(
        markdownContent.indexOf('\n') + 2
      );
      newState.dto.agreeText = buttonText.agreeText;
      newState.dto.disagreeText = buttonText.disagreeText;
      newState.dto.naturalText = buttonText.naturalText;
      newState.dto.isAnonymous = anonymousType;

      const formData = new FormData();
      if (fileUrls.length > 0) {
        formData.append('thumbnailFile', fileUrls[0].file as File);
        newState.dto.thumbnail = {
          mediaType: 'image',
        };
        newState.dto.medias = [];
        fileUrls.forEach((media) => {
          formData.append('mediaFiles', media.file as File);
          newState.dto.medias?.push({
            mediaType: media.mediaType,
          });
        });
      }
      formData.append(
        'dto',
        new Blob([JSON.stringify(newState.dto)], { type: 'application/json' })
      );
      await jxios
        .post('/api/agoras', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
          },
        })
        .then((res) => {
          if (res.status === 201) {
            toast.success('아고라가 작성되었습니다.');
            push('/agoras');
          }
        })
        .catch((err) => {
          toast.error(err.response.data);
        });
    } catch (err) {
      toast.error((err as string) || '아고라 업로드에 실패했습니다.');
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
      <div className='bg-default-50 fixed top-0 z-50 flex h-16 w-full max-w-[718px] items-center justify-between gap-5 border-b px-5'>
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
          <button onClick={() => setInsertImage((prev) => !prev)}>
            <BiImage
              size={25}
              className={`hover:text-primary ${
                insertImage ? 'text-black' : 'text-default'
              }`}
            />
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
        {insertImage && (
          <NewMediaView
            fileUrls={fileUrls}
            setFileUrls={setFileUrls}
            setImgs={setImgs}
            imgs={imgs}
            header='토론 관련 이미지 업로드'
            onlyImage
          />
        )}
      </div>
      <div className='flex w-full flex-col gap-2 p-3 md:flex-row'>
        <Input
          label='반대 의견 텍스트'
          placeholder='반대'
          isRequired
          value={buttonText.disagreeText}
          onValueChange={(value) =>
            setButtonText((prev) => {
              return {
                ...prev,
                disagreeText: value,
              };
            })
          }
        />
        <Input
          label='중립 의견 텍스트'
          placeholder='고민해봐야'
          isRequired
          value={buttonText.naturalText}
          onValueChange={(value) =>
            setButtonText((prev) => {
              return {
                ...prev,
                naturalText: value,
              };
            })
          }
        />
        <Input
          label='찬성 의견 텍스트'
          placeholder='동의'
          isRequired
          value={buttonText.agreeText}
          onValueChange={(value) =>
            setButtonText((prev) => {
              return {
                ...prev,
                agreeText: value,
              };
            })
          }
        />
      </div>
      <div className='h-16'></div>
      <div className='bg-default-50 fixed bottom-0 z-50 flex h-16 w-full max-w-[718px] items-center justify-between border-t px-3'>
        <AnonymousCheckBox
          anonymousType={anonymousType}
          setAnonymousType={setAnonymousType}
        />
        <Button
          onClick={handleCreateSaveButton}
          disabled={isUpload}
          color='primary'
          spinnerPlacement='end'
          isLoading={isUpload}
          className={`
            h-12 ${isUpload ? 'opacity-20' : ''}`}
        >
          {isUpload ? '업로드 중...' : '아고라 시작'}
        </Button>
      </div>
    </>
  );
};

export default NewArtwork;
