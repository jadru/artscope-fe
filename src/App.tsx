import { Error } from "@/components";
import { Exibition202306, Home, Member, Upload } from "@/pages";
import React from "react";
import "@/styles/tailwind.pcss";
import { QueryClientProvider, QueryClient } from "react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <Error />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "upload",
        element: <Upload />,
      },
      {
        path: "profile",
        element: <Member />,
      },
      {
        path: "upload/2023-summer",
        element: <Exibition202306 />,
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
