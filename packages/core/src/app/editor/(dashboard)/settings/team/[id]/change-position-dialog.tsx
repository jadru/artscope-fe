import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
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

import jxios from '@/utils/jxios';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

export default function ChangePositionDialog(props: {
  id: string;
  modalOpen: boolean | string;
  setModalOpen: (open: boolean | string) => void;
}) {
  const [addPosition, setAddPosition] = useState<string>('');
  const queryClient = useQueryClient();
  return (
    <>
      <Dialog open={!!props.modalOpen} onOpenChange={props.setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              멤버의 직책을 변경하려면 새로운 직책을 입력하세요
            </DialogTitle>
            <DialogDescription>
              <div className='py-3 space-y-2'>
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
                      .patch(
                        '/api/team-users/' + props.modalOpen,
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
                        toast.success('직책이 변경되었습니다.');
                        queryClient.refetchQueries({
                          queryKey: ['team-users', props.id],
                        });
                        setAddPosition('');
                        props.setModalOpen(false);
                      });
                  }}>
                  변경
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
