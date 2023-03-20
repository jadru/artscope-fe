import { atom } from "recoil";
// eslint-disable-next-line
import { TabAtomType } from "@/types/atomType";

export const TabAtom = atom<TabAtomType>({
  key: "TabAtom",
  default: "home",
});
