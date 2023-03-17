import React from "react";
import { TabLayout, ResponsiveGrid } from "../../components";

const Main: React.FC = () => (
  <TabLayout className="px-2" classNameChild="mt-2">
    <ResponsiveGrid>
      {Array.from({ length: 40 }).map((value, index) => (
        <div className="p-16 bg-orange-400 rounded-md">
          <p className="text-white">{index + 1}</p>
        </div>
      ))}
    </ResponsiveGrid>
  </TabLayout>
);

export default Main;
