import React, { useState } from "react";
import { Form, useNavigate, useLoaderData, useActionData } from "react-router-dom";
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

const EmpleadoEdit = () => {
  const navigate = useNavigate();
  const empleado = useLoaderData();
  const actionData = useActionData();
  const [showPasswordField, setShowPasswordField] = useState(false);

  return (
    <Paper className="p-6 rounded-xl shadow-md bg-white max-w-2xl mx-auto">
      <Typography variant="h4" className="text-green-700 font-bold mb-6">
        Editar Empleado
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
          defaultValue={empleado.nombreCompleto}
        />

        <TextField
          label="Email"
          name="email"
          fullWidth
          margin="normal"
          type="email"
          defaultValue={empleado.email}
        />

        {!showPasswordField ? (
          <Button
            variant="text"
            color="primary"
            onClick={() => setShowPasswordField(true)}
            className="mt-2"
          >
            Cambiar contraseña
          </Button>
        ) : (
          <TextField
            label="Nueva contraseña"
            name="password"
            fullWidth
            margin="normal"
            type="password"
            helperText="Dejar vacío para mantener la contraseña actual"
          />
        )}

        <FormControl fullWidth margin="normal">
          <InputLabel id="rol-label">Rol</InputLabel>
          <Select
            labelId="rol-label"
            name="rol"
            label="Rol"
            defaultValue={empleado.rol}
          >
            <MenuItem value="EMPLEADO">Empleado</MenuItem>
            <MenuItem value="ADMINTIENDA">Admin Tienda</MenuItem>
          </Select>
        </FormControl>

        <div className="flex justify-end mt-6 gap-2">
          <Button type="submit" variant="contained" color="success">
            Guardar Cambios
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

export default EmpleadoEdit;