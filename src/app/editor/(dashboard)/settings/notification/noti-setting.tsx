"use client";

import { CheckedState } from "@radix-ui/react-checkbox";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

import FormCard from "@/components/shared/FormCard";
import { Checkbox } from "@/components/ui/checkbox";

import jxios from "@/utils/jxios";

export default function NotiEmailSetting(props: {
  username: string;
  emailReceive?: boolean;
  emailReceiveUpdatedAt?: string;
}) {
  const [checked, setChecked] = useState(props.emailReceive);
  const router = useRouter();

  const onCheckboxChange = (checked: CheckedState) =>
    jxios
      .put(
        "/members/" + props.username + "/email-receive",
        {},
        {
          params: {
            emailReceive: checked,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          toast.success(
            `${format(new Date(), "yyyy-MM-dd HH:mm:ss")} 알림 설정이 ${
              checked ? "동의" : "동의 철회"
            }되었습니다.`
          );
          setChecked(checked as boolean);
          router.refresh();
        }
      });

  return (
    <FormCard title="알림 설정">
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="email-notification"
            onCheckedChange={onCheckboxChange}
            checked={checked}
            className="mt-1"
          />
          <div className="space-y-2">
            <label
              htmlFor="email-notification"
              className="text-sm font-medium text-gray-900 cursor-pointer"
            >
              홍보성 이메일 알림 동의
            </label>
            <p className="text-sm text-gray-600 leading-relaxed">
              예술 관련 공지 및 이벤트 안내, 뉴스레터 등 홍보성 이메일 알림에
              동의합니다.
            </p>
            {props.emailReceiveUpdatedAt && (
              <p className="text-xs text-gray-500">
                {format(
                  new Date(props.emailReceiveUpdatedAt),
                  "yyyy년 MM월 dd일 HH시 mm분"
                )}
                에 동의하셨습니다.
              </p>
            )}
          </div>
        </div>
      </div>
    </FormCard>
  );
}
