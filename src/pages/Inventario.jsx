import React from "react";
import {
  IconButton,
  Typography,
  Paper,
  useMediaQuery,
  Avatar,
  Chip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ImageIcon from "@mui/icons-material/Image";
import { DataGrid } from "@mui/x-data-grid";
import { useLoaderData } from "react-router-dom";

const Inventario = () => {
  const inventario = useLoaderData();
  const isMobile = useMediaQuery("(max-width:768px)");

  const columns = [
    {
      field: "producto",
      headerName: "Producto",
      flex: 1,
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
      headerName: "Stock",
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
  ];

  return (
    <>
      <Paper className="p-4 md:p-6 rounded-2xl shadow-lg bg-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-2">
          <Typography variant="h4" className="text-green-700 font-bold">
            Inventario
          </Typography>

          <IconButton
            color="primary"
            onClick={() => window.location.reload()}
            title="Actualizar"
          >
            <RefreshIcon />
          </IconButton>
        </div>

        <div style={{ height: isMobile ? 420 : 520, width: "100%" }}>
          <DataGrid
            rows={inventario || []}
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
