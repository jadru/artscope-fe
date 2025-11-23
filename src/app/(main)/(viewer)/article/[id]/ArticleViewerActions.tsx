"use client";

import { useDebounce } from "@toss/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
import { toast } from "react-toastify";

import jxios from "@/utils/jxios";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/auth/use-profile";
import { cn } from "@/utils";

export default function ArticleViewerActions(props: {
  authorUsername: string;
  id: string;
  isLiked: boolean;
  likes: number;
}) {
  const { data: user } = useProfile();
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(props.isLiked);
  const [likes, setLikes] = useState(props.likes);
  const handleDelete = () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    jxios.delete("/api/server/magazines/" + props.id).then((response) => {
      if (response.status === 200) {
        toast.success("아티클이 삭제되었습니다.");
        router.push("/editor");
      }
    });
  };
  const handleLike = useDebounce(() => {
    setIsLiked(true);
    setLikes((prev) => prev + 1);
    jxios
      .post("/api/server/magazines/" + props.id + "/like")
      .then((response) => {
        if (response.status === 200) {
          setIsLiked(true);
          setLikes(response.data.likes);
        } else {
          setIsLiked(false);
        }
      });
  }, 200);
  const handleUnLike = useDebounce(() => {
    setIsLiked(false);
    setLikes((prev) => (prev - 1 < 0 ? 0 : prev - 1));
    jxios
      .post("/api/server/magazines/" + props.id + "/unlike")
      .then((response) => {
        if (response.status === 200) {
          setIsLiked(false);
          setLikes(response.data.likes);
        } else {
          setIsLiked(true);
        }
      });
  }, 200);
  return (
    <div className="flex gap-4 items-center">
      {/* 좋아요 버튼 */}
      <button
        className={cn(
          "flex items-center gap-2.5 group relative",
          "px-4 py-2.5 rounded-full",
          "transition-all duration-300 ease-out",
          "hover:scale-105 active:scale-95",
          isLiked
            ? "bg-red-50 dark:bg-red-950/30"
            : "bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-950/20"
        )}
        onClick={() =>
          user
            ? isLiked
              ? handleUnLike()
              : handleLike()
            : router.push("/user/login")
        }
        aria-label={isLiked ? "좋아요 취소" : "좋아요"}
      >
        <FaHeart
          size={18}
          className={cn(
            "transition-all duration-300",
            isLiked
              ? "fill-red-500 text-red-500 scale-110"
              : "text-gray-500 dark:text-gray-400 group-hover:text-red-400 dark:group-hover:text-red-400"
          )}
        />
        <span
          className={cn(
            "text-sm font-medium tabular-nums",
            "transition-colors duration-300",
            isLiked
              ? "text-red-600 dark:text-red-400"
              : "text-gray-700 dark:text-gray-300 group-hover:text-red-500 dark:group-hover:text-red-400"
          )}
        >
          {likes.toLocaleString()}
        </span>
      </button>

      {/* 편집/삭제 버튼 */}
      {(user && user.username === props.authorUsername) || user?.isAdmin ? (
        <div className="flex gap-2 items-center">
          <Link
            href={"/editor/" + props.id + "/modify"}
            className={cn(
              "p-2.5 rounded-full",
              "bg-gray-100 dark:bg-gray-800",
              "text-gray-600 dark:text-gray-400",
              "hover:bg-blue-50 dark:hover:bg-blue-950/30",
              "hover:text-blue-600 dark:hover:text-blue-400",
              "transition-all duration-300 ease-out",
              "hover:scale-105 active:scale-95"
            )}
            aria-label="아티클 수정"
          >
            <MdOutlineEdit size={20} />
          </Link>
          <button
            onClick={handleDelete}
            className={cn(
              "p-2.5 rounded-full",
              "bg-gray-100 dark:bg-gray-800",
              "text-gray-600 dark:text-gray-400",
              "hover:bg-red-50 dark:hover:bg-red-950/30",
              "hover:text-red-600 dark:hover:text-red-400",
              "transition-all duration-300 ease-out",
              "hover:scale-105 active:scale-95"
            )}
            aria-label="아티클 삭제"
          >
            <MdOutlineDelete size={20} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
