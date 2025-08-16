"use client";

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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { NEXT_PUBLIC_MEDIA_STORAGE_URL } from "@/constant/env";
import { useProfile } from "@/auth/use-profile";

import jxios from "@/utils/jxios";

interface NewTeamInputs {
  name: string;
  address: string;
  profileImage: string;
  backgroundImage: string;
  description: string;
}

const newTeamSchema = yup.object().shape({
  name: yup.string().required("팀 이름을 입력해주세요."),
  address: yup.string().required("주소를 입력해주세요."),
  profileImage: yup.string().required("프로필 이미지를 추가해주세요."),
  backgroundImage: yup.string().required("배경 이미지를 추가해주세요."),
  description: yup.string().required("팀 설명을 입력해주세요."),
});

export default function ModifyTeamForm({
  team,
}: {
  team: NewTeamInputs & {
    id: number;
  };
}) {
  const { data: user } = useProfile();
  const form = useForm<NewTeamInputs>({
    resolver: yupResolver(newTeamSchema),
    defaultValues: {
      ...team,
    },
  });
  const router = useRouter();

  const newImageUpload = async (file: File) => {
    const response = await fetch("/upload", {
      method: "POST",
      body: JSON.stringify({
        contentType: file.type,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      const formData = new FormData();
      Object.entries(data.fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append("file", file);
      const responseUpload = await fetch(data.url, {
        method: "POST",
        body: formData,
      });
      if (responseUpload.ok) {
        return NEXT_PUBLIC_MEDIA_STORAGE_URL + "/" + data.fields.key;
      }
    }
  };

  return (
    <FormCard title="팀 정보 수정">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            jxios
              .put("/teams/" + team.id, {
                name: data.name,
                address: data.address,
                profileImage: data.profileImage,
                backgroundImage: data.backgroundImage,
                description: data.description,
              })
              .then((res) => {
                if (res.status === 200) {
                  toast.success("팀 정보가 수정되었습니다.");
                  router.refresh();
                } else {
                  toast.error("팀 정보 수정에 실패했습니다.");
                }
              });
          })}
          className="space-y-6"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    팀 이름
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="팀 이름을 입력해주세요"
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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    팀 주소
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="팀의 주소를 입력해주세요"
                      className="h-11 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-sm" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                프로필 이미지
              </FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const file = e.target.files[0];
                    const url = await newImageUpload(file);
                    if (url) {
                      form.setValue("profileImage", url);
                    }
                  }
                }}
                className="h-11 border-gray-200 focus:border-blue-300 focus:ring-blue-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </FormItem>
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                배경 이미지
              </FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const file = e.target.files[0];
                    const url = await newImageUpload(file);
                    if (url) {
                      form.setValue("backgroundImage", url);
                    }
                  }
                }}
                className="h-11 border-gray-200 focus:border-blue-300 focus:ring-blue-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </FormItem>
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  팀 설명
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="팀에 대한 설명을 입력해주세요"
                    className="min-h-[120px] border-gray-200 focus:border-blue-300 focus:ring-blue-200 resize-none"
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
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "수정 중..." : "팀 정보 수정"}
          </Button>
        </form>
      </Form>
    </FormCard>
  );
}
