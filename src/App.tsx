import React from "react";
import "./styles/tailwind.pcss";
import { Main, Member, Upload } from "./pages";
import { QueryClientProvider, QueryClient } from "react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { Error } from "./components";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <Error />,
    children: [
      {
        path: "home",
        element: <Main />,
      },
      {
        path: "upload",
        element: <Upload />,
      },
      {
        path: "profile",
        element: <Member />,
      },
    ],
  },
]);

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  </QueryClientProvider>
);

export default App;
