import { TabLayout, ResponsiveGrid } from "@/components";
import React from "react";

interface Props {
  username: string;
  name: string;
  profileImage: string;
}

export const Member: React.FC = () => (
  <TabLayout>
    <div className="w-full flex flex-col items-center">
      <div className="card flex flex-row">
        <div className="avatar">
          <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
          </div>
        </div>
        <div className="flex flex-col">
          <p>누구누구누구</p>
          <p>@asdfasdf</p>
        </div>
      </div>
      <ResponsiveGrid>
        {Array.from({ length: 40 }).map((value, index) => (
          <div className="p-16 bg-orange-400 rounded-md">
            <p className="text-white">{index + 1}</p>
          </div>
        ))}
      </ResponsiveGrid>
    </div>
  </TabLayout>
);
