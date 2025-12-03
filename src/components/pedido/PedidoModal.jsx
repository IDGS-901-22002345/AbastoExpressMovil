import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Chip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFetcher, useNavigate } from "react-router-dom";
import { httpAPIPatch } from "../../services/apiService";
import { toast } from "react-toastify";
import { useState } from "react";

const PedidoModal = ({ open, onClose, pedido, user }) => {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [loadingCancel, setLoadingCancel] = useState(false);

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

  const formatEstadoCompra = (estado) => {
    switch (estado) {
      case "PAGADO":
        return "Pagado";
      case "NO_PAGADO":
        return "No Pagado";
      default:
        return estado;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="text-green-700 font-bold flex justify-between items-center">
        Detalles del Pedido #{pedido.id}
        <IconButton onClick={onClose} size="small" color="inherit">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box className="space-y-4">
          {/* CLIENTE */}
          <Box>
            <Typography variant="h6">Información del Cliente</Typography>
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

          {/* INFORMACIÓN DEL PEDIDO */}
          <Box>
            <Typography variant="h6">Información del Pedido</Typography>
            <Box className="bg-gray-50 p-3 rounded space-y-2">
              <Box className="flex items-center gap-2">
                <Typography>
                  <strong>Estado:</strong>
                </Typography>
                <Chip
                  label={formatEstado(pedido.estado)}
                  color={getEstadoColor(pedido.estado)}
                  size="small"
                />
              </Box>

              <Box className="flex items-center gap-2">
                <Typography>
                  <strong>Pago:</strong>
                </Typography>
                <Chip
                  label={formatEstadoCompra(pedido.estadoCompra)}
                  color={getEstadoCompraColor(pedido.estadoCompra)}
                  size="small"
                />
              </Box>

              <Typography>
                <strong>Fecha:</strong>{" "}
                {new Date(pedido.createdAt).toLocaleString("es-MX")}
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* PRODUCTOS */}
          <Box>
            <Typography variant="h6">Productos</Typography>

            <Table size="small">
              <TableHead>
                <TableRow className="bg-green-50">
                  <TableCell>Producto</TableCell>
                  <TableCell align="center">Cant.</TableCell>
                  <TableCell align="right">Precio Unit.</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {pedido.detalles?.map((detalle, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Box className="flex items-center gap-3">
                        <img
                          src={detalle.producto.imagen}
                          alt={detalle.producto.nombre}
                          style={{ width: 40, height: 40, borderRadius: 6 }}
                        />
                        <Typography>{detalle.producto.nombre}</Typography>
                      </Box>
                    </TableCell>

                    <TableCell align="center">{detalle.cantidad}</TableCell>
                    <TableCell align="right">
                      ${detalle.precioUnitario}
                    </TableCell>
                    <TableCell align="right">${detalle.total}</TableCell>
                  </TableRow>
                ))}

                <TableRow className="bg-green-50">
                  <TableCell colSpan={3} align="right">
                    <strong>Total:</strong>
                  </TableCell>
                  <TableCell align="right" className="font-bold text-green-700">
                    ${pedido.total}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions className="p-4 justify-end gap-2">
        {user?.rol === "ADMINTIENDA" && (
          <Button
            variant="contained"
            color="error"
            disabled={loadingCancel}
            onClick={async () => {
              setLoadingCancel(true);
              try {
                await httpAPIPatch(`/pedidos/cancelar/${pedido.id}`);
                toast.success("Pedido cancelado correctamente");
                navigate("/pedidos");
                onClose();
              } catch (err) {
                toast.error(err?.message || "Error al cancelar el pedido");
              } finally {
                setLoadingCancel(false);
              }
            }}
          >
            {loadingCancel ? "Cancelando..." : "Cancelar Pedido"}
          </Button>
        )}

        {pedido.estado === "COMPLETADO" && user?.rol === "ADMINTIENDA" && (
          <fetcher.Form method="patch" action="/pedidos">
            <input type="hidden" name="pedidoId" value={pedido.id} />
            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={fetcher.state === "submitting"}
            >
              {fetcher.state === "submitting" ? "Pagando..." : "Pagar Pedido"}
            </Button>
          </fetcher.Form>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PedidoModal;
