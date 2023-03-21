import React from "react";
import { Link } from "react-router-dom";

export const TopMenu: React.FC = () => (
  <div className={"mb-4"}>
    <Link to={"/"} className={"text-5xl font-bold mx-2"}>
      홈
    </Link>
    <Link to={"/"} className={"text-5xl font-light mx-2"}>
      플레이리스트
    </Link>
    <Link to={"/"} className={"text-5xl font-light mx-2"}>
      매거진
    </Link>
  </div>
);
