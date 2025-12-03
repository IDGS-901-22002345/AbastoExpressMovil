import React, { useState } from "react";
import {
  IconButton,
  Typography,
  Paper,
  useMediaQuery,
  Chip,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  MenuItem,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DataGrid } from "@mui/x-data-grid";
import { useLoaderData } from "react-router-dom";
import PedidoModal from "../components/Ventas/PedidoModal";

const Ventas = () => {
  const pedidos = useLoaderData();
  const isMobile = useMediaQuery("(max-width:768px)");

  const [openView, setOpenView] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);

  const [search, setSearch] = useState("");
  const [estado, setEstado] = useState("");
  const [estadoCompra, setEstadoCompra] = useState("");

  const [filterModal, setFilterModal] = useState(false);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [totalMin, setTotalMin] = useState("");
  const [totalMax, setTotalMax] = useState("");

  const handleOpenView = (pedido) => {
    setSelectedPedido(pedido);
    setOpenView(true);
  };

  const handleCloseView = () => {
    setSelectedPedido(null);
    setOpenView(false);
  };

  const formatEstado = (estado) => {
    switch (estado) {
      case "COMPLETADO":
        return "Completado";
      case "CANCELADO":
        return "Cancelado";
      default:
        return estado;
    }
  };

  const formatEstadoCompra = (estado) => {
    switch (estado) {
      case "PAGADO":
        return "Pagado";
      case "NO_PAGADO":
        return "No pagado";
      default:
        return estado;
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "COMPLETADO":
        return "success";
      case "CANCELADO":
        return "error";
      default:
        return "default";
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

  // FILTRO FINAL
  const filteredPedidos = pedidos.filter((p) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      p.cliente.nombreCompleto.toLowerCase().includes(searchText) ||
      p.id.toString().includes(searchText);

    const matchesEstado = estado ? p.estado === estado : true;
    const matchesEstadoCompra = estadoCompra
      ? p.estadoCompra === estadoCompra
      : true;

    const fechaPedido = new Date(p.createdAt);

    const matchesFechaInicio = fechaInicio
      ? fechaPedido >= new Date(fechaInicio)
      : true;

    const matchesFechaFin = fechaFin
      ? fechaPedido <= new Date(fechaFin + "T23:59:59")
      : true;

    const matchesTotalMin = totalMin
      ? Number(p.total) >= Number(totalMin)
      : true;
    const matchesTotalMax = totalMax
      ? Number(p.total) <= Number(totalMax)
      : true;

    return (
      matchesSearch &&
      matchesEstado &&
      matchesEstadoCompra &&
      matchesFechaInicio &&
      matchesFechaFin &&
      matchesTotalMin &&
      matchesTotalMax
    );
  });

  const columns = [
    {
      field: "id",
      headerName: "Venta",
      flex: 0.4,
      headerClassName: "header-green",
    },
    {
      field: "cliente",
      headerName: "Cliente",
      flex: 1.2,
      headerClassName: "header-green",
      renderCell: (params) => (
        <div className="font-semibold">{params.row.cliente.nombreCompleto}</div>
      ),
    },
    {
      field: "estadoCompra",
      headerName: "Pago",
      flex: 0.7,
      headerClassName: "header-green",
      renderCell: (params) => (
        <Chip
          label={formatEstadoCompra(params.value)}
          color={getEstadoCompraColor(params.value)}
          size="small"
        />
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
      field: "total",
      headerName: "Total",
      flex: 0.7,
      headerClassName: "header-green",
      renderCell: (params) => {
        const total = Number(params.row.total);
        const color =
          params.row.estadoCompra === "PAGADO"
            ? "success"
            : params.row.estadoCompra === "NO_PAGADO"
            ? "error"
            : "default";

        return (
          <Chip
            label={`$${isNaN(total) ? "0.00" : total.toFixed(2)}`}
            color={color}
            size="small"
            variant="outlined"
          />
        );
      },
    },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 0.6,
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
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
          <Typography variant="h4" className="text-green-700 font-bold">
            Ventas
          </Typography>

          <div className="flex items-center gap-3">
            <TextField
              size="small"
              variant="outlined"
              label="Buscar por nombre o ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: 220 }}
            />

            {/* ESTADO */}
            <Chip
              label={estado ? formatEstado(estado) : "Estado"}
              color={estado ? getEstadoColor(estado) : "default"}
              onClick={() =>
                setEstado(
                  estado === ""
                    ? "COMPLETADO"
                    : estado === "COMPLETADO"
                    ? "CANCELADO"
                    : ""
                )
              }
              onDelete={estado ? () => setEstado("") : undefined}
              variant="outlined"
            />

            {/* ESTADO COMPRA */}
            <Chip
              label={estadoCompra ? formatEstadoCompra(estadoCompra) : "Pago"}
              color={
                estadoCompra ? getEstadoCompraColor(estadoCompra) : "default"
              }
              onClick={() =>
                setEstadoCompra(
                  estadoCompra === ""
                    ? "PAGADO"
                    : estadoCompra === "PAGADO"
                    ? "NO_PAGADO"
                    : ""
                )
              }
              onDelete={estadoCompra ? () => setEstadoCompra("") : undefined}
              variant="outlined"
            />

            {/* BOTÓN FILTROS AVANZADOS */}
            <IconButton
              color="primary"
              onClick={() => setFilterModal(true)}
              sx={{ border: "1px solid #ccc", borderRadius: 2 }}
            >
              <FilterAltIcon />
            </IconButton>

            <IconButton
              color="primary"
              onClick={() => window.location.reload()}
            >
              <RefreshIcon />
            </IconButton>
          </div>
        </div>

        {/* TABLA */}
        <div style={{ height: isMobile ? 420 : 540, width: "100%" }}>
          <DataGrid
            rows={filteredPedidos}
            columns={columns}
            pageSizeOptions={[5, 10, 20]}
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
          />
        </div>
      </Paper>

      {/* MODAL DE FILTROS */}
      <Dialog
        open={filterModal}
        onClose={() => setFilterModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Filtros Avanzados</DialogTitle>

        <DialogContent>
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <TextField
              label="Fecha inicio"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
            <TextField
              label="Fecha fin"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />

            <TextField
              label="Total mínimo"
              type="number"
              value={totalMin}
              onChange={(e) => setTotalMin(e.target.value)}
            />
            <TextField
              label="Total máximo"
              type="number"
              value={totalMax}
              onChange={(e) => setTotalMax(e.target.value)}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setFilterModal(false)}>Cerrar</Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => setFilterModal(false)}
          >
            Aplicar
          </Button>
        </DialogActions>
      </Dialog>

      <PedidoModal
        open={openView}
        onClose={handleCloseView}
        pedido={selectedPedido}
      />
    </>
  );
};

export default Ventas;
