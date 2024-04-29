import { Navigate, RouteObject } from "react-router-dom";
import Layout from "./components/Layout";
import FoodTrucks from "./views/FoodTrucks";
import FoodTrucksMap from "./views/FoodTrucksMap";

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/food-trucks" />,
      },
      {
        path: "/food-trucks",
        element: <FoodTrucks />,
      },
      {
        path: "/food-trucks-map",
        element: <FoodTrucksMap />,
      },
    ],
  },
];
