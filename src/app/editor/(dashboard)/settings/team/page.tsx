"use client";

import Link from "next/link";

import ASNextImage from "@/components/ASNextImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { useProfile } from "@/auth/use-profile";

export default function TeamList() {
  const { data: user } = useProfile();
  return (
    <Card>
      <CardHeader>
        <div className="w-full flex justify-between">
          <p>팀 관리</p>
          <Link href="/editor/settings/team/new">
            <Button>팀 생성</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          {user?.teams.map((team) => (
            <Link
              href={`/editor/settings/team/${team.id}`}
              key={team.id}
              className="w-full h-24 flex justify-between items-center rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200"
            >
              <ASNextImage
                src={team.profileImage ?? "prod/images/default.jpg"}
                alt={team.name}
                className="rounded-full object-cover w-12 h-12"
                width={48}
                height={48}
              />
              {team.name}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
