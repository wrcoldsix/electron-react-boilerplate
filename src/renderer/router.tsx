import Home from "@/routes/home/home";
import MoneyCal from "@/routes/moneyCal/moneyCal";
import {
  createBrowserRouter,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    // loader: rootLoader,
    children: [
      {
        path: "moneyCal",
        element: <MoneyCal />,
        // loader: teamLoader,
      },
    ],
  },
]);

export default router
