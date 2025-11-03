import React from "react";
import {
  Button,
  IconButton,
  Typography,
  Paper,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import { DataGrid } from "@mui/x-data-grid";
import { useLoaderData, useNavigate } from "react-router-dom";

const Tienda = () => {
  const tiendas = useLoaderData();
  const isMobile = useMediaQuery("(max-width:768px)");
  const navigate = useNavigate();

  const columns = [
    {
      field: "nombre",
      headerName: "Nombre",
      flex: 1,
      headerClassName: "header-green",
    },
    {
      field: "direccion",
      headerName: "Dirección",
      flex: 1,
      headerClassName: "header-green",
    },
    {
      field: "telefono",
      headerName: "Teléfono",
      flex: 1,
      headerClassName: "header-green",
    },
    {
      field: "emailContacto",
      headerName: "Email",
      flex: 1,
      headerClassName: "header-green",
    },
    {
      field: "activa",
      headerName: "Activa",
      flex: 0.5,
      renderCell: (params) => (params.value ? "✅" : "❌"),
      headerClassName: "header-green",
    },
    // {
    //   field: "acciones",
    //   headerName: "Acciones",
    //   flex: 0.8,
    //   sortable: false,
    //   filterable: false,
    //   renderCell: () => (
    //     <Button variant="outlined" size="small">
    //       Editar
    //     </Button>
    //   ),
    //   headerClassName: "header-green",
    // },
  ];

  return (
    <Paper className="p-4 md:p-6 rounded-xl shadow-md bg-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-2 md:gap-0">
        <Typography variant="h4" className="text-green-700 font-bold">
          Tiendas
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={() => navigate("/tiendas/crear")}
          >
            Agregar
          </Button>
          <IconButton color="primary" onClick={() => console.log("Actualizar")}>
            <RefreshIcon />
          </IconButton>
        </div>
      </div>

      {/* Tabla */}
      <div style={{ height: isMobile ? 400 : 500, width: "100%" }}>
        <DataGrid
          rows={tiendas || []}
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
  );
};

export default Tienda;
