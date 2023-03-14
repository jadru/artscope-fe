import React from "react";
import "./styles/tailwind.pcss";
import { Main } from "./pages";
import { QueryClientProvider, QueryClient } from "react-query";
import { RecoilRoot } from "recoil";

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <RecoilRoot>
      <div className="flex items-center justify-center">
        <Main />
      </div>
    </RecoilRoot>
  </QueryClientProvider>
);

export default App;
