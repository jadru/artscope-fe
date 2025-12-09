"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Upload, Loader2, Camera } from "lucide-react";

import ASNextImage from "@/components/shared/ASNextImage";
import jxios from "@/utils/jxios";
import { profileApiResponseType } from "@/types/profile";
import { useProfile } from "@/auth/use-profile";

const fetchProfile = async (): Promise<profileApiResponseType> =>
  await jxios
    .get("/api/server/members/profile")
    .then((res) => res.data as profileApiResponseType);

export default function ProfileSettingsPage() {
  const { data: user } = useProfile();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [data, setData] = useState<profileApiResponseType>();
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchProfile().then((res) => setData(res));
  }, [user?.picture]);

  const handleProfileImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    if (!file.type.startsWith("image/")) {
      toast.error("이미지 파일만 업로드 가능합니다.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("파일 크기는 5MB를 초과할 수 없습니다.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("profile", file);

    try {
      const res = await jxios.put(
        "/api/server/members/" + data?.username + "/picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            accept: "*/*",
          },
        }
      );
      if (res.status === 200) {
        const profile = res.data as profileApiResponseType;
        setData(profile);
        toast.success("프로필 사진이 변경되었습니다.");
      }
    } catch (error) {
      toast.error("프로필 사진 변경에 실패했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Image Section */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          프로필 사진
        </label>
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={() => inputRef?.current?.click()}
            disabled={isUploading}
            className="group relative"
          >
            <div className="relative h-32 w-32 overflow-hidden rounded-full">
              {data.picture ? (
                <ASNextImage
                  src={data.picture}
                  alt="프로필 사진"
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
                  <Camera className="h-12 w-12 text-gray-400" />
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-0 transition-all duration-200 group-hover:bg-opacity-60">
                <div className="flex flex-col items-center space-y-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {isUploading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-white" />
                      <span className="text-xs font-medium text-white">
                        변경
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </button>

          <input
            type="file"
            className="hidden"
            ref={inputRef}
            accept="image/jpg, image/png, image/jpeg, image/gif, image/webp"
            onChange={handleProfileImageUpload}
            disabled={isUploading}
          />

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            JPG, PNG, GIF 형식 지원 (최대 5MB)
          </p>
        </div>
      </div>
    </div>
  );
}
