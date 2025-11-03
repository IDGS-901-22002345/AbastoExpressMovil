import React from "react";
import { Form, useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
} from "@mui/material";

const TiendaCreate = () => {
  const navigate = useNavigate();

  return (
    <Paper className="p-6 rounded-xl shadow-md bg-white">
      <Typography variant="h4" className="text-green-700 font-bold mb-6">
        Crear Tienda
      </Typography>

      {/* Usamos Form de react-router-dom para vincular con action */}
      <Form method="post">
        <Grid container spacing={4}>
          {/* Datos de la tienda */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" className="mb-2 font-semibold">
              Datos de la tienda
            </Typography>
            <Divider className="mb-4" />
            <TextField
              label="Nombre"
              name="nombre"
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Descripción"
              name="descripcion"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Dirección"
              name="direccion"
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Teléfono"
              name="telefono"
              fullWidth
              margin="normal"
              type="tel"
            />
            <TextField
              label="Email de contacto"
              name="emailContacto"
              fullWidth
              margin="normal"
              type="email"
            />
            <TextField
              label="Logo URL"
              name="logoUrl"
              fullWidth
              margin="normal"
            />
          </Grid>

          {/* Datos del administrador */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" className="mb-2 font-semibold">
              Administrador de la tienda
            </Typography>
            <Divider className="mb-4" />
            <TextField
              label="Nombre completo"
              name="adminNombre"
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Email"
              name="adminEmail"
              fullWidth
              margin="normal"
              type="email"
              required
            />
            <TextField
              label="Contraseña"
              name="adminPassword"
              fullWidth
              margin="normal"
              type="password"
              required
            />
          </Grid>
        </Grid>

        <div className="flex justify-end mt-6 gap-2">
          <Button type="submit" variant="contained" color="success">
            Crear Tienda
          </Button>
          <Button
            type="button"
            variant="outlined"
            color="primary"
            onClick={() => navigate("/tiendas")}
          >
            Cancelar
          </Button>
        </div>
      </Form>
    </Paper>
  );
};

export default TiendaCreate;
