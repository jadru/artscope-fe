"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import CommentForm from "@/app/(main)/(viewer)/article/[id]/CommentForm";
import { CommentInputs } from "@/app/(main)/(viewer)/article/[id]/commentSchema";
import CommentView from "@/app/(main)/(viewer)/article/[id]/CommentView";
import jxios from "@/utils/jxios";

import { CommentType } from "@/types/comment";
import { useProfile } from "@/auth/use-profile";

type Props = {
  id: number;
  comments: CommentType[];
};

export default function ArticleViewerComment(props: Props) {
  const { data: user } = useProfile();
  const router = useRouter();
  const [newReply, setNewReply] = useState<number>(0);

  const onNewCommentSubmit = (data: CommentInputs) =>
    jxios
      .post(`/api/server/magazines/${props.id}/comments`, data)
      .then((res) => {
        if (res.status === 201) {
          router.refresh();
          setNewReply(0);
        }
      });

  const onNewReplySubmit = (data: CommentInputs) =>
    jxios
      .post(`/api/server/magazines/${props.id}/comments`, {
        comment: data.comment,
        parentCommentId: newReply,
      })
      .then((res) => {
        if (res.status === 201) {
          router.refresh();
          setNewReply(0);
        }
      });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 py-5 border-b border-gray-50">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
            댓글
            <span className="text-sm font-normal text-gray-500 ml-2">
              {props.comments.length}개
            </span>
          </h3>
        </div>

        <div className="p-6 space-y-6">
          {user ? (
            <div className="bg-gray-50 rounded-lg p-4">
              <CommentForm
                onSubmit={onNewCommentSubmit}
                authorName={user.name}
                authorProfileUrl={user.picture}
              />
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <Link
                href="/user/login"
                className="flex items-center gap-2 text-blue-700 hover:text-blue-800 transition-colors"
              >
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium">
                  <span className="font-semibold">로그인</span> 후 댓글을 작성할
                  수 있습니다
                </span>
              </Link>
            </div>
          )}

          <div className="space-y-4">
            <CommentView
              comments={props.comments}
              replyComment={newReply}
              setReplyComment={setNewReply}
              authorName={user?.name}
              authorProfileUrl={user?.picture}
              onSubmit={onNewReplySubmit}
              isLogin={!!user}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
