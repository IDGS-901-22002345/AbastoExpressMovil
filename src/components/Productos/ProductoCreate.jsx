import React from "react";
import { Form, useNavigate, useActionData } from "react-router-dom";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const UNIDADES_MEDIDA = ["KILO", "LITRO", "PIEZA", "CAJA", "TONELADA"];

const ProductoCreate = () => {
  const navigate = useNavigate();
  const actionData = useActionData();

  return (
    <Paper className="p-6 rounded-xl shadow-md bg-white max-w-2xl mx-auto">
      <Typography variant="h4" className="text-green-700 font-bold mb-6">
        Crear Producto
      </Typography>

      {actionData?.error && (
        <Alert severity="error" className="mb-4">
          {actionData.error}
        </Alert>
      )}

      <Form method="post">
        <TextField
          label="Nombre"
          name="nombre"
          fullWidth
          margin="normal"
          required
          placeholder="Ej: iPhone 16 Pro Max"
        />

        <TextField
          label="Descripción"
          name="descripcion"
          fullWidth
          margin="normal"
          required
          multiline
          rows={3}
          placeholder="Describe brevemente el producto"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Unidad de Medida</InputLabel>
          <Select
            name="unidadMedida"
            defaultValue=""
            label="Unidad de Medida"
          >
            <MenuItem value="">
              <em>Ninguna</em>
            </MenuItem>
            {UNIDADES_MEDIDA.map((unidad) => (
              <MenuItem key={unidad} value={unidad}>
                {unidad}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Precio"
          name="precio"
          fullWidth
          margin="normal"
          required
          type="number"
          inputProps={{ min: 0, step: "0.01" }}
          placeholder="Ej: 25999.99"
        />

        <TextField
          label="Imagen (URL)"
          name="imagen"
          fullWidth
          margin="normal"
          placeholder="https://ejemplo.com/imagen.jpg"
        />

        <div className="flex justify-end mt-6 gap-2">
          <Button type="submit" variant="contained" color="success">
            Crear Producto
          </Button>
          <Button
            type="button"
            variant="outlined"
            color="primary"
            onClick={() => navigate("/productos")}
          >
            Cancelar
          </Button>
        </div>
      </Form>
    </Paper>
  );
};

export default ProductoCreate;