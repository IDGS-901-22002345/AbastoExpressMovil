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
import Empleado from "../pages/Empleado";
import { empleadosLoader } from "../context/Empleado/empleadoLoader";
import { createEmpleadoAction, deleteEmpleadoAction, updateEmpleadoAction } from "../context/Empleado/empleadoAction";
import { productoByIdLoader, productosLoader } from "../context/Productos/productoLoader";
import { createProductoAction, deleteProductoAction, updateProductoAction } from "../context/Productos/productoAction";
import ProductoCreate from "../components/Productos/ProductoCreate";
import ProductoEdit from "../components/Productos/ProductoEdit";
import Inventario from "../pages/Inventario";

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
        path: "tiendas",
        loader: tiendaLoader,
        element: <Tienda />,
      },
      {
        path: "tiendas/crear",
        element: <TiendaCreate />,
        action: createTiendaAction,
      },
      {
        path: "empleados",
        loader: empleadosLoader,
        element: <Empleado />,
      },
      {
        path: "empleados/crear",
        action: createEmpleadoAction,
      },
      {
        path: "empleados/:id/editar",
        action: updateEmpleadoAction, 
      },
      {
        path: "empleados/:id/eliminar",
        action: deleteEmpleadoAction,
      },
      {
        path: "productos",
        loader: productosLoader,
        element: <Productos />,
      },
      {
        path: "productos/crear",
        element: <ProductoCreate />,
        action: createProductoAction,
      },
      {
        path: "productos/:id/editar",
        element: <ProductoEdit />,
        loader: productoByIdLoader,
        action: updateProductoAction,
      },
      {
        path: "productos/:id/eliminar",
        action: deleteProductoAction,
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
