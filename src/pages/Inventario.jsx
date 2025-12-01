import React, { useState, useEffect } from "react";
import {
  IconButton,
  Typography,
  Paper,
  useMediaQuery,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ImageIcon from "@mui/icons-material/Image";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { DataGrid } from "@mui/x-data-grid";
import { useLoaderData } from "react-router-dom";

const Inventario = () => {
  const inventarioCompleto = useLoaderData();
  const isMobile = useMediaQuery("(max-width:768px)");

  const [searchTerm, setSearchTerm] = useState("");
  const [showLowStock, setShowLowStock] = useState(false);
  const [inventarioFiltrado, setInventarioFiltrado] =
    useState(inventarioCompleto);

  useEffect(() => {
    let resultado = [...inventarioCompleto];

    if (searchTerm.trim()) {
      resultado = resultado.filter((item) =>
        item.producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro de stock bajo
    if (showLowStock) {
      resultado = resultado.filter(
        (item) => item.stockActual <= item.stockAlerta
      );
    }

    setInventarioFiltrado(resultado);
  }, [searchTerm, showLowStock, inventarioCompleto]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setShowLowStock(false);
  };

  const columns = [
    {
      field: "producto",
      headerName: "Producto",
      flex: 1.2,
      headerClassName: "header-green",
      renderCell: (params) => (
        <div className="flex items-center gap-3">
          {params.value.imagen ? (
            <Avatar
              src={params.value.imagen}
              variant="rounded"
              alt={params.value.nombre}
              sx={{ width: 55, height: 55, boxShadow: 1 }}
            />
          ) : (
            <Avatar variant="rounded" sx={{ width: 55, height: 55 }}>
              <ImageIcon />
            </Avatar>
          )}
          <span className="font-medium text-gray-800">
            {params.value.nombre}
          </span>
        </div>
      ),
    },
    {
      field: "stockActual",
      headerName: "Stock Actual",
      flex: 0.4,
      headerClassName: "header-green",
      renderCell: (params) => {
        const cantidad = params.value || 0;
        const color =
          cantidad > 10 ? "success" : cantidad > 0 ? "warning" : "error";

        return (
          <Chip
            label={cantidad}
            color={color}
            size="small"
            sx={{ fontWeight: "bold" }}
          />
        );
      },
    },
    {
      field: "unidadMedida",
      headerName: "Unidad",
      flex: 0.4,
      headerClassName: "header-green",
      renderCell: (params) => {
        const unidad = params.row.producto.unidadMedida;
        return (
          <span className="font-medium text-gray-700">{unidad || "-"}</span>
        );
      },
    },
  ];

  return (
    <>
      <Paper className="p-4 md:p-6 rounded-2xl shadow-lg bg-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-2">
          <Typography variant="h4" className="text-green-700 font-bold">
            Inventario
          </Typography>

          <div className="flex items-center gap-3">
            {/* Campo de Búsqueda */}
            <TextField
              label="Buscar por nombre"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Botón para Filtro de Stock Bajo */}
            <Button
              variant={showLowStock ? "contained" : "outlined"}
              color="warning"
              onClick={() => setShowLowStock(!showLowStock)}
              size="small"
            >
              Stock Bajo
            </Button>

            {/* Botón de Limpiar Filtros */}
            {(searchTerm || showLowStock) && (
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={handleClearFilters}
                size="small"
              >
                Limpiar
              </Button>
            )}

            {/* Botón de Actualizar */}
            <IconButton
              color="primary"
              onClick={() => window.location.reload()}
              title="Actualizar"
            >
              <RefreshIcon />
            </IconButton>
          </div>
        </div>

        {/* Contador de resultados */}
        <Typography variant="body2" color="text.secondary" className="mb-2">
          Mostrando {inventarioFiltrado.length} de {inventarioCompleto.length}{" "}
          productos
        </Typography>

        <div style={{ height: isMobile ? 420 : 520, width: "100%" }}>
          <DataGrid
            rows={inventarioFiltrado}
            columns={columns}
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
            }}
            getRowId={(row) => row.id}
            sx={{
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: 2,
              "& .header-green": {
                backgroundColor: "#15803d",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "1rem",
                textAlign: "center",
              },
              "& .MuiDataGrid-columnHeaders": {
                borderBottom: "2px solid #e5e7eb",
              },
              "& .MuiDataGrid-cell": {
                justifyContent: "center",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f0fdf4",
              },
            }}
            autoHeight={isMobile}
            density={isMobile ? "compact" : "standard"}
          />
        </div>
      </Paper>
    </>
  );
};

export default Inventario;
