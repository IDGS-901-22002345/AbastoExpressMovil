import React, { useState, useEffect } from "react";
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  DialogContentText,
  Box,
  Grid,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { DataGrid } from "@mui/x-data-grid";
import { useLoaderData, useFetcher } from "react-router-dom";

const UNIDADES_MEDIDA = ["KILO", "LITRO", "PIEZA", "CAJA", "TONELADA"];

const Producto = () => {
  const loaderData = useLoaderData();
  const productosIniciales = loaderData?.producto?.productos || [];
  const categorias = loaderData?.producto?.categorias || [];

  const isMobile = useMediaQuery("(max-width:768px)");
  const fetcher = useFetcher();

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [productoToDelete, setProductoToDelete] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState("all");
  const [productosFiltrados, setProductosFiltrados] =
    useState(productosIniciales);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    unidadMedida: "",
    categoriaId: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    let filtered = productosIniciales;

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (producto) =>
          producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (producto.descripcion &&
            producto.descripcion
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategoria !== "all") {
      filtered = filtered.filter(
        (producto) => producto.categoriaId === parseInt(selectedCategoria)
      );
    }

    const sortedAndFiltered = [...filtered].sort((a, b) =>
      a.nombre.localeCompare(b.nombre)
    );

    setProductosFiltrados(sortedAndFiltered);
  }, [searchTerm, selectedCategoria, productosIniciales]);

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      precio: "",
      unidadMedida: "",
      categoriaId: "",
    });
    setImageFile(null);
    setImagePreview(null);
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
      unidadMedida: producto.unidadMedida || "",
      categoriaId: producto.categoriaId || "",
    });
    setImagePreview(producto.imagen);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedProducto(null);
    resetForm();
  };

  const handleOpenDelete = (producto) => {
    setProductoToDelete(producto);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setProductoToDelete(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleCreate = (e) => {
    e.preventDefault();

    console.log("=== ESTADO DEL FORMULARIO ===");
    console.log("formData:", formData);

    const data = new FormData();
    data.append("nombre", formData.nombre);
    data.append("descripcion", formData.descripcion);
    data.append("precio", formData.precio);

    if (formData.unidadMedida) {
      data.append("unidadMedida", formData.unidadMedida);
    }

    if (formData.categoriaId && formData.categoriaId !== "") {
      data.append("categoriaId", formData.categoriaId.toString());
      console.log("✅ categoriaId agregado:", formData.categoriaId);
    } else {
      console.log("⚠️ categoriaId está vacío");
    }

    if (imageFile) {
      data.append("imagen", imageFile);
      console.log("✅ Imagen agregada:", imageFile.name);
    } else {
      console.log("⚠️ No hay imagen");
    }

    console.log("=== FORMDATA A ENVIAR ===");
    for (let [key, value] of data.entries()) {
      console.log(key, ":", value);
    }

    fetcher.submit(data, {
      method: "post",
      action: "/productos/crear",
      encType: "multipart/form-data",
    });

    handleCloseCreate();
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("nombre", formData.nombre);
    data.append("descripcion", formData.descripcion);
    data.append("precio", formData.precio);

    if (formData.unidadMedida) {
      data.append("unidadMedida", formData.unidadMedida);
    }

    if (formData.categoriaId !== undefined) {
      data.append("categoriaId", formData.categoriaId.toString());
    }

    if (imageFile) {
      data.append("imagen", imageFile);
    }

    if (!imagePreview && !imageFile) {
      data.append("eliminarImagen", "true");
    }

    console.log("=== FORMDATA UPDATE ===");
    for (let [key, value] of data.entries()) {
      console.log(key, ":", value);
    }

    fetcher.submit(data, {
      method: "post",
      action: `/productos/${selectedProducto.id}/editar`,
      encType: "multipart/form-data",
    });

    handleCloseEdit();
  };

  const handleConfirmDelete = () => {
    if (productoToDelete) {
      fetcher.submit(null, {
        method: "post",
        action: `/productos/${productoToDelete.id}/eliminar`,
      });
      handleCloseDelete();
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
          <Avatar
            src={params.value}
            alt={params.row.nombre}
            variant="rounded"
          />
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
      field: "categoria",
      headerName: "Categoría",
      flex: 0.8,
      headerClassName: "header-green",
      renderCell: (params) => params.row.categoria?.nombre || "Sin categoría",
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
            onClick={() => handleOpenDelete(params.row)}
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
        {/* Header con título y botones de acción */}
        <Box className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <Typography variant="h4" className="text-green-700 font-bold">
            Productos
          </Typography>

          <Box className="flex gap-2">
            <Button
              variant="contained"
              color="success"
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
              size={isMobile ? "small" : "medium"}
            >
              Agregar
            </Button>

            <IconButton
              color="primary"
              onClick={() => window.location.reload()}
              title="Actualizar"
              size={isMobile ? "small" : "medium"}
            >
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Barra de búsqueda y filtros reorganizada */}
        <Box className="mb-6 bg-gray-50 p-4 rounded-lg">
          <Grid container spacing={2}>
            {/* Búsqueda - Ocupa más espacio */}
            <Grid item xs={12} md={8}>
              <TextField
                label="Buscar productos"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: <SearchIcon className="mr-2 text-gray-400" />,
                }}
                placeholder="Nombre o descripción..."
              />
            </Grid>

            {/* Filtro de categoría */}
            <Grid item xs={12} md={4}>
              <FormControl size="small" fullWidth>
                <InputLabel>
                  <Box className="flex items-center gap-1">
                    <FilterListIcon fontSize="small" />
                    Categoría
                  </Box>
                </InputLabel>
                <Select
                  value={selectedCategoria}
                  onChange={(e) => setSelectedCategoria(e.target.value)}
                  label="Categoría"
                >
                  <MenuItem value="all">Todas las categorías</MenuItem>
                  {categorias?.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Indicador de filtros activos y contador */}
          <Box className="mt-3 flex items-center justify-between flex-wrap gap-2">
            <Box className="flex items-center gap-2 flex-wrap">
              {(searchTerm || selectedCategoria !== "all") && (
                <>
                  <Typography variant="caption" className="text-gray-600">
                    Filtros activos:
                  </Typography>
                  {searchTerm && (
                    <Chip
                      label={`Búsqueda: "${searchTerm}"`}
                      size="small"
                      onDelete={() => setSearchTerm("")}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {selectedCategoria !== "all" && (
                    <Chip
                      label={`Categoría: ${
                        categorias?.find(
                          (c) => c.id === parseInt(selectedCategoria)
                        )?.nombre || ""
                      }`}
                      size="small"
                      onDelete={() => setSelectedCategoria("all")}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </>
              )}
            </Box>

            <Typography variant="body2" className="text-gray-600">
              <strong>{productosFiltrados.length}</strong> de{" "}
              <strong>{productosIniciales?.length || 0}</strong> productos
            </Typography>
          </Box>
        </Box>

        <div style={{ height: isMobile ? 400 : 500, width: "100%" }}>
          <DataGrid
            rows={productosFiltrados}
            columns={columns}
            pageSizeOptions={[5, 10, 20, 50]}
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

      {/* Dialog Crear */}
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
              <InputLabel>Categoría</InputLabel>
              <Select
                name="categoriaId"
                value={formData.categoriaId}
                onChange={handleInputChange}
                label="Categoría"
              >
                <MenuItem value="">
                  <em>Sin categoría</em>
                </MenuItem>
                {categorias?.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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

            <Box className="mt-4">
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                fullWidth
              >
                Subir Imagen
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>

              {imagePreview && (
                <Box className="mt-2 relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: "100%",
                      maxHeight: "200px",
                      objectFit: "contain",
                      borderRadius: "8px",
                    }}
                  />
                  <IconButton
                    onClick={handleRemoveImage}
                    size="small"
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "white",
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
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

      {/* Dialog Editar */}
      <Dialog open={openEdit} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
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
              <InputLabel>Categoría</InputLabel>
              <Select
                name="categoriaId"
                value={formData.categoriaId}
                onChange={handleInputChange}
                label="Categoría"
              >
                <MenuItem value="">
                  <em>Sin categoría</em>
                </MenuItem>
                {categorias?.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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

            <Box className="mt-4">
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                fullWidth
              >
                {imagePreview ? "Cambiar Imagen" : "Subir Imagen"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>

              {imagePreview && (
                <Box className="mt-2 relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: "100%",
                      maxHeight: "200px",
                      objectFit: "contain",
                      borderRadius: "8px",
                    }}
                  />
                  <IconButton
                    onClick={handleRemoveImage}
                    size="small"
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "white",
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
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

      {/* Dialog Eliminar */}
      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle className="flex items-center gap-2 text-red-600">
          <WarningAmberIcon />
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar el producto{" "}
            <strong>"{productoToDelete?.nombre}"</strong>?
          </DialogContentText>
          <DialogContentText className="mt-2 text-gray-600">
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={handleCloseDelete} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            autoFocus
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Producto;
