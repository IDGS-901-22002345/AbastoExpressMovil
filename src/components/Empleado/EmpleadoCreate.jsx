import React from "react";
import { Form, useNavigate, useActionData } from "react-router-dom";
import {
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";

const EmpleadoCreate = () => {
  const navigate = useNavigate();
  const actionData = useActionData();

  return (
    <Paper className="p-6 rounded-xl shadow-md bg-white max-w-2xl mx-auto">
      <Typography variant="h4" className="text-green-700 font-bold mb-6">
        Crear Empleado
      </Typography>

      {actionData?.error && (
        <Alert severity="error" className="mb-4">
          {actionData.error}
        </Alert>
      )}
      <Form method="post">
        <TextField
          label="Nombre completo"
          name="nombreCompleto"
          fullWidth
          margin="normal"
          required
          placeholder="Ej: Juan Pérez García"
        />

        <TextField
          label="Email"
          name="email"
          fullWidth
          margin="normal"
          type="email"
          required
          placeholder="empleado@ejemplo.com"
        />

        <TextField
          label="Contraseña"
          name="password"
          fullWidth
          margin="normal"
          type="password"
          required
          helperText="Mínimo 6 caracteres"
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel id="rol-label">Rol</InputLabel>
          <Select
            labelId="rol-label"
            name="rol"
            label="Rol"
            defaultValue=""
          >
            <MenuItem value="EMPLEADO">Empleado</MenuItem>
            <MenuItem value="ADMINTIENDA">Admin Tienda</MenuItem>
          </Select>
        </FormControl>

        <div className="flex justify-end mt-6 gap-2">
          <Button type="submit" variant="contained" color="success">
            Crear Empleado
          </Button>
          <Button
            type="button"
            variant="outlined"
            color="primary"
            onClick={() => navigate("/empleados")}
          >
            Cancelar
          </Button>
        </div>
      </Form>
    </Paper>
  );
};

export default EmpleadoCreate;