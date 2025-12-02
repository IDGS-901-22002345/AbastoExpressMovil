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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Divider,
  DialogContentText,
  FormHelperText, // Importante para el mensaje de ayuda
  Tooltip, // Para mejorar UX en botones
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart"; // Icono para vaciar carrito
import { DataGrid } from "@mui/x-data-grid";
import { useLoaderData, useFetcher } from "react-router-dom";

const Compras = () => {
  const { compras, proveedores, productos } = useLoaderData();
  const isMobile = useMediaQuery("(max-width:768px)");
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  const [openCreate, setOpenCreate] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [compraIdToCancel, setCompraIdToCancel] = useState(null);

  const [carrito, setCarrito] = useState([]);
  const [proveedorId, setProveedorId] = useState("");
  
  const [tempProducto, setTempProducto] = useState(null);
  const [tempCantidad, setTempCantidad] = useState("");
  const [tempPrecio, setTempPrecio] = useState("");

  const agregarAlCarrito = () => {
    if (!tempProducto || !tempCantidad || !tempPrecio) return;

    const nuevoItem = {
      id: tempProducto.id,
      nombre: tempProducto.nombre,
      cantidad: parseInt(tempCantidad),
      precioCompra: parseFloat(tempPrecio),
      subtotal: parseInt(tempCantidad) * parseFloat(tempPrecio),
    };

    const existe = carrito.find((item) => item.id === nuevoItem.id);
    if (existe) {
      setCarrito(
        carrito.map((item) =>
          item.id === nuevoItem.id
            ? { ...item, cantidad: item.cantidad + nuevoItem.cantidad, subtotal: item.subtotal + nuevoItem.subtotal }
            : item
        )
      );
    } else {
      setCarrito([...carrito, nuevoItem]);
    }

    setTempProducto(null);
    setTempCantidad("");
    setTempPrecio("");
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter((item) => item.id !== id));
  };

  // Función para vaciar todo el carrito rápidamente
  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const totalCarrito = carrito.reduce((acc, item) => acc + item.subtotal, 0);

  const handleCreate = () => {
    if (!proveedorId || carrito.length === 0) return;

    const formData = new FormData();
    formData.append("intent", "create");
    formData.append("proveedorId", proveedorId);
    formData.append("productos", JSON.stringify(carrito));

    fetcher.submit(formData, { method: "post" });
    setOpenCreate(false);
    setCarrito([]);
    setProveedorId("");
  };

  const handleRequestCancel = (compraId) => {
    setCompraIdToCancel(compraId);
    setOpenConfirmDialog(true);
  };

  const handleConfirmCancel = () => {
    if (!compraIdToCancel) return;

    const formData = new FormData();
    formData.append("intent", "cancel");
    formData.append("compraId", compraIdToCancel);
    
    fetcher.submit(formData, { method: "post" });
    
    setOpenConfirmDialog(false);
    setOpenDetail(false);
    setCompraIdToCancel(null);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70, headerClassName: "header-green" },
    {
      field: "fecha",
      headerName: "Fecha",
      flex: 1,
      headerClassName: "header-green",
      renderCell: (params) => new Date(params.row.createdAt).toLocaleString("es-MX"),
    },
    {
      field: "proveedor",
      headerName: "Proveedor",
      flex: 1,
      headerClassName: "header-green",
      renderCell: (params) => params.row.proveedor?.nombreEmpresa || "N/A",
    },
    {
      field: "empleado",
      headerName: "Registrado por",
      flex: 1,
      headerClassName: "header-green",
      renderCell: (params) => params.row.empleado?.nombreCompleto || "N/A",
    },
    {
      field: "total",
      headerName: "Total",
      flex: 0.8,
      headerClassName: "header-green",
      renderCell: (params) => (
        <span className="font-bold text-green-800">
          ${parseFloat(params.row.total).toFixed(2)}
        </span>
      ),
    },
    {
      field: "estatus",
      headerName: "Estatus",
      flex: 0.8,
      headerClassName: "header-green",
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "COMPLETADO" ? "success" : "error"}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: "acciones",
      headerName: "Ver",
      width: 80,
      sortable: false,
      headerClassName: "header-green",
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => {
            setSelectedCompra(params.row);
            setOpenDetail(true);
          }}
        >
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <Paper className="p-4 md:p-6 rounded-xl shadow-md bg-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-2">
            <ShoppingCartIcon className="text-green-700 text-3xl" />
            <Typography variant="h4" className="text-green-700 font-bold">
              Compras a Proveedores
            </Typography>
          </div>
          <div className="flex gap-2">
            <Button
              variant="contained"
              color="success"
              startIcon={<AddIcon />}
              onClick={() => setOpenCreate(true)}
            >
              Nueva Compra
            </Button>
            <IconButton color="primary" onClick={() => window.location.reload()}>
              <RefreshIcon />
            </IconButton>
          </div>
        </div>

        <div style={{ height: isMobile ? 400 : 500, width: "100%" }}>
          <DataGrid
            rows={compras || []}
            columns={columns}
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
              sorting: { sortModel: [{ field: 'id', sort: 'desc' }] },
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
            }}
            autoHeight={isMobile}
            density="compact"
          />
        </div>
      </Paper>

      {/* --- MODAL CREAR COMPRA (CARRITO) --- */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="md" fullWidth>
        <DialogTitle className="bg-green-700 text-white font-bold">
          Registrar Entrada de Mercancía
        </DialogTitle>
        <DialogContent className="mt-4">
          <Box className="mt-4 mb-6">
            <FormControl fullWidth size="small" error={carrito.length > 0}>
              <InputLabel>Seleccionar Proveedor</InputLabel>
              <Select
                value={proveedorId}
                label="Seleccionar Proveedor"
                onChange={(e) => setProveedorId(e.target.value)}
                disabled={carrito.length > 0} // Bloqueado si hay items
              >
                {proveedores.map((prov) => (
                  <MenuItem key={prov.id} value={prov.id}>
                    {prov.nombreEmpresa}
                  </MenuItem>
                ))}
              </Select>
              {/* Mensaje de ayuda si está bloqueado */}
              {carrito.length > 0 && (
                <FormHelperText>
                  Para cambiar de proveedor, primero debes vaciar el carrito.
                </FormHelperText>
              )}
            </FormControl>
          </Box>

          <Divider className="mb-4">Agregar Productos</Divider>

          <div className="flex flex-col md:flex-row gap-3 items-end mb-4">
            <Autocomplete
              options={productos}
              getOptionLabel={(option) => option.nombre}
              value={tempProducto}
              onChange={(_, newValue) => setTempProducto(newValue)}
              fullWidth
              renderInput={(params) => <TextField {...params} label="Producto" size="small" />}
              className="md:flex-[2]"
            />
            <TextField
              label="Cantidad"
              type="number"
              size="small"
              value={tempCantidad}
              onChange={(e) => setTempCantidad(e.target.value)}
              className="md:flex-1"
            />
            <TextField
              label="Costo Unitario ($)"
              type="number"
              size="small"
              value={tempPrecio}
              onChange={(e) => setTempPrecio(e.target.value)}
              className="md:flex-1"
            />
            <Button
              variant="contained"
              onClick={agregarAlCarrito}
              disabled={!tempProducto || !tempCantidad || !tempPrecio || !proveedorId} // También requerimos proveedor antes de agregar
            >
              Agregar
            </Button>
          </div>

          {/* Tabla Carrito */}
          <div className="flex justify-between items-center mb-2">
            <Typography variant="subtitle2" className="text-gray-600">
              Productos en la orden ({carrito.length})
            </Typography>
            {carrito.length > 0 && (
              <Button 
                size="small" 
                color="error" 
                startIcon={<RemoveShoppingCartIcon />}
                onClick={vaciarCarrito}
              >
                Vaciar Carrito
              </Button>
            )}
          </div>

          <Table size="small" className="border rounded-lg">
            <TableHead className="bg-gray-100">
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell align="center">Cant.</TableCell>
                <TableCell align="right">Costo</TableCell>
                <TableCell align="right">Subtotal</TableCell>
                <TableCell align="center">Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {carrito.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" className="text-gray-500 py-4">
                    El carrito está vacío
                  </TableCell>
                </TableRow>
              ) : (
                carrito.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.nombre}</TableCell>
                    <TableCell align="center">{item.cantidad}</TableCell>
                    <TableCell align="right">${item.precioCompra.toFixed(2)}</TableCell>
                    <TableCell align="right">${item.subtotal.toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="error" onClick={() => eliminarDelCarrito(item.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <Box className="flex justify-end mt-4">
            <Typography variant="h6" className="font-bold text-green-800">
              Total a Pagar: ${totalCarrito.toFixed(2)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={() => setOpenCreate(false)} color="inherit">
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleCreate}
            disabled={carrito.length === 0 || !proveedorId || isSubmitting}
          >
            {isSubmitting ? "Procesando..." : "Finalizar Compra"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- MODAL DETALLE Y CANCELACIÓN (Igual que antes) --- */}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="md" fullWidth>
        <DialogTitle className="flex justify-between items-center bg-gray-50">
          <span className="font-bold text-gray-700">Detalle de Compra #{selectedCompra?.id}</span>
          {selectedCompra?.estatus === "COMPLETADO" && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<CancelIcon />}
              onClick={() => handleRequestCancel(selectedCompra.id)}
            >
              Cancelar Compra
            </Button>
          )}
        </DialogTitle>
        <DialogContent dividers>
          {selectedCompra && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Typography variant="caption" className="text-gray-500">Proveedor</Typography>
                  <Typography variant="body1" className="font-semibold">
                    {selectedCompra.proveedor?.nombreEmpresa}
                  </Typography>
                </div>
                <div>
                  <Typography variant="caption" className="text-gray-500">Fecha</Typography>
                  <Typography variant="body1">
                    {new Date(selectedCompra.createdAt).toLocaleString("es-MX")}
                  </Typography>
                </div>
                <div>
                  <Typography variant="caption" className="text-gray-500">Estatus</Typography>
                  <Chip
                    label={selectedCompra.estatus}
                    color={selectedCompra.estatus === "COMPLETADO" ? "success" : "error"}
                    size="small"
                  />
                </div>
                <div>
                  <Typography variant="caption" className="text-gray-500">Total</Typography>
                  <Typography variant="h6" className="font-bold text-green-700">
                    ${parseFloat(selectedCompra.total).toFixed(2)}
                  </Typography>
                </div>
              </div>
              <Divider>Productos</Divider>
              <Table size="small">
                <TableHead className="bg-gray-100">
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell align="center">Cant.</TableCell>
                    <TableCell align="right">Costo U.</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedCompra.detalles?.map((detalle) => (
                    <TableRow key={detalle.id}>
                      <TableCell>{detalle.producto?.nombre}</TableCell>
                      <TableCell align="center">
                        {detalle.cantidad} {detalle.producto?.unidadMedida}
                      </TableCell>
                      <TableCell align="right">
                        ${parseFloat(detalle.precioCompra).toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        ${parseFloat(detalle.subtotal).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetail(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle className="flex items-center gap-2 text-red-700 font-bold">
          <WarningAmberIcon /> Cancelar Compra
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas cancelar la compra <strong>#{compraIdToCancel}</strong>?
          </DialogContentText>
          <Box className="mt-3 bg-red-50 p-3 rounded text-sm text-red-800 border border-red-100">
            <strong>Atención:</strong> Esta acción revertirá automáticamente el stock de los productos involucrados.
          </Box>
        </DialogContent>
        <DialogActions className="p-4 pt-0">
          <Button onClick={() => setOpenConfirmDialog(false)} color="inherit" disabled={isSubmitting}>
            Volver
          </Button>
          <Button
            onClick={handleConfirmCancel}
            variant="contained"
            color="error"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <RefreshIcon className="animate-spin"/> : null}
          >
            {isSubmitting ? "Cancelando..." : "Sí, Cancelar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Compras;