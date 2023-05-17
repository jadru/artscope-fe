'use client';

import { Color } from '@tiptap/extension-color';
import Document from '@tiptap/extension-document';
import { Placeholder } from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style';
import {
  BubbleMenu,
  EditorContent,
  JSONContent,
  useEditor,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Lottie from 'lottie-react';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import jxios from '@/utils/jxios';

import UploadAnimation from '../../../public/animation/65316-upload-progress-bar.json';

import { ArtWorkApiRequestType, ArtWorkMediaType, ArtworkType } from '@/types';

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

const Editor = ({
  type = 'create',
  data,
  resetAfterUpload,
  fileUrls = [],
  thumbnail = 0,
}: {
  type: 'create' | 'edit';
  data?: ArtworkType;
  resetAfterUpload?: () => void;
  fileUrls?: ArtWorkMediaType[];
  thumbnail?: number;
}) => {
  const CustomDocument = Document.extend({
    content: 'heading block*',
  });
  const tagInput = useRef();
  const router = useRouter();
  const [isUpload, setIsUpload] = useState<boolean>(false);
  const [artwork, setArtwork] = useState<ArtWorkApiRequestType>(initialArtWork);
  const [checkVisible, setCheckVisible] = useState<boolean>(true);
  const editor = useEditor({
    content:
      type != 'create'
        ? data && `<h1>${data.title}</h1>${data.description}`
        : null,
    extensions: [
      CustomDocument,
      StarterKit.configure({
        document: false,
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return '타이틀을 입력해주세요.';
          }

          return '작품에 대한 설명을 알려주세요.';
        },
      }),
      TextStyle,
      Color,
    ],
    editorProps: {
      attributes: {
        class: 'editor__content',
      },
    },
  });

  useEffect(() => {
    if (editor) {
      editor.commands.focus();
    }
  }, [editor]);

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

  const handleSaveButton = () => {
    if (!editor) return;
    (type === 'create' && handleCreateSaveButton()) ||
      (type === 'edit' &&
        handleEditSaveButton(editor.getJSON(), editor.getHTML()));
  };
  const handleEditSaveButton = async (
    contentJSON?: JSONContent,
    contentHTML?: string
  ) => {
    if (!data || isUpload || !editor) return;
    const HTML = editor.getHTML();
    if (HTML.substring(4, HTML.search('</h1>')).length === 0) {
      toast.warn('타이틀을 입력해주세요.');
      return;
    }
    if (HTML.substring(HTML.search('</h1>') + 5).length < 8) {
      toast.warn('설명을 입력해주세요.');
      return;
    }
    await setIsUpload(true);
    contentJSON &&
      contentHTML &&
      jxios
        .put('/api/artworks/' + data.id, {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          title: contentJSON.content[0].content[0].text,
          description: contentHTML.substring(contentHTML.search('</h1>') + 5),
          visible: true,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          tags: tagInput.current.value.split(',').map((tag) => tag.trim()),
        })
        .then((res) => {
          if (res.status !== 200) {
            toast.error('수정에 실패했습니다.');
            return;
          }
          router
            .replace('/artwork/' + data.id)
            .then(() => toast.success('수정되었습니다.'));
        })
        .finally(() => setIsUpload(false));
  };

  const handleCreateSaveButton = async () => {
    if (isUpload || !editor) return;
    const HTML = editor.getHTML();
    if (fileUrls.length === 0) {
      toast.warn('파일을 업로드해주세요.');
      return;
    }
    if (HTML.substring(4, HTML.search('</h1>')).length === 0) {
      toast.warn('타이틀을 입력해주세요.');
      return;
    }
    if (HTML.substring(HTML.search('</h1>') + 5).length < 8) {
      toast.warn('설명을 입력해주세요.');
      return;
    }
    let count = 0;
    fileUrls.map((fileUrl) => {
      if (fileUrl.mediaType === 'video' || fileUrl.mediaType === 'image') {
        count += 1;
      }
    });
    if (count === 0) {
      toast.warn('썸네일을 업로드해주세요.');
      setIsUpload(false);
      return;
    }
    if (
      fileUrls.reduce((acc, cur) => (cur.file ? cur.file.size + acc : acc), 0) /
        1000000 >
      100
    ) {
      toast.warn('파일 용량이 너무 큽니다.');
      setIsUpload(false);
      return;
    }
    await setIsUpload(true);
    const newState = { ...artwork };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    newState.dto.title = HTML.substring(4, HTML.search('</h1>'));
    newState.dto.description = HTML.substring(HTML.search('</h1>') + 5);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    newState.dto.tags = tagInput.current.value
      .split(',')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .map((tag) => tag.trim());
    newState.dto.visible = checkVisible;

    const formData = new FormData();
    if (fileUrls[thumbnail].mediaType === 'video') {
      const cover = (await getVideoCover(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        fileUrls[thumbnail].file,
        1.5
      )) as Blob;
      formData.append(
        'thumbnailFile',
        new File([cover], 'thumbnail.jpg', { type: 'image/jpeg' })
      );
    } else if (fileUrls[thumbnail].mediaType === 'image') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      formData.append('thumbnailFile', fileUrls[thumbnail].file);
    } else {
      toast.warn('썸네일을 선택해주세요.');
      setIsUpload(false);
      return;
    }

    newState.dto.medias = [];
    await fileUrls.forEach((media) => {
      media.mediaType === 'url'
        ? formData.append(
            'mediaFiles',
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            new File([media.linkUrl], 'mediaFiles', {
              type: 'text/plain',
            })
          )
        : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
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
        setArtwork(initialArtWork);
        resetAfterUpload && resetAfterUpload();
        if (res.status === 201) {
          router
            .push('/')
            .then(
              () => toast.success('작품이 업로드되었습니다.') && router.reload()
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
    <>
      <div className='editor my-4 w-full'>
        {editor && (
          <>
            <BubbleMenu
              className='bubble-menu'
              tippyOptions={{ duration: 100 }}
              editor={editor}
            >
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'is-active' : ''}
              >
                Bold
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'is-active' : ''}
              >
                Italic
              </button>
              <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={editor.isActive('strike') ? 'is-active' : ''}
              >
                Strike
              </button>
            </BubbleMenu>
          </>
        )}

        <EditorContent editor={editor} className='h-full w-full p-3' />
        <p className='my-6 w-full text-sm font-bold text-gray-600 dark:text-neutral-400'>
          타이틀 입력 후 <kbd className='kbd kbd-sm'>Enter</kbd> 시 작품 설명을
          입력할 수 있습니다. (<code>Markdown</code> 지원)
        </p>
      </div>
      <div className='flex flex-col items-stretch space-y-1 rounded-2xl border p-3 md:flex-row md:items-center md:justify-end md:space-y-0 md:space-x-2'>
        <input
          type='text'
          className='input-bordered input'
          placeholder='태그1, 태그2, ...'
          defaultValue={data ? data.tags : ''}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ref={tagInput}
        />
        {type === 'create' ? (
          <div className='input-bordered input flex flex-row items-center justify-between space-x-1'>
            <span className='label-text'>플랫폼에 작품 공개</span>
            <input
              type='checkbox'
              className='toggle-success toggle'
              name='visible'
              onClick={() => setCheckVisible((prev) => !prev)}
              defaultChecked={checkVisible}
            />
          </div>
        ) : (
          <div></div>
        )}
        <button
          onClick={handleSaveButton}
          className='btn-primary tooltip tooltip-bottom btn'
          data-tip='작품을 업로드하면 2023 금샘미술관 전시에 공모됩니다.'
        >
          저장하기
        </button>
      </div>

      {isUpload && (
        <div className='fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-white/40 backdrop-blur'>
          <Lottie
            animationData={UploadAnimation}
            className='w-96'
            loop={false}
          />
        </div>
      )}
    </>
  );
};

export default Editor;
