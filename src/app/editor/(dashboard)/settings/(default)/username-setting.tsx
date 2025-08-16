import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";

import FormCard from "@/components/FormCard";
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
    <div>
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
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <div className="w-full">
                    <FormControl>
                      <Input
                        placeholder="ID를 입력해주세요."
                        defaultValue={props.username}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    {!form.formState.errors.username &&
                      form.formState.isValid && (
                        <p className="text-green-600 text-sm">
                          사용 가능한 ID입니다.
                        </p>
                      )}
                  </div>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="h-9 mt-2"
              disabled={form.formState.isSubmitting || !form.formState.isValid}
            >
              저장
            </Button>
          </form>
        </Form>
      </FormCard>
    </div>
  );
}
