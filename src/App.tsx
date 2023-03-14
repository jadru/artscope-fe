import React from "react";
import "./styles/tailwind.pcss";
import { TabLayout } from "./components";
import { Main } from "./pages";

const App: React.FC = () => (
  <div className="flex items-center justify-center">
    <Main />
  </div>
);

export default App;
