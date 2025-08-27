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
    <div>
      <div className="mb-8">
        <h3 className="text-xl font-light text-gray-900 mb-8">
          댓글 {props.comments.length > 0 && `(${props.comments.length})`}
        </h3>

        <div className="space-y-8">
          {user ? (
            <div>
              <CommentForm
                onSubmit={onNewCommentSubmit}
                authorName={user.name}
                authorProfileUrl={user.picture}
              />
            </div>
          ) : (
            <div className="py-4">
              <Link
                href="/user/login"
                className="text-sm font-light text-gray-600 hover:text-gray-900 transition-colors"
              >
                로그인 후 댓글을 작성할 수 있습니다
              </Link>
            </div>
          )}

          <div className="space-y-6">
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
