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
import { Form } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <Paper
        elevation={8}
        className="w-full max-w-md p-10 rounded-3xl shadow-2xl bg-white flex flex-col gap-6"
      >
        <Box className="flex justify-center mb-8">
          <img
            src="/vite.svg"
            alt="Logo"
            className="w-20 h-20 opacity-90 hover:scale-105 transition-transform duration-300"
          />
        </Box>

        <Typography
          variant="h4"
          fontWeight={700}
          className="text-center text-green-700 mb-2"
        >
          Inicia sesión
        </Typography>

        <Form method="post" replace className="flex flex-col gap-6">
          <TextField
            fullWidth
            label="Correo electrónico"
            variant="outlined"
            type="email"
            name="email"
            required
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
            name="password"
            required
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
            type="submit"
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
        </Form>
      </Paper>
    </Box>
  );
}
