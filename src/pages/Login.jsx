import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Paper
        elevation={8}
        className="w-full max-w-md p-10 rounded-3xl shadow-2xl bg-white flex flex-col gap-6"
      >
        {/* Logo */}
        <Box className="flex justify-center mb-8">
          <img
            src="/vite.svg"
            alt="Logo"
            className="w-20 h-20 opacity-90 hover:scale-105 transition-transform duration-300"
          />
        </Box>

        {/* Título */}
        <Typography
          variant="h4"
          fontWeight={700}
          className="text-center text-green-700 mb-10"
        >
          Inicia sesión
        </Typography>

        {/* Formulario */}
        <Box
          component="form"
          noValidate
          autoComplete="off"
          className="flex flex-col  gap-6"
        >
          <TextField
            fullWidth
            label="Correo electrónico"
            variant="outlined"
            type="email"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "0.75rem",
                "&.Mui-focused fieldset": {
                  borderColor: "#16A34A",
                },
              },
            }}
          />

          <TextField
            fullWidth
            label="Contraseña"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "0.75rem",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{
              bgcolor: "#16A34A",
              py: 1.4,
              borderRadius: "0.75rem",
              fontWeight: "600",
              fontSize: "1rem",
              "&:hover": { bgcolor: "#15803D" },
            }}
          >
            Entrar
          </Button>

          <Typography
            variant="body2"
            className="text-center text-gray-500 hover:text-green-700 cursor-pointer transition-colors duration-200"
          >
            ¿Olvidaste tu contraseña?
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
