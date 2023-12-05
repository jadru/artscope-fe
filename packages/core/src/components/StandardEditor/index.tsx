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
import { useRouter } from 'next/navigation';
import React from 'react';
import { Markdown } from 'tiptap-markdown';

import { useLeavePageConfirm } from '@/hooks/useLeavePageConfirm';

import NewMediaView from '@/components/New/Media/NewMediaView';
import EditorFooter from '@/components/StandardEditor/EditorFooter';
import EditorHeader from '@/components/StandardEditor/EditorHeader';

import { ArtWorkMediaType } from '@/types/artwork';

type StandardEditorProps = {
  placeholderText?: string;
  headingRequired?: boolean;
  documentHeading?: 0 | 1 | 3;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (markdown: string, medias: ArtWorkMediaType[]) => void;
  isUpload: boolean;
  submitText?: string;
  editContent?: string;
  mediaFileRequired?: boolean;
  onlyImage?: boolean;
  footer?: React.ReactNode;
  children?: React.ReactNode;
};

export default function StandardEditor({
  placeholderText = '내용을 입력해주세요.',
  headingRequired = false,
  documentHeading = 0,
  onSubmit,
  isUpload,
  submitText,
  editContent = undefined,
  mediaFileRequired = false,
  onlyImage = false,
  footer = <div className='h-1 w-1'></div>,
  children,
}: StandardEditorProps) {
  useLeavePageConfirm();
  const [fileUrls, setFileUrls] = React.useState<ArtWorkMediaType[]>([]);
  const [insertMedia, setInsertMedia] =
    React.useState<boolean>(mediaFileRequired);
  const HeadingDocument = Document.extend({
    content: 'heading block* paragraph+',
  });
  const router = useRouter();

  const editor = useEditor({
    extensions: [
      headingRequired ? HeadingDocument : Document,
      documentHeading === 3
        ? Heading.configure({
            levels: [1, 2, 3],
          })
        : documentHeading === 1
        ? Heading.configure({
            levels: [1],
          })
        : Heading.configure({
            levels: [],
          }),

      Link.configure({
        protocols: ['http', 'https'],
      }),
      Text,
      Bold,
      Italic,
      Markdown.configure({
        html: false,
        linkify: true,
        transformPastedText: true,
        transformCopiedText: true,
      }),
      Strike,
      Underline,
      BulletList,
      History,
      ListItem,
      OrderedList,
      Paragraph,
      Placeholder.configure({
        emptyNodeClass: 'is-artwork-editor-empty',
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return '제목을 입력해주세요.';
          }
          return placeholderText;
        },
        showOnlyCurrent: false,
      }),
    ],
    content: editContent
      ? editContent
      : headingRequired
      ? '<h1></h1><p></p>'
      : '',
    autofocus: true,
  });

  const handleBackButton = React.useCallback(() => {
    if (confirm('작성 중인 내용이 사라집니다. 정말로 나가시겠습니까?')) {
      router.back();
    }
  }, [router]);

  const handleSubmit = React.useCallback(() => {
    if (editor) {
      onSubmit(editor?.storage.markdown.getMarkdown(), fileUrls);
    }
  }, [editor, fileUrls, onSubmit]);

  return (
    <div>
      {editor && (
        <>
          <EditorHeader
            editor={editor}
            handleBackButton={handleBackButton}
            mediaFileRequired={mediaFileRequired}
            insertImage={insertMedia}
            setInsertImage={setInsertMedia}
          />
          <div className='w-full space-y-2 overflow-y-scroll p-4'>
            {editor && (
              <EditorContent editor={editor} className='min-h-[80px]' />
            )}
            {insertMedia && (
              <NewMediaView
                fileUrls={fileUrls}
                setFileUrls={setFileUrls}
                header='미디어 또는 링크 업로드'
                onlyImage={onlyImage}
              />
            )}
          </div>
          {children ?? ''}
          <EditorFooter
            isUpload={isUpload}
            onSubmit={handleSubmit}
            submitText={submitText}
            footerContent={footer}
          />
        </>
      )}
    </div>
  );
}
