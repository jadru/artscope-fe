import Link from "next/link";

import { standardLabel } from "@/components/StandardLabel";

import CommentForm from "@/app/(main)/(viewer)/article/[id]/CommentForm";
import { CommentInputs } from "@/app/(main)/(viewer)/article/[id]/commentSchema";
import { timeCalculatorKO } from "@/utils/timeCalculator";

import { CommentType } from "@/types/comment";

type Props = {
  comments: CommentType[];
  replyComment: number;
  setReplyComment: (id: number) => void;
  authorName?: string;
  authorProfileUrl?: string;
  onSubmit: (data: CommentInputs) => void;
  isLogin?: boolean;
};

export default function CommentView(props: Props) {
  return (
    <div className="space-y-4">
      {props.comments.map((comment) => (
        <div key={comment.id} className="group relative">
          <div className="flex gap-4">
            {/* 프로필 아바타 */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {comment.author.authorName.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* 댓글 내용 */}
            <div className="flex-1 min-w-0">
              <div className="bg-gray-50 rounded-2xl px-4 py-3">
                {/* 작성자 정보 */}
                <div className="flex items-center gap-2 mb-2">
                  <Link href={"/profile/" + comment.author.authorUsername}>
                    <span className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                      {standardLabel(comment.author.authorName)}
                    </span>
                  </Link>
                  <span className="text-xs text-gray-500">
                    {timeCalculatorKO(
                      new Date(comment.updatedTime) ??
                        new Date(comment.createdTime)
                    )}
                  </span>
                </div>

                {/* 댓글 텍스트 */}
                <div className="text-gray-800 leading-relaxed">
                  {comment.mentionUsername && (
                    <span className="text-blue-600 font-medium pr-1">
                      @{standardLabel(comment.mentionUsername)}
                    </span>
                  )}
                  {standardLabel(comment.comment)}
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="mt-2 flex items-center gap-4">
                {props.isLogin && (
                  <button
                    className="text-xs text-gray-500 hover:text-blue-600 transition-colors font-medium"
                    onClick={() =>
                      props.replyComment !== comment.id
                        ? props.setReplyComment(comment.id)
                        : props.setReplyComment(0)
                    }
                  >
                    {props.replyComment !== comment.id ? "답글" : "취소"}
                  </button>
                )}
              </div>

              {/* 답글 폼 */}
              {props.replyComment === comment.id && (
                <div className="mt-4 ml-4 pl-4 border-l-2 border-gray-200">
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <CommentForm
                      onSubmit={props.onSubmit}
                      authorName={props.authorName}
                      authorProfileUrl={props.authorProfileUrl}
                    />
                  </div>
                </div>
              )}

              {/* 대댓글들 */}
              {comment.childComments.length > 0 && (
                <div className="mt-4 space-y-3">
                  <CommentView
                    comments={comment.childComments}
                    authorProfileUrl={props.authorProfileUrl}
                    authorName={props.authorName}
                    replyComment={props.replyComment}
                    setReplyComment={props.setReplyComment}
                    onSubmit={props.onSubmit}
                    isLogin={props.isLogin}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
