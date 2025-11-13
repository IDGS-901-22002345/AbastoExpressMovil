import React, { useState } from "react";
import {
  Button,
  IconButton,
  Typography,
  Paper,
  useMediaQuery,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";
import { useLoaderData, useFetcher } from "react-router-dom";

const Empleado = () => {
  const empleados = useLoaderData();
  const isMobile = useMediaQuery("(max-width:768px)");
  const fetcher = useFetcher();

  // Estados para modales
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Estados para formularios
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    email: "",
    password: "",
    rol: "",
  });

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      nombreCompleto: "",
      email: "",
      password: "",
      rol: "",
    });
    setShowPassword(false);
  };

  // Abrir modal de crear
  const handleOpenCreate = () => {
    resetForm();
    setOpenCreate(true);
  };

  // Cerrar modal de crear
  const handleCloseCreate = () => {
    setOpenCreate(false);
    resetForm();
  };

  // Abrir modal de editar
  const handleOpenEdit = (empleado) => {
    setSelectedEmpleado(empleado);
    setFormData({
      nombreCompleto: empleado.nombreCompleto,
      email: empleado.email,
      password: "",
      rol: empleado.rol,
    });
    setShowPassword(false);
    setOpenEdit(true);
  };

  // Cerrar modal de editar
  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedEmpleado(null);
    resetForm();
  };

  // Manejar cambios en inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Crear empleado
  const handleCreate = (e) => {
    e.preventDefault();
    fetcher.submit(formData, { method: "post", action: "/empleados/crear" });
    handleCloseCreate();
  };

  // Actualizar empleado
  const handleUpdate = (e) => {
    e.preventDefault();
    const updateData = {
      nombreCompleto: formData.nombreCompleto,
      email: formData.email,
      rol: formData.rol,
    };
    // Solo incluir password si se cambió
    if (formData.password) {
      updateData.password = formData.password;
    }
    fetcher.submit(updateData, {
      method: "post",
      action: `/empleados/${selectedEmpleado.id}/editar`,
    });
    handleCloseEdit();
  };

  // Eliminar empleado
  const handleDelete = (id, nombre) => {
    if (window.confirm(`¿Estás seguro de eliminar a ${nombre}?`)) {
      fetcher.submit(null, {
        method: "post",
        action: `/empleados/${id}/eliminar`,
      });
    }
  };

  const columns = [
    {
      field: "nombreCompleto",
      headerName: "Nombre Completo",
      flex: 1,
      headerClassName: "header-green",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      headerClassName: "header-green",
    },
    {
      field: "rol",
      headerName: "Rol",
      flex: 0.7,
      headerClassName: "header-green",
      renderCell: (params) => (
        <Chip
          label={params.value === "ADMINTIENDA" ? "Admin Tienda" : "Empleado"}
          color={params.value === "ADMINTIENDA" ? "primary" : "default"}
          size="small"
        />
      ),
    },
    {
      field: "lastLogin",
      headerName: "Último Login",
      flex: 0.8,
      headerClassName: "header-green",
      renderCell: (params) =>
        params.value
          ? new Date(params.value).toLocaleDateString("es-MX", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "Nunca",
    },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 0.8,
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
            onClick={() =>
              handleDelete(params.row.id, params.row.nombreCompleto)
            }
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
            Empleados
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

        {/* Mostrar mensaje de error si existe */}
        {fetcher.data?.error && (
          <Alert severity="error" className="mb-4">
            {fetcher.data.error}
          </Alert>
        )}

        {/* Tabla */}
        <div style={{ height: isMobile ? 400 : 500, width: "100%" }}>
          <DataGrid
            rows={empleados || []}
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

      {/* Modal Crear Empleado */}
      <Dialog
        open={openCreate}
        onClose={handleCloseCreate}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="text-green-700 font-bold">
          Crear Empleado
        </DialogTitle>
        <form onSubmit={handleCreate}>
          <DialogContent>
            <TextField
              label="Nombre completo"
              name="nombreCompleto"
              value={formData.nombreCompleto}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
              placeholder="Ej: Juan Pérez García"
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
              placeholder="empleado@ejemplo.com"
            />

            <TextField
              label="Contraseña"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
              helperText="Mínimo 6 caracteres"
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel id="rol-create-label">Rol</InputLabel>
              <Select
                labelId="rol-create-label"
                name="rol"
                value={formData.rol}
                onChange={handleInputChange}
                label="Rol"
              >
                <MenuItem value="EMPLEADO">Empleado</MenuItem>
                <MenuItem value="ADMINTIENDA">Admin Tienda</MenuItem>
              </Select>
            </FormControl>
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

      {/* Modal Editar Empleado */}
      <Dialog
        open={openEdit}
        onClose={handleCloseEdit}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="text-green-700 font-bold">
          Editar Empleado
        </DialogTitle>
        <form onSubmit={handleUpdate}>
          <DialogContent>
            <TextField
              label="Nombre completo"
              name="nombreCompleto"
              value={formData.nombreCompleto}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />

            {!showPassword ? (
              <Button
                variant="text"
                color="primary"
                onClick={() => setShowPassword(true)}
                className="mt-2"
              >
                Cambiar contraseña
              </Button>
            ) : (
              <TextField
                label="Nueva contraseña"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                helperText="Dejar vacío para mantener la contraseña actual"
              />
            )}

            <FormControl fullWidth margin="normal">
              <InputLabel id="rol-edit-label">Rol</InputLabel>
              <Select
                labelId="rol-edit-label"
                name="rol"
                value={formData.rol}
                onChange={handleInputChange}
                label="Rol"
              >
                <MenuItem value="EMPLEADO">Empleado</MenuItem>
                <MenuItem value="ADMINTIENDA">Admin Tienda</MenuItem>
              </Select>
            </FormControl>
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

export default Empleado;