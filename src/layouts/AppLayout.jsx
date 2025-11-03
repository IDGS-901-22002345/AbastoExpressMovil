import React, { useEffect, useState } from "react";
import {
  Outlet,
  useNavigate,
  useLoaderData,
  useLocation,
} from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Drawer,
  useMediaQuery,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  AccountCircle,
  Menu as MenuIcon,
  ChevronLeft,
  ChevronRight,
  Inventory as InventoryIcon,
  Receipt as ReceiptIcon,
  Group as GroupIcon,
  People as PeopleIcon,
} from "@mui/icons-material";

export default function AppLayout() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const open = Boolean(anchorEl);
  const user = useLoaderData();
  const navigate = useNavigate();
  const location = useLocation();

  const isMobile = useMediaQuery("(max-width:768px)");
  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => {
    setAnchorEl(null);
    navigate("/profile");
  };

  const handleLogout = () => {
    setAnchorEl(null);
    localStorage.removeItem("token");
    navigate("/login");
  };
  const toggleMobileSidebar = () => setMobileOpen(!mobileOpen);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location.pathname]);

  const allNavItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/",
      roles: ["ADMINTIENDA"],
    },
    {
      text: "Productos",
      icon: <InventoryIcon />,
      path: "/productos",
      roles: ["ADMINTIENDA", "EMPLEADO"],
    },
    {
      text: "Pedidos",
      icon: <ReceiptIcon />,
      path: "/pedidos",
      roles: ["EMPLEADO"],
    },
    {
      text: "Empleados",
      icon: <PeopleIcon />,
      path: "/empleados",
      roles: ["ADMINTIENDA"],
    },
    {
      text: "Tiendas",
      icon: <GroupIcon />,
      path: "/tiendas",
      roles: ["SUPERADMIN"],
    },
  ];

  const navItems = allNavItems.filter((item) => item.roles.includes(user?.rol));

  const [activeItem, setActiveItem] = useState(navItems[0].path);

  const shouldShowText = isMobile || sidebarOpen;

  const sidebarContent = (
    <Box className="h-full bg-green-700 text-white flex flex-col p-4">
      {/* Header sidebar con logo */}
      <Box className="flex items-center justify-between mb-4">
        <Box
          className={`transition-all duration-300 overflow-hidden ${
            sidebarOpen ? "w-auto" : "flex-1 flex justify-center"
          }`}
        >
          <img src="/vite.svg" alt="Logo" className="w-8 h-8" />
        </Box>

        {!isMobile && (
          <IconButton onClick={toggleSidebar}>
            {sidebarOpen ? (
              <ChevronLeft style={{ color: "#FFFFFF" }} />
            ) : (
              <ChevronRight style={{ color: "#FFFFFF" }} />
            )}
          </IconButton>
        )}
      </Box>

      <Divider className="mb-4 border-white/40" />

      {/* Botones personalizados */}
      <div className="py-2">
        {navItems.map((item) => {
          const isActive = activeItem === item.path;
          return (
            <button
              key={item.text}
              onClick={() => {
                setActiveItem(item.path);
                navigate(item.path);
                if (isMobile) toggleMobileSidebar();
              }}
              className={`flex items-center w-full p-3 rounded-lg space-x-3 text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? "bg-green-600 text-white border-l-4 border-green-300"
                  : "text-green-200 hover:bg-green-700 hover:text-white"
              }`}
            >
              <span className="flex items-center justify-center w-6">
                {item.icon}
              </span>
              {shouldShowText && <span>{item.text}</span>}
            </button>
          );
        })}
      </div>
    </Box>
  );

  return (
    <div className="flex min-h-screen bg-[#F7F7F7]">
      {/* Sidebar desktop */}
      {!isMobile && (
        <Box
          className={`transition-all duration-300 ${
            sidebarOpen ? "w-52" : "w-24"
          }`}
        >
          {sidebarContent}
        </Box>
      )}

      {/* Sidebar mobile */}
      {isMobile && (
        <Drawer
          open={mobileOpen}
          onClose={toggleMobileSidebar}
          variant="temporary"
          ModalProps={{ keepMounted: true }}
        >
          {sidebarContent}
        </Drawer>
      )}

      {/* Main content */}
      <Box className="flex-1 flex flex-col">
        {/* Header */}
        <Box className="bg-white shadow-md flex justify-between items-center px-4 md:px-6 h-16">
          {isMobile && (
            <IconButton onClick={toggleMobileSidebar}>
              <MenuIcon className="text-[#16A34A]" />
            </IconButton>
          )}
          <Typography variant="h6" className="font-bold text-[#16A34A]">
            Abasto Express
          </Typography>
          <Box>
            <IconButton
              onClick={handleProfileClick}
              className="flex items-center gap-2"
            >
              <AccountCircle className="text-[#16A34A]" fontSize="large" />
              <Typography className="text-[#16A34A] font-medium">
                {user?.nombreCompleto || "Usuario"}
              </Typography>
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem onClick={handleClose}>Perfil</MenuItem>
              <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Página actual */}
        <Box className="p-6 flex-1 overflow-auto">
          <Outlet />
        </Box>
      </Box>
    </div>
  );
}
