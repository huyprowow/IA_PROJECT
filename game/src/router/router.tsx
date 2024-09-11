import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Page3D from "../Page/3d/Page3D";
import PageXR from "../Page/XR/PageXR";

export const router = createBrowserRouter([
    {
      path: "/",
      element:  <App />,
      errorElement: <h1>NotFound</h1>
    },
    {
      path: "/3d",
      element: <Page3D/>

    },
    {
      path: "/xr",
      element: <PageXR />,

    },
    
  ]);