import React, { useState } from "react";
import {
  IconButton,
  Typography,
  Paper,
  useMediaQuery,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Divider,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DataGrid } from "@mui/x-data-grid";
import { useLoaderData } from "react-router-dom";

const Pedidos = () => {
  const pedidos = useLoaderData();
  const isMobile = useMediaQuery("(max-width:768px)");

  const [openView, setOpenView] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);

  const handleOpenView = (pedido) => {
    setSelectedPedido(pedido);
    setOpenView(true);
  };

  const handleCloseView = () => {
    setOpenView(false);
    setSelectedPedido(null);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "PENDIENTE":
        return "warning";
      case "COMPLETADO":
        return "success";
      case "CANCELADO":
        return "error";
      case "EN_PROCESO":
        return "info";
      default:
        return "default";
    }
  };

  const formatEstado = (estado) => {
    switch (estado) {
      case "PENDIENTE":
        return "Pendiente";
      case "COMPLETADO":
        return "Completado";
      case "CANCELADO":
        return "Cancelado";
      case "EN_PROCESO":
        return "En Proceso";
      default:
        return estado;
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.4,
      headerClassName: "header-green",
    },
    {
      field: "cliente",
      headerName: "Cliente",
      flex: 1.2,
      headerClassName: "header-green",
      renderCell: (params) => (
        <div>
          <div className="font-semibold">
            {params.row.cliente.nombreCompleto}
          </div>
          <div className="text-xs text-gray-500">
            {params.row.cliente.email}
          </div>
        </div>
      ),
    },
    {
      field: "total",
      headerName: "Total",
      flex: 0.7,
      headerClassName: "header-green",
      renderCell: (params) => (
        <span className="font-semibold text-green-700">
          ${parseFloat(params.value).toFixed(2)}
        </span>
      ),
    },
    {
      field: "estado",
      headerName: "Estado",
      flex: 0.8,
      headerClassName: "header-green",
      renderCell: (params) => (
        <Chip
          label={formatEstado(params.value)}
          color={getEstadoColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: "createdAt",
      headerName: "Fecha",
      flex: 0.9,
      headerClassName: "header-green",
      renderCell: (params) =>
        new Date(params.value).toLocaleDateString("es-MX", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 0.5,
      sortable: false,
      filterable: false,
      headerClassName: "header-green",
      renderCell: (params) => (
        <IconButton
          color="primary"
          size="small"
          onClick={() => handleOpenView(params.row)}
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <Paper className="p-4 md:p-6 rounded-xl shadow-md bg-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-2 md:gap-0">
          <Typography variant="h4" className="text-green-700 font-bold">
            Pedidos
          </Typography>
          <IconButton
            color="primary"
            onClick={() => window.location.reload()}
            title="Actualizar"
          >
            <RefreshIcon />
          </IconButton>
        </div>

        <div style={{ height: isMobile ? 400 : 500, width: "100%" }}>
          <DataGrid
            rows={pedidos || []}
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

      <Dialog open={openView} onClose={handleCloseView} maxWidth="md" fullWidth>
        <DialogTitle className="text-green-700 font-bold">
          Detalles del Pedido #{selectedPedido?.id}
        </DialogTitle>

        <DialogContent>
          {selectedPedido && (
            <Box className="space-y-4">
              {/* CLIENTE */}
              <Box>
                <Typography variant="h6" className="text-gray-700 mb-2">
                  Información del Cliente
                </Typography>
                <Box className="bg-gray-50 p-3 rounded">
                  <Typography>
                    <strong>Nombre:</strong>{" "}
                    {selectedPedido.cliente.nombreCompleto}
                  </Typography>
                  <Typography>
                    <strong>Email:</strong> {selectedPedido.cliente.email}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              {/* INFORMACIÓN DEL PEDIDO */}
              <Box>
                <Typography variant="h6" className="text-gray-700 mb-2">
                  Información del Pedido
                </Typography>

                <Box className="bg-gray-50 p-3 rounded space-y-2">
                  {/* FIX: No meter Chip dentro de <Typography> */}
                  <Box className="flex items-center gap-2">
                    <Typography>
                      <strong>Estado:</strong>
                    </Typography>
                    <Chip
                      label={formatEstado(selectedPedido.estado)}
                      color={getEstadoColor(selectedPedido.estado)}
                      size="small"
                    />
                  </Box>

                  <Typography>
                    <strong>Fecha:</strong>{" "}
                    {new Date(selectedPedido.createdAt).toLocaleDateString(
                      "es-MX",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              {/* PRODUCTOS */}
              <Box>
                <Typography variant="h6" className="text-gray-700 mb-2">
                  Productos
                </Typography>

                <Table size="small">
                  <TableHead>
                    <TableRow className="bg-green-50">
                      <TableCell className="font-bold">Producto</TableCell>
                      <TableCell align="center" className="font-bold">
                        Cantidad
                      </TableCell>
                      <TableCell align="right" className="font-bold">
                        Precio Unit.
                      </TableCell>
                      <TableCell align="right" className="font-bold">
                        Total
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {selectedPedido.detalles?.map((detalle, index) => (
                      <TableRow key={index}>
                        <TableCell>{detalle.producto.nombre}</TableCell>
                        <TableCell align="center">{detalle.cantidad}</TableCell>
                        <TableCell align="right">
                          ${parseFloat(detalle.precioUnitario).toFixed(2)}
                        </TableCell>
                        <TableCell align="right" className="font-semibold">
                          ${parseFloat(detalle.total).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}

                    <TableRow className="bg-green-50">
                      <TableCell
                        colSpan={3}
                        align="right"
                        className="font-bold"
                      >
                        TOTAL:
                      </TableCell>
                      <TableCell
                        align="right"
                        className="font-bold text-green-700"
                      >
                        ${parseFloat(selectedPedido.total).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>

              {/* CHECKINS */}
              {selectedPedido.checkIns &&
                selectedPedido.checkIns.length > 0 && (
                  <>
                    <Divider />

                    <Box>
                      <Typography variant="h6" className="text-gray-700 mb-2">
                        Check-ins ({selectedPedido.checkIns.length})
                      </Typography>

                      <Box className="space-y-2">
                        {selectedPedido.checkIns.map((checkIn, index) => (
                          <Box
                            key={index}
                            className="bg-gray-50 p-3 rounded border-l-4 border-green-500"
                          >
                            <Typography className="text-sm font-semibold text-gray-700">
                              {checkIn.empleado?.nombreCompleto ||
                                "Empleado desconocido"}
                            </Typography>

                            <Typography className="text-xs text-gray-500">
                              {new Date(checkIn.fecha).toLocaleString("es-MX", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Typography>

                            {checkIn.observaciones && (
                              <Typography className="text-sm text-gray-600 mt-1">
                                {checkIn.observaciones}
                              </Typography>
                            )}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </>
                )}
            </Box>
          )}
        </DialogContent>

        <DialogActions className="p-4">
          <Button onClick={handleCloseView} variant="contained" color="success">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Pedidos;
