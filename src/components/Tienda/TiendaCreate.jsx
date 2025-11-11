import React, { useState, useEffect } from "react";
import { Form, useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
} from "@mui/material";

const TiendaCreate = () => {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [selectedCategorias, setSelectedCategorias] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/categoria`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Error al obtener categorías:", res.status);
          return;
        }

        const data = await res.json();
        if (data.status === "success") {
          setCategorias(data.data);
        } else {
          console.error("Error al obtener categorías");
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      }
    };
    fetchCategorias();
  }, []);

  const handleChangeCategorias = (event) => {
    setSelectedCategorias(event.target.value);
  };

  return (
    <Paper className="p-6 rounded-xl shadow-md bg-white">
      <Typography variant="h4" className="text-green-700 font-bold mb-6">
        Crear Tienda
      </Typography>

      <Form method="post">
        <Grid container spacing={4}>
          {/* DATOS DE LA TIENDA */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" className="mb-2 font-semibold">
              Datos de la tienda
            </Typography>
            <Divider className="mb-4" />

            <TextField label="Nombre" name="nombre" fullWidth margin="normal" required />
            <TextField label="Descripción" name="descripcion" fullWidth margin="normal" />
            <TextField label="Dirección" name="direccion" fullWidth margin="normal" required />
            <TextField label="Teléfono" name="telefono" fullWidth margin="normal" type="tel" />
            <TextField label="Email de contacto" name="emailContacto" fullWidth margin="normal" type="email" />
            <TextField label="Logo URL" name="logoUrl" fullWidth margin="normal" />

            <FormControl fullWidth margin="normal">
              <InputLabel id="categorias-label">Categorías</InputLabel>
              <Select
                labelId="categorias-label"
                name="categorias"
                multiple
                value={selectedCategorias}
                onChange={handleChangeCategorias}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={categorias.find((c) => c.id === value)?.nombre || value}
                      />
                    ))}
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

            {selectedCategorias.map((catId) => (
              <input
                key={catId}
                type="hidden"
                name="categorias[]"
                value={catId}
              />
            ))}
          </Grid>

          {/* DATOS DEL ADMIN */}
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

        {/* BOTONES */}
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