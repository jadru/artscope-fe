import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";

import FormCard from "@/components/shared/FormCard";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import jxios from "@/utils/jxios";

export default function UserNameSetting(props: { username: string }) {
  const form = useForm<{
    username: string;
  }>({
    mode: "onBlur",
    resolver: yupResolver(
      yup.object().shape({
        username: yup
          .string()
          .required("ID를 입력해주세요.")
          .notOneOf([props.username], "현재 ID와 동일합니다.")
          .max(20, "20자 이내로 입력해주세요.")
          .matches(/^[a-zA-Z0-9]*$/, "영문 대소문자, 숫자만 입력 가능합니다.")
          .min(4, "4자 이상 입력해주세요.")
          .test("username", "이미 사용중인 ID입니다.", async (value) => {
            try {
              const res = await jxios.get(
                `/api/server/members/username/${value}`
              );
              return res.status === 200;
            } catch (e) {
              return false;
            }
          }),
      })
    ),
  });
  const router = useRouter();

  return (
    <FormCard title="아이디 변경">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) =>
            jxios
              .put("/members/" + props.username, {
                username: props.username,
                newUsername: data.username,
              })
              .then((res) => {
                if (res.status === 200) {
                  toast.success("아이디가 변경되었습니다.");
                  router.refresh();
                } else {
                  toast.error("아이디 변경에 문제가 있습니다.");
                }
              })
          )}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="새로운 ID를 입력해주세요"
                    defaultValue={props.username}
                    className="h-12 rounded-lg border-gray-200 transition-colors focus:border-gray-900 dark:border-gray-800 dark:focus:border-gray-100"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-sm" />
                {!form.formState.errors.username && form.formState.isValid && (
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    ✓ 사용 가능한 ID입니다
                  </p>
                )}
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="h-12 w-full rounded-full bg-gray-900 font-medium text-white hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:disabled:bg-gray-800 dark:disabled:text-gray-600"
            disabled={form.formState.isSubmitting || !form.formState.isValid}
          >
            {form.formState.isSubmitting ? "변경 중..." : "아이디 변경"}
          </Button>
        </form>
      </Form>
    </FormCard>
  );
}
