'use client';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import ASNextImage from '@/components/ASNextImage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import ChangePositionDialog from '@/app/editor/(dashboard)/settings/team/[id]/change-position-dialog';
import jxios from '@/utils/jxios';
import { useUser } from '@/states';
import { useRouter } from 'next/navigation';

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
  const { user } = useUser();
  const [addMember, setAddMember] = useState<string>('');
  const [addPosition, setAddPosition] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [positionModalOpen, setPositionModalOpen] = useState<string | boolean>(
    false
  );
  const router = useRouter();
  const query = useQuery({
    queryKey: ['team-users', props.id],
    queryFn: async () =>
      await jxios
        .get(`/api/teams/${props.id}/people`)
        .then((res) => res.data as TeamMemberResponseType),
  });

  const isOwner = useMemo(
    () =>
      query.data?.teamUsers.find((member) => member.username === user?.username)
        ?.role === 'OWNER',
    [query.data, user?.username]
  );

  const handleDelete = (username: string) =>
    confirm('정말로 삭제하시겠습니까?') &&
    jxios
      .delete(`/api/team-users/${username}`, {
        params: {
          teamId: Number(props.id),
        },
      })
      .then(() => {
        toast.success('멤버가 삭제되었습니다.');
        query.refetch();
      });

  const handleChangeOwner = (username: string) =>
    confirm('확인시 해당 멤버가 팀 소유자가 됩니다.') &&
    jxios
      .patch(`/api/team-users/${username}/owner`, undefined, {
        params: {
          teamId: Number(props.id),
        },
      })
      .then(() => {
        toast.success('이제 ' + username + '님이 팀을 소유합니다.');
        router.refresh();
      });

  return (
    <Card>
      <CardHeader>
        <div className='w-full flex justify-between'>
          <p>
            {isOwner ? '팀원 관리' : '팀원 목록'} (
            {query.data?.teamUsers.length}명)
          </p>
          {isOwner && (
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogTrigger>
                <Button
                  onClick={() => {
                    setModalOpen(true);
                  }}>
                  멤버 추가
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    멤버를 추가하려면 아이디를 입력하세요
                  </DialogTitle>
                  <DialogDescription>
                    <div className='py-3 space-y-2'>
                      <Label htmlFor='username' className='text-right'>
                        새로운 멤버의 아이디
                      </Label>
                      <Input
                        id='username'
                        placeholder='username'
                        className='col-span-3'
                        value={addMember}
                        onChange={(e) => setAddMember(e.target.value)}
                      />
                      <Label htmlFor='position' className='text-right'>
                        직책
                      </Label>
                      <Input
                        id='position'
                        placeholder='position'
                        className='col-span-3'
                        value={addPosition}
                        onChange={(e) => setAddPosition(e.target.value)}
                      />

                      <Button
                        onClick={() => {
                          jxios
                            .post(
                              '/api/team-users/' + addMember,
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
                              toast.success('멤버가 추가되었습니다.');
                              query.refetch();
                              setAddMember('');
                              setAddPosition('');
                              setModalOpen(false);
                            });
                        }}>
                        추가
                      </Button>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div>
          {query.isSuccess &&
            query?.data.teamUsers.map((member) => (
              <div
                key={member.username}
                className='w-full h-18 flex justify-between items-center rounded-xl p-4'>
                <div className='flex gap-3 items-center'>
                  <ASNextImage
                    src={member.profileImage ?? 'prod/images/default.jpg'}
                    alt={member.username}
                    className='rounded-full object-cover w-12 h-12 border'
                    width={48}
                    height={48}
                  />
                  <p>{member.username}</p>
                  <Badge variant='default'>{member.position}</Badge>
                  {member.role === 'OWNER' && (
                    <Badge variant='outline'>팀 소유자</Badge>
                  )}
                </div>
                {(isOwner || member.username === user?.username) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant='outline'>관리</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>{member.username}</DropdownMenuLabel>
                      <DropdownMenuItem>
                        {format(
                          new Date(member.createdTime),
                          'yyyy년 MM월 dd일 HH시 mm분'
                        )}{' '}
                        가입
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        {format(
                          new Date(member.updatedTime),
                          'yyyy년 MM월 dd일 HH시 mm분'
                        )}{' '}
                        수정
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setPositionModalOpen(member.username)}>
                        직책 변경
                      </DropdownMenuItem>
                      {isOwner && (
                        <>
                          <DropdownMenuItem
                            onClick={() => handleChangeOwner(member.username)}>
                            소유자 이전
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            color={'red'}
                            onClick={() => handleDelete(member.username)}>
                            삭제
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}
          <ChangePositionDialog
            id={props.id}
            modalOpen={positionModalOpen}
            setModalOpen={setPositionModalOpen}
          />
        </div>
      </CardContent>
    </Card>
  );
}
