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
    <div className="space-y-8">
      {props.comments.map((comment) => (
        <div key={comment.id}>
          <div className="flex gap-4">
            {/* 프로필 아바타 */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-light">
                {comment.author.authorName.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* 댓글 내용 */}
            <div className="flex-1 min-w-0 space-y-3">
              {/* 작성자 정보 */}
              <div className="flex items-center gap-3">
                <Link href={"/profile/" + comment.author.authorUsername}>
                  <span className="text-sm font-light text-gray-900 hover:text-gray-700 transition-colors">
                    {standardLabel(comment.author.authorName)}
                  </span>
                </Link>
                <span className="text-xs font-light text-gray-500">
                  {timeCalculatorKO(
                    new Date(comment.updatedTime) ??
                      new Date(comment.createdTime)
                  )}
                </span>
              </div>

              {/* 댓글 텍스트 */}
              <div className="text-gray-700 leading-relaxed font-light">
                {comment.mentionUsername && (
                  <span className="text-gray-600 font-light pr-1">
                    @{standardLabel(comment.mentionUsername)}
                  </span>
                )}
                {standardLabel(comment.comment)}
              </div>

              {/* 액션 버튼 */}
              {props.isLogin && (
                <div className="pt-2">
                  <button
                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors font-light"
                    onClick={() =>
                      props.replyComment !== comment.id
                        ? props.setReplyComment(comment.id)
                        : props.setReplyComment(0)
                    }
                  >
                    {props.replyComment !== comment.id ? "답글" : "취소"}
                  </button>
                </div>
              )}

              {/* 답글 폼 */}
              {props.replyComment === comment.id && (
                <div className="mt-6 ml-6 pl-4 border-l border-gray-200">
                  <CommentForm
                    onSubmit={props.onSubmit}
                    authorName={props.authorName}
                    authorProfileUrl={props.authorProfileUrl}
                  />
                </div>
              )}

              {/* 대댓글들 */}
              {comment.childComments.length > 0 && (
                <div className="mt-6 ml-6 space-y-6">
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
