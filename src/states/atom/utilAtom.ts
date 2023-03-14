import React from "react";
import { atom } from "recoil";
import { TabAtomType } from "../../type/atomType";

export const TabAtom = atom<TabAtomType>({
  key: "TabAtom",
  default: "home",
});
