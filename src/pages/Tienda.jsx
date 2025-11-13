import React, { useState } from "react";
import {
  Button,
  IconButton,
  Typography,
  Paper,
  useMediaQuery,
  Tooltip,
  Switch,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import { DataGrid } from "@mui/x-data-grid";
import { useLoaderData, useNavigate, useRevalidator } from "react-router-dom";
import { toast } from "react-toastify";
import { httpAPIPut } from "../../src/services/apiService";

const Tienda = () => {
  const tiendas = useLoaderData();
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const isMobile = useMediaQuery("(max-width:768px)");
  const [loading, setLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState({});

  const handleRefresh = async () => {
    setLoading(true);
    await revalidator.revalidate();
    setLoading(false);
  };

  const handleToggleActiva = async (tiendaId, currentStatus) => {
    setUpdatingStatus((prev) => ({ ...prev, [tiendaId]: true }));

    try {
      const response = await httpAPIPut(`/tienda/status/${tiendaId}`, {
        activa: !currentStatus,
      });

      toast.success(
        response.message || 
        `Tienda ${!currentStatus ? "activada" : "desactivada"} correctamente`
      );
      
      await revalidator.revalidate();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      toast.error(error.message || "Error al cambiar el estado de la tienda");
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [tiendaId]: false }));
    }
  };

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
      field: "categorias",
      headerName: "Categorías",
      flex: 1,
      headerClassName: "header-green",
      renderCell: (params) =>
        params.value?.length
          ? params.value.map((cat) => cat.nombre).join(", ")
          : "—",
    },
    {
      field: "activa",
      headerName: "Estado",
      flex: 0.7,
      headerClassName: "header-green",
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={params.value}
            onChange={() => handleToggleActiva(params.row.id, params.value)}
            disabled={updatingStatus[params.row.id]}
            color="success"
          />
          <span className="text-sm">
            {params.value ? "Activa" : "Inactiva"}
          </span>
        </div>
      ),
    },
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
          <Tooltip title="Actualizar lista">
            <span>
              <IconButton
                color="primary"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshIcon
                  className={loading ? "animate-spin text-green-700" : ""}
                />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      </div>

      {/* Tabla */}
      <div style={{ height: isMobile ? 420 : 520, width: "100%" }}>
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