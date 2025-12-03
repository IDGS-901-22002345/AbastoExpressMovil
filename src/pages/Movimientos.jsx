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
  Alert,
  Autocomplete,
} from "@mui/material";
// Cambiamos el ícono de Add por uno de Ajustes/Edit para diferenciarlo
import EditNoteIcon from "@mui/icons-material/EditNote"; 
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DataGrid } from "@mui/x-data-grid";
import { useLoaderData, useFetcher } from "react-router-dom";

// Opcional: Podrías limitar esto en el backend o aquí, pero ENTRADA/SALIDA funcionan bien para ajustes
const TIPOS_MOVIMIENTO = ["ENTRADA", "SALIDA"];

const Movimientos = () => {
  const loaderData = useLoaderData();
  const movimientos = loaderData?.movimientos || [];
  const productos = loaderData?.productos || [];
  const isMobile = useMediaQuery("(max-width:768px)");
  const fetcher = useFetcher();

  const [openCreate, setOpenCreate] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedMovimiento, setSelectedMovimiento] = useState(null);

  const [formData, setFormData] = useState({
    productoId: null,
    tipo: "",
    cantidad: "",
    razon: "",
  });

  const resetForm = () => {
    setFormData({
      productoId: null,
      tipo: "",
      cantidad: "",
      razon: "",
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

  const handleOpenDetail = (movimiento) => {
    setSelectedMovimiento(movimiento);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedMovimiento(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreate = (e) => {
    e.preventDefault();

    const submitFormData = new FormData();
    submitFormData.append(
      "productoId",
      formData.productoId?.id || formData.productoId
    );
    submitFormData.append("tipo", formData.tipo);
    submitFormData.append("cantidad", formData.cantidad);
    
    // Si no pone razón, ponemos una por defecto para identificar que fue manual
    const razonFinal = formData.razon || "Ajuste manual de inventario";
    submitFormData.append("razon", razonFinal);

    fetcher.submit(submitFormData, {
      method: "post",
      action: "/movimientos/crear",
    });
    handleCloseCreate();
  };

  const columns = [
    {
      field: "createdAt",
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
      renderCell: (params) => params.row.inventario?.producto?.nombre || "N/A",
    },
    {
      field: "tipo",
      headerName: "Tipo",
      flex: 0.6,
      headerClassName: "header-green",
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "ENTRADA" ? "success" : "error"}
          size="small"
        />
      ),
    },
    {
        field: "cantidad", // Agregamos la columna cantidad que faltaba visualmente
        headerName: "Cant.",
        flex: 0.4,
        headerClassName: "header-green",
        align: "center",
    },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 0.4,
      sortable: false,
      filterable: false,
      headerClassName: "header-green",
      renderCell: (params) => (
        <IconButton
          color="primary"
          size="small"
          onClick={() => handleOpenDetail(params.row)}
          title="Ver detalles"
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <Paper className="p-4 md:p-6 rounded-xl shadow-md bg-white">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-2 md:gap-0">
          <Typography variant="h4" className="text-green-700 font-bold">
            Historial de Movimientos
          </Typography>
          <div className="flex gap-2">
            {/* CAMBIO: Texto y Color del botón para denotar que es una acción especial */}
            <Button
              variant="outlined" 
              color="warning" // Color naranja/ámbar para indicar precaución/ajuste
              startIcon={<EditNoteIcon />}
              onClick={handleOpenCreate}
            >
              Ajuste Manual
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
            rows={movimientos || []}
            columns={columns}
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
              sorting: { sortModel: [{ field: 'createdAt', sort: 'desc' }] }, // Ordenar por fecha desc
            }}
            getRowId={(row) => row.id}
            sx={{
              "& .header-green": {
                backgroundColor: "#15803d",
                color: "#fff",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f0fdf4",
              },
              "& .MuiDataGrid-cell": {
                whiteSpace: "normal",
                wordWrap: "break-word",
              },
            }}
            autoHeight={isMobile}
            density={isMobile ? "compact" : "standard"}
          />
        </div>
      </Paper>

      {/* Modal Crear Movimiento (AJUSTE) */}
      <Dialog
        open={openCreate}
        onClose={handleCloseCreate}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="text-orange-700 font-bold flex items-center gap-2">
          <EditNoteIcon />
          Ajuste Manual de Inventario
        </DialogTitle>
        <form onSubmit={handleCreate}>
          <DialogContent>
            <Alert severity="info" className="mb-4">
              Usa esta opción solo para correcciones de inventario (conteo físico, errores). 
              Para compras usa el módulo de <strong>Compras</strong> y para pérdidas el de <strong>Mermas</strong>.
            </Alert>

            <Autocomplete
              options={productos || []}
              getOptionLabel={(option) => option?.nombre || ""}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              value={formData.productoId}
              onChange={(event, newValue) => {
                setFormData((prev) => ({
                  ...prev,
                  productoId: newValue,
                }));
              }}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {option.nombre}
                  {option.inventario?.stockActual !== undefined && (
                    <span className="text-gray-500 text-sm ml-2">
                      (Stock: {option.inventario.stockActual})
                    </span>
                  )}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Producto a Ajustar"
                  margin="normal"
                  required
                  placeholder="Buscar producto..."
                />
              )}
              noOptionsText="No hay productos disponibles"
              fullWidth
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Tipo de Ajuste</InputLabel>
              <Select
                name="tipo"
                value={formData.tipo}
                onChange={handleInputChange}
                label="Tipo de Ajuste"
              >
                <MenuItem value="ENTRADA">ENTRADA (Agregar stock)</MenuItem>
                <MenuItem value="SALIDA">SALIDA (Quitar stock)</MenuItem>
              </Select>
            </FormControl>

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
              placeholder="Ej: 5"
            />

            <TextField
              label="Motivo del Ajuste"
              name="razon"
              value={formData.razon}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
              multiline
              rows={2}
              placeholder="Ej: Error de conteo en inventario físico"
            />

          </DialogContent>
          <DialogActions className="p-4">
            <Button onClick={handleCloseCreate} color="inherit">
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="warning">
              Aplicar Ajuste
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Modal Detalle Movimiento (Sin cambios mayores, solo visual) */}
      <Dialog
        open={openDetail}
        onClose={handleCloseDetail}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="text-green-700 font-bold">
          Detalle del Movimiento
        </DialogTitle>
        <DialogContent>
          {selectedMovimiento && (
            <div className="space-y-4 pt-2">
              <div>
                <Typography variant="body2" color="text.secondary">
                  Fecha y Hora
                </Typography>
                <Typography variant="body1" className="font-semibold">
                  {new Date(selectedMovimiento.createdAt).toLocaleString(
                    "es-MX"
                  )}
                </Typography>
              </div>

              <div>
                <Typography variant="body2" color="text.secondary">
                  Producto
                </Typography>
                <Typography variant="body1" className="font-semibold">
                  {selectedMovimiento.inventario?.producto?.nombre || "N/A"}
                </Typography>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Typography variant="body2" color="text.secondary">
                    Tipo
                  </Typography>
                  <Chip
                    label={selectedMovimiento.tipo}
                    color={
                      selectedMovimiento.tipo === "ENTRADA"
                        ? "success"
                        : "error"
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Typography variant="body2" color="text.secondary">
                    Cantidad
                  </Typography>
                  <Typography variant="h6" className="font-bold">
                    {selectedMovimiento.cantidad}
                  </Typography>
                </div>
              </div>

              <div>
                <Typography variant="body2" color="text.secondary">
                  Razón / Referencia
                </Typography>
                <Paper variant="outlined" className="p-2 bg-gray-50 mt-1">
                    <Typography variant="body2">
                    {selectedMovimiento.razon || "Sin especificar"}
                    </Typography>
                </Paper>
              </div>

              <div>
                <Typography variant="body2" color="text.secondary">
                  Registrado por
                </Typography>
                <Typography variant="body1" className="font-semibold">
                  {selectedMovimiento.empleado?.nombreCompleto || "Sistema / Admin"}
                </Typography>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions className="p-4">
          <Button
            onClick={handleCloseDetail}
            variant="contained"
            color="primary"
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Movimientos;