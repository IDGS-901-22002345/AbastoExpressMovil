import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
  People as PeopleIcon,
  Group as GroupIcon,
} from "@mui/icons-material";

export default function AppLayout() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const open = Boolean(anchorEl);

  const isMobile = useMediaQuery("(max-width:768px)");
  const navigate = useNavigate();
  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    setAnchorEl(null);
    navigate("/login");
  };
  const toggleMobileSidebar = () => setMobileOpen(!mobileOpen);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const navItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Productos", icon: <InventoryIcon />, path: "/productos" },
    { text: "Pedidos", icon: <ReceiptIcon />, path: "/pedidos" },
    { text: "Empleados", icon: <PeopleIcon />, path: "/empleados" },
  ];

  const shouldShowText = isMobile || sidebarOpen;

  const sidebarContent = (
    <Box className="h-full bg-green-700 text-white flex flex-col p-4">
      {/* Header sidebar con logo */}
      <Box className="flex items-center justify-between mb-4">
        {/* Ajuste para centrar el logo al contraer */}
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

      <List>
        {navItems.map((item, index) => (
          <React.Fragment key={item.text}>
            <ListItemButton
              component={Link}
              to={item.path}
              className={`rounded-lg mb-2 transition-all duration-200 hover:bg-[#15803d] hover:shadow-lg ${
                !sidebarOpen ? "justify-center" : ""
              }`}
            >
              <ListItemIcon sx={{ color: "#FFFFFF" }}>{item.icon}</ListItemIcon>
              {/* Se usa la nueva variable 'shouldShowText' */}
              {shouldShowText && (
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{ className: "font-medium" }}
                />
              )}
            </ListItemButton>
            {(index === 2 || index === 4) && (
              <Divider className="my-2 border-white/40" />
            )}
          </React.Fragment>
        ))}
      </List>
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
                Tom Cook
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
