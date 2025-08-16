"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "react-toastify";

import ASNextImage from "@/components/ASNextImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import ChangePositionDialog from "@/app/editor/(dashboard)/settings/team/[id]/change-position-dialog";
import jxios from "@/utils/jxios";

type TeamMemberResponseType = {
  teamUsers: {
    username: string;
    profileImage: string | null;
    position: string;
    role: string;
    teamId: number;
    createdTime: string;
    updatedTime: string;
  }[];
};

export default function MemberList(props: { id: string }) {
  const [addMember, setAddMember] = useState<string>("");
  const [addPosition, setAddPosition] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const query = useQuery({
    queryKey: ["team", props.id],
    queryFn: async () =>
      await jxios
        .get(`/api/server/teams/${props.id}/people`)
        .then((res) => res.data as TeamMemberResponseType),
  });

  return (
    <Card className="bg-white border border-gray-100">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              팀 멤버 관리
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              팀 멤버를 추가하고 관리하세요
            </p>
          </div>
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setModalOpen(true)}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                멤버 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">
                  새로운 멤버 추가
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  팀에 새로운 멤버를 추가하려면 정보를 입력하세요
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="username"
                    className="text-sm font-medium text-gray-700"
                  >
                    멤버 아이디
                  </Label>
                  <Input
                    id="username"
                    placeholder="추가할 멤버의 아이디를 입력하세요"
                    value={addMember}
                    onChange={(e) => setAddMember(e.target.value)}
                    className="h-11 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="position"
                    className="text-sm font-medium text-gray-700"
                  >
                    직책
                  </Label>
                  <Input
                    id="position"
                    placeholder="팀에서 맡을 직책을 입력하세요"
                    value={addPosition}
                    onChange={(e) => setAddPosition(e.target.value)}
                    className="h-11 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                  />
                </div>
                <Button
                  onClick={() => {
                    jxios
                      .post(
                        "/team-users/" + addMember,
                        {
                          position: addPosition,
                        },
                        {
                          params: {
                            teamId: Number(props.id),
                          },
                        }
                      )
                      .then(() => {
                        toast.success("멤버가 추가되었습니다.");
                        query.refetch();
                        setAddMember("");
                        setAddPosition("");
                        setModalOpen(false);
                      });
                  }}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  disabled={!addMember || !addPosition}
                >
                  멤버 추가하기
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {query.isSuccess &&
            query?.data.teamUsers.map((member) => (
              <div
                key={member.username}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <ASNextImage
                      src={member.profileImage ?? "prod/images/default.jpg"}
                      alt={member.username}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                      width={48}
                      height={48}
                    />
                    {member.role === "OWNER" && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full border-2 border-white flex items-center justify-center">
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">
                        {member.username}
                      </h4>
                      <Badge variant="secondary" className="text-xs">
                        {member.position}
                      </Badge>
                      {member.role === "OWNER" && (
                        <Badge
                          variant="outline"
                          className="text-xs border-yellow-300 text-yellow-700"
                        >
                          팀 소유자
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {format(new Date(member.createdTime), "yyyy년 MM월 dd일")}{" "}
                      가입
                    </p>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 px-3">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel className="font-medium">
                      {member.username}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-sm">
                      <ChangePositionDialog
                        id={props.id}
                        username={member.username}
                      />
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-sm text-red-600">
                      멤버 제거
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}

          {query.isSuccess && query.data.teamUsers.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                아직 멤버가 없습니다
              </h3>
              <p className="text-gray-500">새로운 멤버를 추가해보세요</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
