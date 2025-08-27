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
    <div className="flex gap-6 items-center">
      <button
        className="flex items-center gap-2 group"
        onClick={() =>
          user
            ? isLiked
              ? handleUnLike()
              : handleLike()
            : router.push("/user/login")
        }
      >
        <FaHeart
          size={20}
          className={cn(
            "transition-colors duration-200",
            isLiked
              ? "fill-red-500 text-red-500"
              : "text-gray-400 group-hover:text-red-400"
          )}
        />
        <span className="text-sm font-light text-gray-700">{likes}</span>
      </button>

      {(user && user.username === props.authorUsername) || user?.isAdmin ? (
        <div className="flex gap-4 items-center">
          <Link
            href={"/editor/" + props.id + "/modify"}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <MdOutlineEdit size={20} />
          </Link>
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <MdOutlineDelete size={20} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
