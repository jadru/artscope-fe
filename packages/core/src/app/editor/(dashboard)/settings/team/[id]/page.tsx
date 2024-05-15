import MemberList from '@/app/editor/(dashboard)/settings/team/[id]/member-list';
import ModifyTeamForm from '@/app/editor/(dashboard)/settings/team/[id]/modify-form';
import { NEXT_PUBLIC_API_URL } from '@/constant/env';
import jxios from '@/utils/jxios';

import { TeamDetailType } from '@/types/team';
import { useMemo } from 'react';
import { useUser } from '@/states';

const fetchTeam = async (id: string) =>
  await jxios
    .get(`${NEXT_PUBLIC_API_URL}/api/teams/${id}`)
    .then((res) => res.data as TeamDetailType);

type Props = {
  params: { id: string };
};

export default async function TeamNewPage({ params }: Props) {
  const team = await fetchTeam(params.id);

  return (
    <>
      <ModifyTeamForm team={{ ...team }} ownerUsername={team.ownerUsername} />
      <MemberList id={params.id} />
    </>
  );
}
