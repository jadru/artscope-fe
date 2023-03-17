import React from "react";

interface Props {
  children?: React.ReactNode;
}

export const ResponsiveGrid: React.FC<Props> = ({ children }) => (
  <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 -z-50">{children}</div>
);
