import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import AppLayout from "../layouts/AppLayout";
import LayoutDefault from "../layouts/LayoutDefault";
import { loginAction } from "../context/Auth/loginAction";
import { authLoader } from "../context/Auth/authLoader";
import Productos from "../pages/Productos";
import { tiendaLoader } from "../context/Tienda/tiendaLoader";
import Tienda from "../pages/Tienda";
import TiendaCreate from "../components/Tienda/TiendaCreate";
import { createTiendaAction } from "../context/Tienda/tiendaAction";

export const AppRoutes = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    loader: authLoader,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "productos",
        element: <Productos />,
      },
      {
        path: "tiendas",
        loader: tiendaLoader,
        element: <Tienda />,
      },
      {
        path: "tiendas/crear",
        element: <TiendaCreate />,
        action: createTiendaAction,
      },
    ],
  },
  {
    path: "/login",
    element: <LayoutDefault />,
    action: loginAction,
    children: [
      {
        path: "",
        element: <Login />,
      },
    ],
  },
]);
