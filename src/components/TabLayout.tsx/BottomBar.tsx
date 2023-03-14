import React from "react";
import { TabAtom } from "../../states/atom";
import { useRecoilState } from "recoil";
import { TabAtomType } from "type/atomType";

export const BottomBar: React.FC = () => {
  const [tab, setTab] = useRecoilState(TabAtom);

  const onTabButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // @ts-ignore
    setTab(e.currentTarget.value);
  };
  return (
    <div className="btm-nav md:bottom-8 md:w-96 md:left-1/2 md:-ml-48 md:rounded-2xl md:shadow-xl">
      <button className={tab === "home" ? "text-emerald-600" : ""} value="home" onClick={onTabButtonClick}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path
            fillRule="evenodd"
            d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
            clipRule="evenodd"
          />
        </svg>

        <span className="btm-nav-label">Home</span>
      </button>
      <button className={tab === "upload" ? "text-emerald-600" : ""} value="upload" onClick={onTabButtonClick}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z"
            clipRule="evenodd"
          />
        </svg>

        <span className="btm-nav-label">Upload</span>
      </button>
      <button className={`${tab === "alert" ? "text-emerald-600" : ""}`} value="alert" onClick={onTabButtonClick}>
        <div className={`indicator`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path
              fillRule="evenodd"
              d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 003.256.508 3.5 3.5 0 006.972 0 32.903 32.903 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zM8.05 14.943a33.54 33.54 0 003.9 0 2 2 0 01-3.9 0z"
              clipRule="evenodd"
            />
          </svg>

          <span className="badge badge-xs badge-primary indicator-item"></span>
        </div>
        <span className="btm-nav-label">Alert</span>
      </button>
      <button className={`${tab === "profile" ? "text-emerald-600" : ""}`} value="profile" onClick={onTabButtonClick}>
        <label tabIndex={0} className="avatar">
          <div className="rounded-full p-0.1 outline outline-1 w-4">
            <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
          </div>
        </label>
        <span className="btm-nav-label">Accounts</span>
      </button>
    </div>
  );
};
