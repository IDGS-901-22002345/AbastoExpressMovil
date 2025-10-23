import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import AppLayout from "../layouts/AppLayout";

const AppRoutes = ({ isAuthenticated }) => {
  return (
    <Routes>
      {/* Página pública */}
      <Route path="/login" element={<Login />} />

      {/* Layout protegido */}
      <Route
        path="/"
        element={
          isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="perfil" element={<Profile />} />
      </Route>

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
