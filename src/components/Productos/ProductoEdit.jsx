import React from "react";
import { Form, useNavigate, useLoaderData, useActionData } from "react-router-dom";
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

const ProductoEdit = () => {
  const navigate = useNavigate();
  const producto = useLoaderData();
  const actionData = useActionData();

  return (
    <Paper className="p-6 rounded-xl shadow-md bg-white max-w-2xl mx-auto">
      <Typography variant="h4" className="text-green-700 font-bold mb-6">
        Editar Producto
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
          defaultValue={producto?.nombre || ""}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Descripción"
          name="descripcion"
          defaultValue={producto?.descripcion || ""}
          fullWidth
          margin="normal"
          multiline
          rows={3}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Unidad de Medida</InputLabel>
          <Select
            name="unidadMedida"
            defaultValue={producto?.unidadMedida || ""}
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
          defaultValue={producto?.precio != null ? String(producto.precio) : ""}
          fullWidth
          margin="normal"
          required
          type="number"
          inputProps={{ min: 0, step: "0.01" }}
        />

        <TextField
          label="Imagen (URL)"
          name="imagen"
          defaultValue={producto?.imagen || ""}
          fullWidth
          margin="normal"
        />

        <div className="flex justify-between mt-6 gap-2">
          <div>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => navigate("/productos")}
            >
              Cancelar
            </Button>
          </div>

          <div className="flex gap-2">
            <Form method="post" action={`/productos/${producto.id}/eliminar`}>
              <Button type="submit" variant="outlined" color="error">
                Eliminar
              </Button>
            </Form>

            <Button type="submit" variant="contained" color="success">
              Guardar cambios
            </Button>
          </div>
        </div>
      </Form>
    </Paper>
  );
};

export default ProductoEdit;