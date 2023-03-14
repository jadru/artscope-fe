import React, { useState } from "react";
import { BottomBar } from "./BottomBar";
import { NavBar } from "./NavBar";

interface Props {
  children: React.ReactNode;
  className?: string;
  classNameChild?: string;
}

const TabLayout: React.FC<Props> = ({ children, className, classNameChild }) => {
  return (
    <div className={`w-full h-full flex flex-col ${className}`}>
      <NavBar
        title="ArtPlatform"
        onSearchClick={() => {
          alert("검색");
        }}
      />
      <div className={`pt-16 pb-20 md:pb-28 ${classNameChild}`}>{children}</div>
      <BottomBar />
    </div>
  );
};

export default TabLayout;
