import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

export default function PedidoModal({ open, onClose, pedido }) {
  if (!pedido) return null;

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

  const formatEstadoCompra = (estadoCompra) => {
    switch (estadoCompra) {
      case "NO_PAGADO":
        return "No Pagado";
      case "PAGADO":
        return "Pagado";
      default:
        return estadoCompra;
    }
  };
  const getEstadoCompraColor = (estado) => {
    switch (estado) {
      case "PAGADO":
        return "success";
      case "NO_PAGADO":
        return "error";
      default:
        return "default";
    }
  };

  const ultimoCheckIn = pedido.checkIns?.length
    ? pedido.checkIns[pedido.checkIns.length - 1]
    : null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="text-green-700 font-bold">
        Detalles del Pedido #{pedido.id}
      </DialogTitle>

      <DialogContent>
        <Box className="space-y-4">
          {/* CLIENTE */}
          <Box>
            <Typography variant="h6" className="text-gray-700 mb-2">
              Información del Cliente
            </Typography>
            <Box className="bg-gray-50 p-3 rounded">
              <Typography>
                <strong>Nombre:</strong> {pedido.cliente.nombreCompleto}
              </Typography>
              <Typography>
                <strong>Email:</strong> {pedido.cliente.email}
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* INFORMACIÓN GENERAL */}
          <Box>
            <Typography variant="h6" className="text-gray-700 mb-2">
              Información del Pedido
            </Typography>

            <Box className="bg-gray-50 p-3 rounded space-y-2">
              <Box className="flex items-center gap-2">
                <Typography>
                  <strong>Estado del pedido:</strong>
                </Typography>
                <Chip
                  label={formatEstado(pedido.estado)}
                  color={getEstadoColor(pedido.estado)}
                  size="small"
                />
              </Box>

              <Box className="flex items-center gap-2">
                <Typography>
                  <strong>Estado de compra:</strong>
                </Typography>
                <Chip
                  label={formatEstadoCompra(pedido.estadoCompra)}
                  color={getEstadoCompraColor(pedido.estadoCompra)}
                  size="small"
                />
              </Box>

              <Typography>
                <strong>Fecha:</strong>{" "}
                {new Date(pedido.createdAt).toLocaleString("es-MX", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* ÚLTIMO CHECK-IN */}
          {ultimoCheckIn && (
            <Box>
              <Typography variant="h6" className="text-gray-700 mb-2">
                Último Check-in
              </Typography>

              <Box className="bg-gray-50 p-3 rounded border-l-4 border-green-600">
                <Typography className="font-semibold text-green-700 mb-2">
                  Empleado que hizo el check-in
                </Typography>

                {/* Empleado */}
                <Typography className="text-gray-900 font-medium text-base">
                  {ultimoCheckIn.empleado?.nombreCompleto ||
                    "Empleado desconocido"}
                </Typography>

                <Box className="mt-2">
                  <Typography className="text-gray-600 text-sm font-semibold">
                    Fecha del check-in:
                  </Typography>
                  <Typography className="text-gray-800 text-sm">
                    {new Date(ultimoCheckIn.fecha).toLocaleString("es-MX", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </Box>

                {ultimoCheckIn.observaciones && (
                  <Typography className="mt-1 text-gray-700 text-sm">
                    {ultimoCheckIn.observaciones}
                  </Typography>
                )}
              </Box>
            </Box>
          )}

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
                    Cant.
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
                {pedido.detalles?.map((d, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Box className="flex items-center gap-3">
                        <img
                          src={d.producto?.imagen}
                          alt={d.producto?.nombre}
                          style={{
                            width: 40,
                            height: 40,
                            objectFit: "cover",
                            borderRadius: 6,
                          }}
                        />

                        <Typography className="font-medium text-gray-800">
                          {d.producto?.nombre}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">{d.cantidad}</TableCell>
                    <TableCell align="right">
                      ${parseFloat(d.precioUnitario).toFixed(2)}
                    </TableCell>
                    <TableCell align="right" className="font-semibold">
                      ${parseFloat(d.total).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}

                <TableRow className="bg-green-50">
                  <TableCell colSpan={3} align="right" className="font-bold">
                    TOTAL:
                  </TableCell>
                  <TableCell align="right" className="font-bold text-green-700">
                    ${parseFloat(pedido.total).toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions className="p-4">
        <Button onClick={onClose} variant="contained" color="success">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
