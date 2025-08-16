import MemberList from "@/app/editor/(dashboard)/settings/team/[id]/member-list";
import ModifyTeamForm from "@/app/editor/(dashboard)/settings/team/[id]/modify-form";
import { NEXT_PUBLIC_API_URL } from "@/constant/env";
import jxios from "@/utils/jxios";

import { TeamDetailType } from "@/types/team";
import { serverTeamsApi } from "@/utils/serverApi";

const fetchTeam = async (id: string) =>
  (await serverTeamsApi.getById(id)) as TeamDetailType;

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const team = await fetchTeam(id);

  return (
    <div className="space-y-6">
      {/* 헤더 섹션 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {team.name} 팀 관리
        </h2>
        <p className="text-gray-600 mt-1">
          팀 정보를 수정하고 멤버를 관리하세요
        </p>
      </div>

      {/* 팀 정보 수정 */}
      <ModifyTeamForm team={{ ...team }} />

      {/* 멤버 관리 */}
      <MemberList id={id} />
    </div>
  );
}
