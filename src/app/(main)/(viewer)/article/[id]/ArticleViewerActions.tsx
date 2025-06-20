"use client";

import { useDebounce } from "@toss/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
import { toast } from "react-toastify";

import { useUser } from "@/states";
import jxios from "@/utils/jxios";
import { Button } from "@/components/ui/button";

export default function ArticleViewerActions(props: {
  authorUsername: string;
  id: string;
  isLiked: boolean;
  likes: number;
}) {
  const { user, isAdmin } = useUser();
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(props.isLiked);
  const [likes, setLikes] = useState(props.likes);
  const handleDelete = () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    jxios.delete("/api/magazines/" + props.id).then((response) => {
      if (response.status === 200) {
        toast.success("아티클이 삭제되었습니다.");
        router.push("/editor");
      }
    });
  };
  const handleLike = useDebounce(() => {
    setIsLiked(true);
    setLikes((prev) => prev + 1);
    jxios.post("/api/magazines/" + props.id + "/like").then((response) => {
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
    jxios.post("/api/magazines/" + props.id + "/unlike").then((response) => {
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
      <Button
        variant={isLiked ? "default" : "outline"}
        className="flex gap-2"
        onClick={() =>
          (user && user.username === props.authorUsername) || isAdmin
            ? isLiked
              ? handleUnLike()
              : handleLike()
            : router.push("/user/login")
        }
      >
        <FaHeart size={24} color={isLiked ? "red" : "black"} className="mr-1" />{" "}
        {likes} {isLiked ? "좋아요를 눌렀어요" : "좋아요를 눌러주세요"}
      </Button>
      {(user && user.username === props.authorUsername) || isAdmin ? (
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
