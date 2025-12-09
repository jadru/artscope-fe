"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateLocation } from "@/hooks/useLocation";
import { useForm } from "react-hook-form";

type Inputs = {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  regionName?: string;
  phoneNumber?: string;
  websiteUrl?: string;
  snsUrl?: string;
};

export default function NewLocationPage() {
  const router = useRouter();
  const createMutation = useCreateLocation();
  const { register, handleSubmit, formState } = useForm<Inputs>();

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createMutation.mutateAsync(values);
      router.push("/location");
    } catch (e) {
      alert((e as Error).message);
    }
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-medium mb-6">스페이스 등록</h1>
      <form className="space-y-4" onSubmit={onSubmit}>
        <Input placeholder="이름" {...register("name", { required: true })} />
        <Input
          placeholder="주소"
          {...register("address", { required: true })}
        />
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="위도(latitude)"
            type="number"
            step="any"
            {...register("latitude", { valueAsNumber: true, required: true })}
          />
          <Input
            placeholder="경도(longitude)"
            type="number"
            step="any"
            {...register("longitude", { valueAsNumber: true, required: true })}
          />
        </div>
        <Input placeholder="지역명 (선택)" {...register("regionName")} />
        <Input placeholder="전화번호 (선택)" {...register("phoneNumber")} />
        <Input placeholder="웹사이트 (선택)" {...register("websiteUrl")} />
        <Input placeholder="SNS (선택)" {...register("snsUrl")} />
        <div className="flex justify-end">
          <Button type="submit" disabled={formState.isSubmitting}>
            등록하기
          </Button>
        </div>
      </form>
    </div>
  );
}
