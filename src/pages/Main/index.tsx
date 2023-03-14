import React from "react";
import { TabLayout } from "../../components";

const Main: React.FC = () => (
  <TabLayout className="px-2" classNameChild="mt-2">
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 -z-50">
      {Array.from({ length: 40 }).map((value, index) => (
        <div className="p-16 bg-orange-400 rounded-md">
          <p className="text-white">{index + 1}</p>
        </div>
      ))}
    </div>
  </TabLayout>
);

export default Main;
