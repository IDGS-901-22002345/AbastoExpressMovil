import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme/muiTheme";
import { CssBaseline } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { RouterProvider } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { DashboardProvider } from "./context/dashboard/DashboardContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer position="top-right" autoClose={3000} />
      <DashboardProvider>
        <RouterProvider router={AppRoutes} />
      </DashboardProvider>
    </ThemeProvider>
  </StrictMode>
);
