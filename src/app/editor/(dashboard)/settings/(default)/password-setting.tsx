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

export default function PasswordSetting(props: { username: string }) {
  const form = useForm<{
    newPassword: string;
    newPasswordConfirm: string;
  }>({
    mode: "onBlur",
    resolver: yupResolver(
      yup.object().shape({
        newPassword: yup
          .string()
          .required("새 비밀번호를 입력해주세요.")
          .min(8, "8자 이상 입력해주세요.")
          .max(20, "20자 이내로 입력해주세요.")
          .matches(
            /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+]).{8,20}$/,
            "영문, 숫자, 특수문자를 포함해주세요."
          ),
        newPasswordConfirm: yup
          .string()
          .required("비밀번호를 다시 입력해주세요.")
          .oneOf([yup.ref("newPassword")], "비밀번호가 일치하지 않습니다."),
      })
    ),
  });
  const router = useRouter();

  return (
    <FormCard title="비밀번호 변경">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) =>
            jxios
              .put("/members/" + props.username, {
                password: data.newPassword,
              })
              .then((res) => {
                if (res.status === 200) {
                  toast.success("비밀번호가 변경되었습니다.");
                  router.refresh();
                  form.reset({
                    newPassword: "",
                    newPasswordConfirm: "",
                  });
                } else {
                  toast.error("비밀번호 변경에 문제가 있습니다.");
                }
              })
          )}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="새로운 비밀번호를 입력해주세요"
                    defaultValue=""
                    className="h-11 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPasswordConfirm"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="새로운 비밀번호를 다시 입력해주세요"
                    className="h-11 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
            disabled={form.formState.isSubmitting || !form.formState.isValid}
          >
            {form.formState.isSubmitting ? "변경 중..." : "비밀번호 변경"}
          </Button>
        </form>
      </Form>
    </FormCard>
  );
}
