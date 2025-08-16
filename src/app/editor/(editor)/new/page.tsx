"use client";

import { Bold } from "@tiptap/extension-bold";
import { BulletList } from "@tiptap/extension-bullet-list";
import { Document } from "@tiptap/extension-document";
import Dropcursor from "@tiptap/extension-dropcursor";
import Heading from "@tiptap/extension-heading";
import { History } from "@tiptap/extension-history";
import Image from "@tiptap/extension-image";
import { Italic } from "@tiptap/extension-italic";
import { ListItem } from "@tiptap/extension-list-item";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Strike } from "@tiptap/extension-strike";
import { Text } from "@tiptap/extension-text";
import { Underline } from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import { useDebounce } from "@toss/react";
import { forEach } from "lodash";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  BiArrowBack,
  BiBold,
  BiImage,
  BiItalic,
  BiListOl,
  BiListUl,
  BiStrikethrough,
  BiUnderline,
} from "react-icons/bi";
import { toast } from "react-toastify";
import { Markdown } from "tiptap-markdown";

import "@/styles/editor.css";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { NEXT_PUBLIC_MEDIA_STORAGE_URL } from "@/constant/env";
import { useProfile } from "@/auth/use-profile";

import jxios from "@/utils/jxios";

const EditPost = () => {
  const { data: user } = useProfile();
  const { push } = useRouter();
  const [insertImage, setInsertImage] = useState<string[]>([]);
  const [isUpload, setIsUpload] = useState(false);
  const [title, setTitle] = useState("");
  const [team, setTeam] = useState("0");
  const placeholder = "예술을 공유하세요.";

  const editor = useEditor({
    extensions: [
      Document,
      Text,
      Bold,
      Italic,
      Strike,
      History,
      Underline,
      Image.configure({
        inline: true,
      }),
      Dropcursor,
      Markdown.configure({
        html: true,
        tightLists: true,
        transformPastedText: true,
        transformCopiedText: true,
      }),
      BulletList,
      ListItem,
      OrderedList,
      Paragraph,
      Placeholder.configure({
        placeholder,
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
    ],
    content: "<p></p>",
    autofocus: true,
    immediatelyRender: false,
  });

  const handleSubmitPostButton = useDebounce(async () => {
    try {
      setIsUpload(true);

      const content = editor?.getHTML() || "";
      if (content === "<p></p>" || content === "") {
        toast.error("내용을 입력해주세요.");
        setIsUpload(false);
        return;
      }
      if (title === "") {
        toast.error("제목을 입력해주세요.");
        setIsUpload(false);
        return;
      }
      const data = await jxios
        .post("/magazines", {
          title,
          content,
          categorySlug: "post",
          mediaUrls: [NEXT_PUBLIC_MEDIA_STORAGE_URL + "/" + insertImage[0]],
          urn: team !== "0" ? "urn:team:" + team : undefined,
        })
        .then((res) => res.data);
      if (data) {
        toast.success("아티클이 작성 되었습니다.");
        push("/article/" + data.id);
      }
    } catch (err) {
      toast.error((err as string) || "아티클 업로드에 실패했습니다.");
    } finally {
      setIsUpload(false);
    }
  }, 500);

  const handleBackButton = () => {
    const content = editor?.getHTML() || "";
    if (content !== "<p></p>" && content !== "") {
      if (confirm("수정 중인 내용이 있습니다. 정말로 나가시겠습니까?")) {
        push("/");
      }
    } else {
      push("/");
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (files) {
      forEach(files, async (file) => {
        if (file.size > 20971520) {
          toast.error("20MB 이하의 파일만 업로드 가능합니다.");
          return;
        }
        await fileUpload(file);
      });
    }
  };

  const fileUpload = async (file: File) => {
    const response = await fetch("/upload", {
      method: "POST",
      body: JSON.stringify({
        contentType: file.type,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      const formData = new FormData();
      Object.entries(data.fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append("file", file);
      const responseUpload = await fetch(data.url, {
        method: "POST",
        body: formData,
      });
      if (responseUpload.ok) {
        editor
          ?.chain()
          .focus()
          .setImage({
            src: NEXT_PUBLIC_MEDIA_STORAGE_URL + "/" + data.fields.key,
          })
          .run();
        setInsertImage((prev) => [...prev, data.fields.key]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 툴바 */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* 뒤로가기 버튼 */}
            <button
              onClick={handleBackButton}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
            >
              <BiArrowBack className="h-5 w-5" />
              <span className="text-sm font-medium hidden sm:inline">
                나가기
              </span>
            </button>

            {/* 툴바 섹션 */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={`p-2 rounded-md transition-colors ${
                  editor?.isActive("bold")
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                title="굵게"
              >
                <BiBold className="h-4 w-4" />
              </button>
              <button
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={`p-2 rounded-md transition-colors ${
                  editor?.isActive("italic")
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                title="기울임"
              >
                <BiItalic className="h-4 w-4" />
              </button>
              <button
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded-md transition-colors ${
                  editor?.isActive("underline")
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                title="밑줄"
              >
                <BiUnderline className="h-4 w-4" />
              </button>
              <button
                onClick={() => editor?.chain().focus().toggleStrike().run()}
                className={`p-2 rounded-md transition-colors ${
                  editor?.isActive("strike")
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                title="취소선"
              >
                <BiStrikethrough className="h-4 w-4" />
              </button>

              <div className="w-px h-6 bg-gray-300 mx-2" />

              <button
                onClick={() =>
                  editor?.chain().focus().setHeading({ level: 1 }).run()
                }
                className={`px-3 py-1 rounded-md text-sm font-bold transition-colors ${
                  editor?.isActive("heading", { level: 1 })
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                title="제목 1"
              >
                H1
              </button>
              <button
                onClick={() =>
                  editor?.chain().focus().setHeading({ level: 2 }).run()
                }
                className={`px-3 py-1 rounded-md text-sm font-bold transition-colors ${
                  editor?.isActive("heading", { level: 2 })
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                title="제목 2"
              >
                H2
              </button>
              <button
                onClick={() =>
                  editor?.chain().focus().setHeading({ level: 3 }).run()
                }
                className={`px-3 py-1 rounded-md text-sm font-bold transition-colors ${
                  editor?.isActive("heading", { level: 3 })
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                title="제목 3"
              >
                H3
              </button>

              <div className="w-px h-6 bg-gray-300 mx-2" />

              <button
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded-md transition-colors ${
                  editor?.isActive("bulletList")
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                title="글머리 기호 목록"
              >
                <BiListUl className="h-4 w-4" />
              </button>
              <button
                onClick={() =>
                  editor?.chain().focus().toggleOrderedList().run()
                }
                className={`p-2 rounded-md transition-colors ${
                  editor?.isActive("orderedList")
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                title="번호 매기기 목록"
              >
                <BiListOl className="h-4 w-4" />
              </button>

              <div className="w-px h-6 bg-gray-300 mx-2" />

              <label
                htmlFor="image-upload"
                className={`p-2 rounded-md transition-colors cursor-pointer ${
                  insertImage.length > 0
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                title="이미지 추가"
              >
                <BiImage className="h-4 w-4" />
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
            </div>

            {/* 작성 버튼 */}
            <Button
              onClick={handleSubmitPostButton}
              disabled={isUpload}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isUpload ? "작성 중..." : "작성하기"}
            </Button>
          </div>
        </div>
      </div>

      {/* 메인 편집 영역 */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* 제목 입력 */}
        <input
          id="title"
          className="w-full text-3xl sm:text-4xl font-bold text-gray-900 placeholder-gray-400 focus:outline-none mb-8"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "Tab") {
              e.preventDefault();
              editor?.chain().focus().run();
            }
          }}
        />

        {/* 에디터 영역 */}
        <div
          className="min-h-[50vh] cursor-text focus:outline-none"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              editor?.chain().focus().run();
            }
          }}
        >
          {editor && (
            <EditorContent
              editor={editor}
              className="prose prose-lg max-w-none focus:outline-none"
            />
          )}
        </div>

        {/* 하단 설정 */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 font-medium">작성자:</span>
              <Select onValueChange={(value) => setTeam(value)} value={team}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="작성자를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="0" className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      {user?.name}
                    </SelectItem>
                    {user?.teams.map((team) => (
                      <SelectItem
                        key={team.id}
                        value={String(team.id)}
                        className="flex items-center gap-2"
                      >
                        <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {team.name.charAt(0).toUpperCase()}
                        </div>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-gray-500">
              {title.length > 0 && `제목: ${title.length}자`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
