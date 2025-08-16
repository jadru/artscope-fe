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
        className="space-y-4"
      >
        {props.authorName && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {props.authorName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {props.authorName}
            </span>
          </div>
        )}

        <div className="space-y-3">
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="댓글을 남겨보세요..."
                    className="resize-none min-h-[80px] border-gray-200 focus:border-blue-300 focus:ring-blue-200 transition-colors rounded-lg"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
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
