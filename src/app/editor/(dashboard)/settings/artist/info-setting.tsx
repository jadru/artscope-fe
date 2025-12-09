"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useState, useEffect, useMemo } from "react";

import FormCard from "@/components/shared/FormCard";
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

import jxios from "@/utils/jxios";

interface InfoInputs {
  name: string;
  snsUrl?: string;
  websiteUrl?: string;
  introduction?: string;
  history?: string;
}

const infoSchema = (profile: InfoInputs) =>
  yup.object().shape({
    name: yup.string().required("작가명을 입력해주세요."),
    snsUrl: yup.string().url("URL 형식이 아닙니다.").optional(),
    websiteUrl: yup.string().url("URL 형식이 아닙니다.").optional(),
    introduction: yup
      .string()
      .max(1000, "1000자 이내로 작성해주세요.")
      .optional(),
    history: yup.string().max(1000, "1000자 이내로 작성해주세요.").optional(),
  }) as yup.ObjectSchema<InfoInputs>;

export default function InfoSetting(props: {
  profile: InfoInputs;
  username: string;
}) {
  const [historyLines, setHistoryLines] = useState<string[]>([]);
  const form = useForm<InfoInputs>({
    resolver: yupResolver(infoSchema(props.profile)),
    defaultValues: props.profile,
  });
  const router = useRouter();

  // 기존 이력을 라인별로 분리하여 초기화
  useEffect(() => {
    if (props.profile.history) {
      const lines = props.profile.history
        .split("\n")
        .filter((line) => line.trim() !== "");
      setHistoryLines(lines.length > 0 ? lines : [""]);
    } else {
      setHistoryLines([""]);
    }
  }, [props.profile.history]);

  // 라인 추가
  const addHistoryLine = () => {
    setHistoryLines([...historyLines, ""]);
  };

  // 라인 삭제
  const removeHistoryLine = (index: number) => {
    if (historyLines.length > 1) {
      const newLines = historyLines.filter((_, i) => i !== index);
      setHistoryLines(newLines);
      // 폼 값 업데이트
      form.setValue("history", newLines.join("\n"));
    }
  };

  // 라인 수정
  const updateHistoryLine = (index: number, value: string) => {
    const newLines = [...historyLines];
    newLines[index] = value;
    setHistoryLines(newLines);
    // 폼 값 업데이트
    form.setValue("history", newLines.join("\n"));
  };

  const isSameAsProfile = useMemo(() => {
    return (
      form.getValues("name") === props.profile.name &&
      form.getValues("snsUrl") === props.profile.snsUrl &&
      form.getValues("websiteUrl") === props.profile.websiteUrl &&
      form.getValues("introduction") === props.profile.introduction &&
      form.getValues("history") === props.profile.history
    );
  }, [
    form.getValues("name"),
    form.getValues("snsUrl"),
    form.getValues("websiteUrl"),
    form.getValues("introduction"),
    form.getValues("history"),
  ]);

  return (
    <FormCard title="작가 정보 변경">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            // 이력 데이터를 라인별로 결합
            const historyData = {
              ...data,
              history: historyLines.join("\n"),
            };

            jxios
              .put("/api/server/members/" + props.username, historyData)
              .then((res) => {
                if (res.status === 200) {
                  toast.success("작가 정보가 변경되었습니다.");
                  router.refresh();
                } else {
                  toast.error("작가 정보 변경에 문제가 있습니다.");
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
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    작가명
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="작가명을 입력해주세요"
                      className="h-12 rounded-lg border-gray-200 transition-colors focus:border-gray-900 dark:border-gray-800 dark:focus:border-gray-100"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="snsUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    SNS URL
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="SNS URL을 입력해주세요"
                      className="h-12 rounded-lg border-gray-200 transition-colors focus:border-gray-900 dark:border-gray-800 dark:focus:border-gray-100"
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
            name="websiteUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  웹사이트 URL
                </FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="웹사이트 URL을 입력해주세요"
                    className="h-12 rounded-lg border-gray-200 transition-colors focus:border-gray-900 dark:border-gray-800 dark:focus:border-gray-100"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="introduction"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  작가 소개
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="작가 소개를 입력해주세요"
                    className="min-h-[100px] resize-none rounded-lg border-gray-200 transition-colors focus:border-gray-900 dark:border-gray-800 dark:focus:border-gray-100"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />

          {/* 작가 이력 - 라인별 입력 */}
          <div className="space-y-4">
            <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
              작가 이력
            </FormLabel>

            <div className="space-y-3">
              {historyLines.map((line, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-1">
                    <Input
                      placeholder={`이력 ${index + 1}을 입력해주세요`}
                      value={line}
                      onChange={(e) => updateHistoryLine(index, e.target.value)}
                      className="h-12 rounded-lg border-gray-200 transition-colors focus:border-gray-900 dark:border-gray-800 dark:focus:border-gray-100"
                    />
                  </div>
                  {historyLines.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeHistoryLine(index)}
                      className="h-12 rounded-lg border-red-200 px-3 text-red-600 hover:border-red-300 hover:bg-red-50"
                    >
                      삭제
                    </Button>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addHistoryLine}
                className="h-12 w-full rounded-lg border-dashed border-gray-300 text-gray-600 hover:border-gray-900 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-50"
              >
                + 이력 추가
              </Button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              각 이력은 별도의 줄로 표시됩니다. 최소 1개 이상의 이력이
              필요합니다.
            </p>
          </div>

          <Button
            type="submit"
            className="h-12 w-full rounded-full bg-gray-900 font-medium text-white hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:disabled:bg-gray-800 dark:disabled:text-gray-600"
            disabled={form.formState.isSubmitting || isSameAsProfile}
          >
            {form.formState.isSubmitting
              ? "저장 중..."
              : isSameAsProfile
                ? "변경 사항 없음"
                : "작가 정보 저장"}
          </Button>
        </form>
      </Form>
    </FormCard>
  );
}
