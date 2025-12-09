"use client";

import Link from "next/link";

import ASNextImage from "@/components/shared/ASNextImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { useProfile } from "@/auth/use-profile";

export default function TeamList() {
  const { data: user } = useProfile();

  return (
    <div className="space-y-6">
      {/* 헤더 섹션 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">팀 관리</h2>
          <p className="text-gray-600 mt-1">소속된 팀들을 관리하세요</p>
        </div>
        <Link href="/editor/settings/team/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
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
            팀 생성
          </Button>
        </Link>
      </div>

      {/* 팀 목록 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {user?.teams.map((team) => (
          <Link
            href={`/editor/settings/team/${team.id}`}
            key={team.id}
            className="group block"
          >
            <Card className="h-full bg-white hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-blue-200 overflow-hidden">
              <div className="relative">
                {/* 배경 이미지 */}
                <div className="h-32 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
                  <div className="absolute top-4 right-4">
                    <div className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* 프로필 이미지 */}
                <div className="absolute -bottom-8 left-6">
                  <div className="relative">
                    <ASNextImage
                      src={team.profileImage ?? "prod/images/default.jpg"}
                      alt={team.name}
                      className="w-16 h-16 rounded-xl object-cover border-4 border-white shadow-lg"
                      width={64}
                      height={64}
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="pt-12 pb-6">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {team.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      팀 멤버 관리 및 정보 수정
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span>팀 관리</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {/* 빈 상태 */}
        {(!user?.teams || user.teams.length === 0) && (
          <div className="col-span-full">
            <Card className="bg-gray-50 border-dashed border-gray-300">
              <CardContent className="py-12 text-center">
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
                  소속된 팀이 없습니다
                </h3>
                <p className="text-gray-500 mb-6">
                  새로운 팀을 생성하거나 기존 팀에 참여해보세요
                </p>
                <Link href="/editor/settings/team/new">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    첫 번째 팀 생성하기
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
