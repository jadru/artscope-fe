import { Editor } from '@tiptap/react';
import React from 'react';
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

export default function EditorHeader({
  editor,
  handleBackButton,
  mediaFileRequired,
  insertImage,
  setInsertImage,
}: {
  editor: Editor;
  handleBackButton: () => void;
  mediaFileRequired?: boolean;
  insertImage?: boolean;
  setInsertImage?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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
            }`}>
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
            }`}>
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
            }`}>
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
            }`}>
            <BiUnderline size={25} />
          </button>
          {!mediaFileRequired && (
            <button
              onClick={() => setInsertImage && setInsertImage((prev) => !prev)}>
              <BiImage
                size={25}
                className={`hover:text-primary ${
                  insertImage ? 'text-black' : 'text-default'
                }`}
              />
            </button>
          )}
          <button
            onClick={() => {
              if (editor) {
                editor.chain().focus().toggleBulletList().run();
              }
            }}
            className={`hover:text-primary ${
              editor?.isActive('bulletList') ? 'text-black' : 'text-default'
            }`}>
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
            }`}>
            <BiListOl size={25} />
          </button>
        </div>
        <div></div>
      </div>
      <div className='h-16'></div>
    </>
  );
}
