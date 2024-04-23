import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

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

type Props = {
  onSubmit: (data: CommentInputs) => void;
  authorName?: string;
  authorProfileUrl?: string;
};

export default function CommentForm(props: Props) {
  const form = useForm<CommentInputs>({
    resolver: yupResolver<CommentInputs>(commentSchema),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          props.onSubmit(data);
          form.reset({
            comment: '',
          });
        })}
        className='flex flex-col items-left w-full gap-2'>
        <p className='px-0.5'>{props.authorName}</p>
        <div className='flex gap-2 justify-center'>
          <FormField
            control={form.control}
            name='comment'
            render={({ field }) => (
              <FormItem className='flex w-full gap-2 h-full'>
                <div className='w-full'>
                  <FormControl>
                    <Textarea
                      placeholder='댓글을 남겨보세요...'
                      className='resize-none h-12'
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
          <Button
            type='submit'
            className='h-10 mt-2.5'
            disabled={form.formState.isSubmitting}>
            작성
          </Button>
        </div>
      </form>
    </Form>
  );
}
