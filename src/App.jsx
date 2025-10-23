import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme/muiTheme";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  const isAuthenticated = true; // Utilidad que se usara mas adelante con jwt

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppRoutes isAuthenticated={isAuthenticated} />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
