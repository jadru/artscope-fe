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
    <div className="flex gap-4 items-center justify-start">
      <button
        className={cn("flex gap-2 group px-3 py-2")}
        onClick={() =>
          user
            ? isLiked
              ? handleUnLike()
              : handleLike()
            : router.push("/user/login")
        }
      >
        <FaHeart
          size={24}
          className={cn(
            "mr-1 transition-colors duration-300 group-hover:fill-red-200",
            isLiked && "fill-red-500 group-hover:fill-red-800"
          )}
        />
        {likes} {isLiked ? "좋아요를 눌렀어요" : "좋아요로 작품을 추천해주세요"}
      </button>
      {(user && user.username === props.authorUsername) || user?.isAdmin ? (
        <>
          <Link href={"/editor/" + props.id + "/modify"}>
            <MdOutlineEdit size={24} />
          </Link>
          <button onClick={handleDelete}>
            <MdOutlineDelete size={24} />
          </button>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
