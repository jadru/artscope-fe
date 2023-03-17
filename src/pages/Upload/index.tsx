import { TabLayout } from "../../components";
import React, { useState } from "react";

export const Upload: React.FC = () => {
  const [isEdited, setIsEdited] = useState(false);
  return (
    <TabLayout>
      <div className={"flex items-center justify-center w-full h-full"}>
        <form className="sm:w-full md:w-[400px]">
          <input type="file" className="file-input file-input-bordered file-input-primary w-full" multiple />
          <div className="flex flex-row min-w-full overflow-x-scroll">
            {Array.from({ length: 40 }).map((value, index) => (
              <div className="p-16 bg-orange-400 rounded-md">
                <button className="btn" />
                <p className="text-white">{index + 1}</p>
                <input type="text" />
              </div>
            ))}
          </div>
          <input type="text" multiple className="input input-primary" />
        </form>
      </div>
    </TabLayout>
  );
};
