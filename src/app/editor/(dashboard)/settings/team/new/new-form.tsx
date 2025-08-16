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
import jxios from "@/utils/jxios";

interface NewTeamInputs {
  name: string;
  address: string;
  profileImage: string;
  backgroundImage: string;
  description: string;
  position: string;
}

const newTeamSchema = yup.object().shape({
  name: yup.string().required("팀 이름을 입력해주세요."),
  address: yup.string().required("주소를 입력해주세요."),
  profileImage: yup.string().required("프로필 이미지를 추가해주세요."),
  backgroundImage: yup.string().required("배경 이미지를 추가해주세요."),
  description: yup.string().required("팀 설명을 입력해주세요."),
  position: yup.string().required("팀에서 맡고있는 직책을 입력해주세요."),
});

export default function NewTeamForm() {
  const form = useForm<NewTeamInputs>({
    resolver: yupResolver(newTeamSchema),
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
    <div className="space-y-6">
      {/* 헤더 섹션 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">새로운 팀 생성</h2>
        <p className="text-gray-600 mt-1">
          새로운 팀을 생성하고 멤버들을 초대하세요
        </p>
      </div>

      <FormCard title="팀 정보 입력">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) =>
              jxios.post("/api/server/teams/", data).then((res) => {
                if (res.status === 201) {
                  toast.success("새로운 팀이 생성되었습니다.");
                  router.push("/editor/settings/team");
                } else {
                  toast.error("팀 생성에 실패했습니다.");
                }
              })
            )}
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
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      내 직책
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="팀에서 맡고있는 직책을 입력해주세요"
                        className="h-11 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />
            </div>

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

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="profileImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      프로필 이미지
                    </FormLabel>
                    <FormControl>
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
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="backgroundImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      배경 이미지
                    </FormLabel>
                    <FormControl>
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
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />
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
              {form.formState.isSubmitting ? "팀 생성 중..." : "팀 생성하기"}
            </Button>
          </form>
        </Form>
      </FormCard>
    </div>
  );
}
