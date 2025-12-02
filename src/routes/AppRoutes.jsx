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
import {
  createEmpleadoAction,
  deleteEmpleadoAction,
  updateEmpleadoAction,
} from "../context/Empleado/empleadoAction";
import {
  productoByIdLoader,
  productosLoader,
} from "../context/Productos/productoLoader";
import {
  createProductoAction,
  deleteProductoAction,
  updateProductoAction,
} from "../context/Productos/productoAction";
import ProductoCreate from "../components/Productos/ProductoCreate";
import ProductoEdit from "../components/Productos/ProductoEdit";
import Inventario from "../pages/Inventario";
import Movimientos from "../pages/Movimientos";
import { movimientosLoader } from "../context/movimientos/movimientoLoader";
import { createMovimientoAction } from "../context/movimientos/movimientoAction";
import { inventarioLoader } from "../context/inventario/inventarioLoader";
import Pedidos from "../pages/Pedidos";
import { pedidosLoader } from "../context/Pedidos/pedidosLoader";
import { perfilLoader } from "../context/perfil/perfilLoader";
import { perfilActions } from "../context/perfil/perfilActions";
import Mermas from "../pages/Mermas";
import { mermaLoader } from "../context/merma/mermaLoader";
import { createMermaAction } from "../context/merma/mermaAction";
import Compras from "../pages/Compras";
import { compraLoader } from "../context/compras/compraLoader";
import { compraAction } from "../context/compras/compraAction";

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
        loader: perfilLoader,
        action: perfilActions,
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
        path: "pedidos",
        element: <Pedidos />,
        loader: pedidosLoader,
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
      {
        path: "mermas",
        element: <Mermas />,
        loader: mermaLoader,
        action: createMermaAction,
      },
      {
        path: "compras",
        element: <Compras />,
        loader: compraLoader,
        action: compraAction,
      },
      {
        path: "inventario",
        element: <Inventario />,
        loader: inventarioLoader,
      },
      {
        path: "movimientos",
        loader: movimientosLoader,
        element: <Movimientos />,
        children: [
          {
            path: "crear",
            action: createMovimientoAction,
          },
        ],
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
