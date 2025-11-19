import { useLoaderData, useFetcher } from "react-router-dom";
import { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  CircularProgress,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Box,
} from "@mui/material";

export default function Profile() {
  const { user, categorias, tienda } = useLoaderData();
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  // 👇 Compara con el enum de Prisma
  const isAdminTienda = user?.rol === "ADMINTIENDA";

  const [selectedCategorias, setSelectedCategorias] = useState(
    tienda?.categorias?.map((c) => c.id) || []
  );

  // 👇 Debug - puedes quitar estos console.log después
  console.log("👤 User rol:", user?.rol);
  console.log("🔍 isAdminTienda:", isAdminTienda);
  console.log("🏪 Tienda:", tienda);

  return (
    <div className="p-4 flex justify-center">
      <Paper elevation={3} className="p-6 max-w-3xl w-full">
        <Typography variant="h5" className="font-bold mb-4">
          Mi Perfil
        </Typography>

        <fetcher.Form method="post">
          <input type="hidden" name="rol" value={user.rol} />

          {/* INFO PERSONAL */}
          <Typography variant="h6" className="font-semibold mb-2">
            Información Personal
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <TextField
              label="Nombre Completo"
              name="nombreCompleto"
              defaultValue={user.nombreCompleto}
              fullWidth
              required
            />

            <TextField
              label="Correo"
              name="email"
              type="email"
              defaultValue={user.email}
              fullWidth
            />

            <TextField
              label="Nueva Contraseña (opcional)"
              name="password"
              type="password"
              fullWidth
              helperText="Dejar en blanco para no cambiar"
            />
          </div>

          {/* DATOS DE TIENDA (solo AdminTienda) */}
          {isAdminTienda && tienda && (
            <>
              <Typography variant="h6" className="font-semibold mb-2 mt-4">
                Datos de la Tienda
              </Typography>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <TextField
                  label="Nombre de la tienda"
                  name="tiendaNombre"
                  defaultValue={tienda.nombre}
                  fullWidth
                  required
                />

                <TextField
                  label="Teléfono"
                  name="tiendaTelefono"
                  defaultValue={tienda.telefono || ""}
                  fullWidth
                />

                <TextField
                  label="Correo de contacto"
                  name="tiendaEmailContacto"
                  type="email"
                  defaultValue={tienda.emailContacto || ""}
                  fullWidth
                />

                <TextField
                  label="Dirección"
                  name="tiendaDireccion"
                  defaultValue={tienda.direccion || ""}
                  fullWidth
                />

                <TextField
                  label="Descripción"
                  name="tiendaDescripcion"
                  defaultValue={tienda.descripcion || ""}
                  fullWidth
                  multiline
                  rows={2}
                  className="md:col-span-2"
                />
              </div>

              {/* CATEGORÍAS */}
              <Typography variant="subtitle1" className="font-semibold mb-2">
                Categorías asignadas
              </Typography>

              <FormControl fullWidth className="mb-6">
                <InputLabel>Categorías</InputLabel>
                <Select
                  multiple
                  value={selectedCategorias}
                  onChange={(e) => setSelectedCategorias(e.target.value)}
                  renderValue={(selected) => (
                    <Box className="flex flex-wrap gap-1">
                      {selected.map((value) => {
                        const cat = categorias.find((c) => c.id === value);
                        return (
                          <Chip key={value} label={cat?.nombre} size="small" />
                        );
                      })}
                    </Box>
                  )}
                >
                  {categorias.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* 👇 INPUTS HIDDEN PARA ENVIAR LAS CATEGORÍAS */}
              {selectedCategorias.map((catId) => (
                <input
                  key={catId}
                  type="hidden"
                  name="categorias"
                  value={catId}
                />
              ))}
            </>
          )}

          {/* BOTÓN */}
          <div className="mt-4 flex justify-end">
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={18} color="inherit" />
                ) : null
              }
            >
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </fetcher.Form>
      </Paper>
    </div>
  );
}
