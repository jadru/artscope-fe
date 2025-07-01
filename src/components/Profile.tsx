"use client";

import Link from "next/link";

import ASNextImage from "@/components/ASNextImage";
import StandardLabel from "@/components/StandardLabel";

export default function ProfileComponent({
  name,
  username,
  picture,
  clickable = true,
  borderTop = false,
  borderBottom = false,
  teamId,
}: {
  username: string;
  name: string;
  picture?: string;
  clickable?: boolean;
  borderTop?: boolean;
  borderBottom?: boolean;
  teamId?: number | null;
}) {
  return (
    <Link
      className={clickable ? "cursor-pointer" : "cursor-default"}
      href={`${
        clickable ? (!teamId ? "/profile/" + username : "/team/" + teamId) : "#"
      }`}
    >
      <div
        className={`
          flex flex-row items-center w-full rounded-lg justify-between bg-gray-100 transition-colors gap-2 px-6 py-10 text-[#1A1A1A] group
        } ${clickable ? "hover:bg-gray-200 transition-colors rounded-sm" : ""}`}
      >
        <div className={`ml-0.5 flex flex-col transition`}>
          <p className={`inline text-xl`}>
            <StandardLabel label={name} />
          </p>
          <p className="text-default-500 line-clamp-1 text-base">
            {!teamId ? "@" + username : ""}
          </p>
        </div>
        <ASNextImage
          src={picture ?? "prod/images/default.jpg"}
          alt="프로필 사진"
          width={64}
          height={64}
          className="h-16 w-16 rounded-full object-cover"
        />
      </div>
    </Link>
  );
}
