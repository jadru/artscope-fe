import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import ASNextImage from '@/components/ASNextImage';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

import commentSchema, {
  CommentInputs,
} from '@/app/(main)/(viewer)/article/[id]/commentSchema';
import jxios from '@/utils/jxios';

type Props = {
  onSubmit: (data: CommentInputs) => void;
  authorName?: string;
  authorProfileUrl?: string;
  id: number;
};

export default function CommentForm(props: Props) {
  const form = useForm<CommentInputs>({
    resolver: yupResolver<CommentInputs>(commentSchema),
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          jxios.post(`/api/magazines/${data.id}/comments`, {
            comment: data.comment,
          });
        })}
        className='flex w-full gap-2 items-center'>
        <FormField
          control={form.control}
          name='comment'
          render={({ field }) => (
            <FormItem className='flex w-full gap-2 p-2 h-full'>
              <div className='flex flex-col items-center gap-1'>
                <ASNextImage
                  src={props.authorProfileUrl ?? 'prod/images/default.jpg'}
                  alt='프로필 사진'
                  width={64}
                  height={64}
                  className='h-10 w-10 rounded-full border object-cover mr-2'
                />
                {props.authorName}
              </div>
              <div className='w-full self-stretch'>
                <FormControl>
                  <Textarea
                    placeholder='댓글을 남겨보세요...'
                    className='resize-none  h-12'
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription> */}
                {/*   You can <span>@mention</span> other users and organizations. */}
                {/* </FormDescription> */}
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <input type='number' className='hidden' name='id' value={props.id} />
        <Button type='submit' className='justify-stretch h-10'>
          작성
        </Button>
      </form>
    </Form>
  );
}
