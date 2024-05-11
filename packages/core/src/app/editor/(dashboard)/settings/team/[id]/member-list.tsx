'use client';

import Link from 'next/link';

import ASNextImage from '@/components/ASNextImage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { useUser } from '@/states';
import { useQueries, useQuery } from '@tanstack/react-query';
import jxios from '@/utils/jxios';
import { NEXT_PUBLIC_API_URL } from '@/constant/env';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import ChangePositionDialog from '@/app/editor/(dashboard)/settings/team/[id]/change-position-dialog';

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
  const [addMember, setAddMember] = useState<string>('');
  const [addPosition, setAddPosition] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const query = useQuery({
    queryKey: ['team', props.id],
    queryFn: async () =>
      await jxios
        .get(`/api/teams/${props.id}/people`)
        .then((res) => res.data as TeamMemberResponseType),
  });
  return (
    <Card>
      <CardHeader>
        <div className='w-full flex justify-between'>
          <p>멤버 관리</p>
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
                <DialogTitle>멤버를 추가하려면 아이디를 입력하세요</DialogTitle>
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
        </div>
      </CardHeader>
      <CardContent>
        <div>
          {query.isSuccess &&
            query?.data.teamUsers.map((member) => (
              <div
                key={member.username}
                className='w-full h-18 flex justify-between items-center rounded-xl p-4'>
                <div className={'flex gap-3 items-center'}>
                  <ASNextImage
                    src={member.profileImage ?? 'prod/images/default.jpg'}
                    alt={member.username}
                    className='rounded-full object-cover w-12 h-12 border'
                    width={48}
                    height={48}
                  />
                  <p>{member.username}</p>
                  <Badge variant={'default'}>{member.position}</Badge>
                  {member.role === 'OWNER' && (
                    <Badge variant={'outline'}>팀 소유자</Badge>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant={'outline'}>관리</Button>
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
                    <DropdownMenuItem>
                      <ChangePositionDialog
                        id={props.id}
                        username={member.username}
                      />
                    </DropdownMenuItem>
                    <DropdownMenuItem>권한 양도</DropdownMenuItem>
                    <DropdownMenuItem>삭제</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
