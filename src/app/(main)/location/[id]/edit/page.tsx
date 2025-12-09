"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation, useUpdateLocation } from "@/hooks/useLocation";
import { useProfile } from "@/auth/use-profile";

type Inputs = {
  name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  englishName?: string;
  phoneNumber?: string;
  websiteUrl?: string;
  snsUrl?: string;
};

export default function EditLocationPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string;
  const router = useRouter();
  const { data } = useLocation(id);
  const { data: user } = useProfile();
  const updateMutation = useUpdateLocation();
  const { register, handleSubmit, reset, formState } = useForm<Inputs>();

  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        englishName: data.englishName,
        phoneNumber: data.phoneNumber,
        websiteUrl: data.websiteUrl,
        snsUrl: data.snsUrl,
      });
    }
  }, [data, reset]);

  const onSubmit = handleSubmit(async (values) => {
    if (!id) return;
    try {
      await updateMutation.mutateAsync({
        id,
        data: values,
        authorUsername: data?.authorUsername,
      });
      router.push(`/location/${id}`);
    } catch (e) {
      alert((e as Error).message);
    }
  });

  if (!data) return null;

  const canEdit = !!user && user.username === data.authorUsername;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-medium mb-6">스페이스 수정</h1>
      {!canEdit ? (
        <div className="text-sm text-gray-600">
          본인이 작성한 스페이스만 수정할 수 있습니다.
        </div>
      ) : (
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input placeholder="이름" {...register("name")} />
          <Input placeholder="주소" {...register("address")} />
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              step="any"
              placeholder="위도"
              {...register("latitude", { valueAsNumber: true })}
            />
            <Input
              type="number"
              step="any"
              placeholder="경도"
              {...register("longitude", { valueAsNumber: true })}
            />
          </div>
          <Input placeholder="영어 이름" {...register("englishName")} />
          <Input placeholder="전화번호" {...register("phoneNumber")} />
          <Input placeholder="웹사이트" {...register("websiteUrl")} />
          <Input placeholder="SNS" {...register("snsUrl")} />
          <div className="flex justify-end">
            <Button type="submit" disabled={formState.isSubmitting}>
              수정하기
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
