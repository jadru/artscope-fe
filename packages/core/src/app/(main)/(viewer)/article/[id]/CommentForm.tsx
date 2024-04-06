import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import ASNextImage from '@/components/ASNextImage';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

import commentSchema, {
  CommentInputs,
} from '@/app/(main)/(viewer)/article/[id]/commentSchema';

type Props = {
  onSubmit: (data: CommentInputs) => void;
  authorName?: string;
  authorProfileUrl?: string;
  disabled?: boolean;
  id: number;
};

export default function CommentForm(props: Props) {
  const form = useForm<CommentInputs>({
    resolver: yupResolver<CommentInputs>(commentSchema),
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(props.onSubmit)}
        className='w-2/3 space-y-6'>
        <FormField
          control={form.control}
          name='comment'
          render={({ field }) => (
            <FormItem className='flex w-full'>
              <FormLabel>
                <ASNextImage
                  src={props.authorProfileUrl ?? 'prod/images/default.jpg'}
                  alt='프로필 사진'
                  width={64}
                  height={64}
                  className='h-16 w-16 rounded-full object-cover mr-2'
                />
                {props.authorName}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder='댓글을 남겨보세요...'
                  className='resize-none'
                  disabled={props.disabled}
                  {...field}
                />
              </FormControl>
              {/* <FormDescription> */}
              {/*   You can <span>@mention</span> other users and organizations. */}
              {/* </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <input type='hidden' name='id' value={props.id} />
        <Button type='submit' disabled={props.disabled}>
          작성
        </Button>
      </form>
    </Form>
  );
}
