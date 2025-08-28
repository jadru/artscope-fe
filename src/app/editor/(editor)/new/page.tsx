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
    <div className="min-h-screen bg-background text-foreground">
      {/* 상단 툴바 */}
      <div className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex h-14 items-center justify-between">
            {/* 뒤로가기 버튼 */}
            <button
              onClick={handleBackButton}
              className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <BiArrowBack className="h-5 w-5" />
              <span className="text-sm font-medium hidden sm:inline">
                나가기
              </span>
            </button>

            {/* 툴바 섹션 */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => editor?.chain().focus().toggleBold().run()}
                data-active={editor?.isActive("bold")}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-foreground`}
                title="굵게"
              >
                <BiBold className="h-4 w-4" />
              </button>
              <button
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                data-active={editor?.isActive("italic")}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-foreground`}
                title="기울임"
              >
                <BiItalic className="h-4 w-4" />
              </button>
              <button
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
                data-active={editor?.isActive("underline")}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-foreground`}
                title="밑줄"
              >
                <BiUnderline className="h-4 w-4" />
              </button>
              <button
                onClick={() => editor?.chain().focus().toggleStrike().run()}
                data-active={editor?.isActive("strike")}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-foreground`}
                title="취소선"
              >
                <BiStrikethrough className="h-4 w-4" />
              </button>

              <div className="mx-1.5 h-5 w-px bg-border" />

              <button
                onClick={() =>
                  editor?.chain().focus().setHeading({ level: 1 }).run()
                }
                data-active={editor?.isActive("heading", { level: 1 })}
                className={`inline-flex h-9 items-center rounded-md px-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-foreground`}
                title="제목 1"
              >
                H1
              </button>
              <button
                onClick={() =>
                  editor?.chain().focus().setHeading({ level: 2 }).run()
                }
                data-active={editor?.isActive("heading", { level: 2 })}
                className={`inline-flex h-9 items-center rounded-md px-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-foreground`}
                title="제목 2"
              >
                H2
              </button>
              <button
                onClick={() =>
                  editor?.chain().focus().setHeading({ level: 3 }).run()
                }
                data-active={editor?.isActive("heading", { level: 3 })}
                className={`inline-flex h-9 items-center rounded-md px-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-foreground`}
                title="제목 3"
              >
                H3
              </button>

              <div className="mx-1.5 h-5 w-px bg-border" />

              <button
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                data-active={editor?.isActive("bulletList")}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-foreground`}
                title="글머리 기호 목록"
              >
                <BiListUl className="h-4 w-4" />
              </button>
              <button
                onClick={() =>
                  editor?.chain().focus().toggleOrderedList().run()
                }
                data-active={editor?.isActive("orderedList")}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-foreground`}
                title="번호 매기기 목록"
              >
                <BiListOl className="h-4 w-4" />
              </button>

              <div className="mx-1.5 h-5 w-px bg-border" />

              <label
                htmlFor="image-upload"
                data-active={insertImage.length > 0}
                className={`inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-foreground`}
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
              className="px-4"
            >
              {isUpload ? "작성 중..." : "작성하기"}
            </Button>
          </div>
        </div>
      </div>

      {/* 메인 편집 영역 */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* 제목 입력 */}
        <input
          id="title"
          className="mb-6 w-full bg-transparent text-2xl font-semibold tracking-tight placeholder:text-muted-foreground focus-visible:outline-none sm:text-3xl md:text-4xl"
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
        <div className="mt-8 border-t pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground">
                작성자:
              </span>
              <Select onValueChange={(value) => setTeam(value)} value={team}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="작성자를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="0" className="flex items-center gap-2">
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
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
                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground">
                          {team.name.charAt(0).toUpperCase()}
                        </div>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-muted-foreground">
              {title.length > 0 && `제목: ${title.length}자`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
