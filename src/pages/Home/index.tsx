import { TabLayout, ResponsiveGrid, TopMenu } from "@/components";
import React from "react";

const Home: React.FC = () => (
  <TabLayout className="px-2" classNameChild="mt-2">
    <TopMenu />
    <ResponsiveGrid>
      {Array.from({ length: 40 }).map((value, index) => (
        <div className="p-16 bg-orange-400 rounded-md" key={"_" + index}>
          <p className="text-white">{index + 1}</p>
        </div>
      ))}
    </ResponsiveGrid>
  </TabLayout>
);

export default Home;
