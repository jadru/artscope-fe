import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import commentSchema, {
  CommentInputs,
} from "@/app/(main)/(viewer)/article/[id]/commentSchema";

type Props = {
  onSubmit: (data: CommentInputs) => void;
  authorName?: string;
  authorProfileUrl?: string;
};

export default function CommentForm(props: Props) {
  const form = useForm<CommentInputs>({
    resolver: yupResolver(commentSchema),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          props.onSubmit(data);
          form.reset({
            comment: "",
          });
        })}
        className="space-y-6"
      >
        {props.authorName && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-light">
              {props.authorName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-light text-gray-700">
              {props.authorName}
            </span>
          </div>
        )}

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="댓글을 남겨보세요..."
                    className="resize-none min-h-[80px] border-gray-300 focus:border-gray-400 transition-colors"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-sm font-light" />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white font-light transition-colors"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  작성 중...
                </div>
              ) : (
                "댓글 작성"
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
