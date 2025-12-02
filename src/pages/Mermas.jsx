import React, { useState } from "react";
import {
  Button,
  IconButton,
  Typography,
  Paper,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Autocomplete,
  Avatar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import ReportProblemIcon from "@mui/icons-material/ReportProblem"; // Icono para Merma
import { DataGrid } from "@mui/x-data-grid";
import { useLoaderData, useFetcher } from "react-router-dom";

// Mapeo de los motivos del backend a textos legibles
const MOTIVOS = [
  { value: "CADUCIDAD", label: "Caducidad" },
  { value: "DANO_ALMACEN", label: "Daño en Almacén" },
  { value: "ROBO", label: "Robo" },
  { value: "DEFECTO_FABRICA", label: "Defecto de Fábrica" },
  { value: "OTRO", label: "Otro" },
];

const Mermas = () => {
  const { mermas, productos } = useLoaderData();
  const isMobile = useMediaQuery("(max-width:768px)");
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  const [openCreate, setOpenCreate] = useState(false);
  const [formData, setFormData] = useState({
    productoId: null,
    cantidad: "",
    motivo: "",
    nota: "",
  });

  const resetForm = () => {
    setFormData({
      productoId: null,
      cantidad: "",
      motivo: "",
      nota: "",
    });
  };

  const handleOpenCreate = () => {
    resetForm();
    setOpenCreate(true);
  };

  const handleCloseCreate = () => {
    setOpenCreate(false);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = (e) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append("productoId", formData.productoId?.id || "");
    submitData.append("cantidad", formData.cantidad);
    submitData.append("motivo", formData.motivo);
    if (formData.nota) submitData.append("nota", formData.nota);

    fetcher.submit(submitData, { method: "post", action: "/mermas" });
    
    // Cerramos el modal inmediatamente, el toast manejará el éxito/error
    handleCloseCreate();
  };

  // Definición de columnas para el DataGrid
  const columns = [
    {
      field: "fecha",
      headerName: "Fecha",
      flex: 0.8,
      headerClassName: "header-green",
      renderCell: (params) =>
        new Date(params.value).toLocaleString("es-MX", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      field: "producto",
      headerName: "Producto",
      flex: 1.2,
      headerClassName: "header-green",
      renderCell: (params) => (
        <div className="flex items-center gap-2">
           {params.row.producto?.imagen && (
            <Avatar src={params.row.producto.imagen} sx={{ width: 24, height: 24 }} variant="rounded" />
          )} 
          <span>{params.row.producto?.nombre || "N/A"}</span>
        </div>
      ),
    },
    {
      field: "cantidad",
      headerName: "Cant.",
      flex: 0.4,
      headerClassName: "header-green",
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <span className="font-bold text-red-700">-{params.value}</span>
      ),
    },
    {
      field: "motivo",
      headerName: "Motivo",
      flex: 0.8,
      headerClassName: "header-green",
      renderCell: (params) => {
        const motivo = MOTIVOS.find((m) => m.value === params.value);
        return (
          <Chip
            label={motivo ? motivo.label : params.value}
            color="error" // Rojo para indicar pérdida
            variant="outlined"
            size="small"
          />
        );
      },
    },
    {
      field: "empleado",
      headerName: "Registrado por",
      flex: 1,
      headerClassName: "header-green",
      renderCell: (params) => params.row.empleado?.nombreCompleto || "N/A",
    },
    {
        field: "nota",
        headerName: "Nota",
        flex: 1,
        headerClassName: "header-green",
    }
  ];

  return (
    <>
      <Paper className="p-4 md:p-6 rounded-xl shadow-md bg-white">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-2 md:gap-0">
          <div className="flex items-center gap-2">
            <ReportProblemIcon className="text-red-600 text-3xl" />
            <Typography variant="h4" className="text-green-700 font-bold">
              Control de Mermas
            </Typography>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="contained"
              color="error" // Botón rojo para mermas
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
            >
              Registrar Merma
            </Button>
            <IconButton
              color="primary"
              onClick={() => window.location.reload()}
              title="Actualizar"
            >
              <RefreshIcon />
            </IconButton>
          </div>
        </div>

        {/* Tabla */}
        <div style={{ height: isMobile ? 400 : 500, width: "100%" }}>
          <DataGrid
            rows={mermas || []}
            columns={columns}
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
            }}
            getRowId={(row) => row.id}
            sx={{
              "& .header-green": {
                backgroundColor: "#15803d",
                color: "#fff",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#fef2f2", // Fondo rojo muy suave al hover
              },
            }}
            autoHeight={isMobile}
            density={isMobile ? "compact" : "standard"}
          />
        </div>
      </Paper>

      {/* Modal Crear Merma */}
      <Dialog open={openCreate} onClose={handleCloseCreate} maxWidth="sm" fullWidth>
        <DialogTitle className="text-red-700 font-bold">
          Registrar Nueva Merma
        </DialogTitle>
        <form onSubmit={handleCreate}>
          <DialogContent>
            <Typography variant="body2" className="mb-4 text-gray-500">
              Registrar una merma descontará inmediatamente el stock del inventario.
            </Typography>

            {/* Selector de Producto con Buscador */}
            <Autocomplete
              options={productos || []}
              getOptionLabel={(option) => option?.nombre || ""}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              value={formData.productoId}
              onChange={(event, newValue) => {
                setFormData((prev) => ({ ...prev, productoId: newValue }));
              }}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {option.nombre}
                  {option.inventario?.stockActual !== undefined && (
                    <span className="text-gray-500 text-xs ml-2">
                      (Stock: {option.inventario.stockActual})
                    </span>
                  )}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Producto"
                  margin="normal"
                  required
                  placeholder="Buscar producto..."
                  helperText={
                    formData.productoId?.inventario?.stockActual !== undefined
                      ? `Stock disponible: ${formData.productoId.inventario.stockActual}`
                      : "Selecciona un producto"
                  }
                />
              )}
              noOptionsText="No se encontraron productos"
              fullWidth
            />

            <div className="flex gap-4">
                <TextField
                label="Cantidad"
                name="cantidad"
                type="number"
                value={formData.cantidad}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
                inputProps={{ min: "1", step: "1" }}
                />
                
                <FormControl fullWidth margin="normal" required>
                <InputLabel>Motivo</InputLabel>
                <Select
                    name="motivo"
                    value={formData.motivo}
                    onChange={handleInputChange}
                    label="Motivo"
                >
                    {MOTIVOS.map((m) => (
                    <MenuItem key={m.value} value={m.value}>
                        {m.label}
                    </MenuItem>
                    ))}
                </Select>
                </FormControl>
            </div>

            <TextField
              label="Nota / Observaciones"
              name="nota"
              value={formData.nota}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              multiline
              rows={2}
              placeholder="Detalle adicional (opcional)"
            />

          </DialogContent>
          <DialogActions className="p-4">
            <Button onClick={handleCloseCreate} color="inherit">
              Cancelar
            </Button>
            <Button 
                type="submit" 
                variant="contained" 
                color="error"
                disabled={isSubmitting}
            >
              {isSubmitting ? "Registrando..." : "Confirmar Merma"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default Mermas;