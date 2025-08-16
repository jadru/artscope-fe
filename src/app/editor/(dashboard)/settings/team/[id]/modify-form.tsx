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
    <div>
      <FormCard title="팀 정보 변경">
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
                    toast.success("팀 정보가 변경되었습니다.");
                    router.refresh();
                  } else {
                    toast.error("팀 정보 변경에 실패했습니다.");
                  }
                });
            })}
            className="flex w-full flex-col gap-1"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="w-full">
                    <FormLabel>팀 이름</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="팀 이름을 입력해주세요."
                        defaultValue=""
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <div className="w-full">
                    <FormLabel>주소</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="팀의 주소를 입력해주세요."
                        defaultValue=""
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>프로필 이미지</FormLabel>
              <Input
                type="file"
                placeholder="프로필 이미지를 추가해주세요."
                defaultValue=""
                accept={"image/*"}
                onChange={async (e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const file = e.target.files[0];
                    const url = await newImageUpload(file);
                    if (url) {
                      form.setValue("profileImage", url);
                    }
                  }
                }}
              />
            </FormItem>
            <FormItem>
              <FormLabel>배경 이미지</FormLabel>
              <Input
                type="file"
                placeholder="배경 이미지를 추가해주세요."
                defaultValue=""
                onChange={async (e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const file = e.target.files[0];
                    const url = await newImageUpload(file);
                    if (url) {
                      form.setValue("backgroundImage", url);
                    }
                  }
                }}
              />
            </FormItem>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <div className="w-full">
                    <FormLabel>팀 설명</FormLabel>
                    <FormControl>
                      <Textarea
                        className="h-32"
                        placeholder="팀 설명을 입력해주세요."
                        defaultValue=""
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="h-9 mt-2 self-start"
              disabled={form.formState.isSubmitting}
            >
              저장
            </Button>
          </form>
        </Form>
      </FormCard>
    </div>
  );
}
