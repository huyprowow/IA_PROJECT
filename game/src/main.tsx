import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { router } from "./router/router";
import Load from "./Component/Load/Load";
import LoadScreen from "./Component/Load/LoadScreen";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Suspense fallback={<LoadScreen/>}>
      <RouterProvider router={router} />
    </Suspense>
  </React.StrictMode>
);
