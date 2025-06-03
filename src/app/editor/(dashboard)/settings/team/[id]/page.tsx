import MemberList from '@/app/editor/(dashboard)/settings/team/[id]/member-list';
import ModifyTeamForm from '@/app/editor/(dashboard)/settings/team/[id]/modify-form';
import { NEXT_PUBLIC_API_URL } from '@/constant/env';
import jxios from '@/utils/jxios';

import { TeamDetailType } from '@/types/team';

const fetchTeam = async (id: string) =>
  await jxios
    .get(`${NEXT_PUBLIC_API_URL}/api/teams/${id}`)
    .then((res) => res.data as TeamDetailType);

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const team = await fetchTeam(id);
  return (
    <>
      <ModifyTeamForm team={{ ...team }} />
      <MemberList id={id} />
    </>
  );
}
