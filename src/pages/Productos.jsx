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
  Avatar,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import { DataGrid } from "@mui/x-data-grid";
import { useLoaderData, useFetcher } from "react-router-dom";

const UNIDADES_MEDIDA = ["KILO", "LITRO", "PIEZA", "CAJA", "TONELADA"];

const Producto = () => {
  const productos = useLoaderData();
  const isMobile = useMediaQuery("(max-width:768px)");
  const fetcher = useFetcher();

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imagen: "",
    unidadMedida: "",
  });

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      precio: "",
      imagen: "",
      unidadMedida: "",
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

  const handleOpenEdit = (producto) => {
    setSelectedProducto(producto);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion || "",
      precio: producto.precio.toString(),
      imagen: producto.imagen || "",
      unidadMedida: producto.unidadMedida || "",
    });
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedProducto(null);
    resetForm();
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
    fetcher.submit(formData, { method: "post", action: "/productos/crear" });
    handleCloseCreate();
  };

  // Actualizar producto
  const handleUpdate = (e) => {
    e.preventDefault();
    fetcher.submit(formData, {
      method: "post",
      action: `/productos/${selectedProducto.id}/editar`,
    });
    handleCloseEdit();
  };

  // Eliminar producto
  const handleDelete = (id, nombre) => {
    if (window.confirm(`¿Estás seguro de eliminar el producto "${nombre}"?`)) {
      fetcher.submit(null, {
        method: "post",
        action: `/productos/${id}/eliminar`,
      });
    }
  };

  const columns = [
    {
      field: "imagen",
      headerName: "Imagen",
      width: 80,
      headerClassName: "header-green",
      renderCell: (params) =>
        params.value ? (
          <Avatar src={params.value} alt={params.row.nombre} variant="rounded" />
        ) : (
          <Avatar variant="rounded">
            <ImageIcon />
          </Avatar>
        ),
    },
    {
      field: "nombre",
      headerName: "Nombre",
      flex: 1,
      headerClassName: "header-green",
    },
    {
      field: "descripcion",
      headerName: "Descripción",
      flex: 1.5,
      headerClassName: "header-green",
      renderCell: (params) => params.value || "Sin descripción",
    },
    {
      field: "unidadMedida",
      headerName: "Unidad",
      flex: 0.5,
      headerClassName: "header-green",
      renderCell: (params) => params.value || "-",
    },
    {
      field: "precio",
      headerName: "Precio",
      flex: 0.6,
      headerClassName: "header-green",
      renderCell: (params) => `$${parseFloat(params.value).toFixed(2)}`,
    },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 0.6,
      sortable: false,
      filterable: false,
      headerClassName: "header-green",
      renderCell: (params) => (
        <div className="flex gap-1">
          <IconButton
            color="primary"
            size="small"
            onClick={() => handleOpenEdit(params.row)}
            title="Editar"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.id, params.row.nombre)}
            title="Eliminar"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <>
      <Paper className="p-4 md:p-6 rounded-xl shadow-md bg-white">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-2 md:gap-0">
          <Typography variant="h4" className="text-green-700 font-bold">
            Productos
          </Typography>
          <div className="flex gap-2">
            <Button
              variant="contained"
              color="success"
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
            >
              Agregar
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
            rows={productos || []}
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

      {/* Modal Crear Producto */}
      <Dialog
        open={openCreate}
        onClose={handleCloseCreate}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="text-green-700 font-bold">
          Crear Producto
        </DialogTitle>
        <form onSubmit={handleCreate}>
          <DialogContent>
            <TextField
              label="Nombre del producto"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
              placeholder="Ej: Manzana Roja"
            />

            <TextField
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              multiline
              rows={3}
              placeholder="Descripción del producto (opcional)"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Unidad de Medida</InputLabel>
              <Select
                name="unidadMedida"
                value={formData.unidadMedida}
                onChange={handleInputChange}
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
              type="number"
              value={formData.precio}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
              inputProps={{ min: "0", step: "0.01" }}
              placeholder="0.00"
            />

            <TextField
              label="URL de la imagen"
              name="imagen"
              value={formData.imagen}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              placeholder="https://ejemplo.com/imagen.jpg (opcional)"
            />
          </DialogContent>
          <DialogActions className="p-4">
            <Button onClick={handleCloseCreate} color="inherit">
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="success">
              Crear
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Modal Editar Producto */}
      <Dialog
        open={openEdit}
        onClose={handleCloseEdit}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="text-green-700 font-bold">
          Editar Producto
        </DialogTitle>
        <form onSubmit={handleUpdate}>
          <DialogContent>
            <TextField
              label="Nombre del producto"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              multiline
              rows={3}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Unidad de Medida</InputLabel>
              <Select
                name="unidadMedida"
                value={formData.unidadMedida}
                onChange={handleInputChange}
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
              type="number"
              value={formData.precio}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              inputProps={{ min: "0", step: "0.01" }}
            />

            <TextField
              label="URL de la imagen"
              name="imagen"
              value={formData.imagen}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions className="p-4">
            <Button onClick={handleCloseEdit} color="inherit">
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="success">
              Guardar Cambios
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default Producto;