import React, { useState } from "react";
import {
  Typography,
  Paper,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress,
  Button,
  Avatar,
  TablePagination,
} from "@mui/material";
import {
  AttachMoney,
  ShoppingCart,
  Warning,
  Inventory,
  Refresh,
  TrendingUp,
  TrendingDown,
  Store,
  People,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import MetricCard from "../components/Dashboard/MetricCard";
import { useDashboard } from "../context/dashboard/DashboardContext";

export default function Dashboard() {
  const { dashboardData, userRole, loading, error, refreshDashboard } =
    useDashboard();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value || 0);
  };

  const estadoColors = {
    PENDIENTE: "warning",
    EN_PROCESO: "info",
    COMPLETADO: "success",
    CANCELADO: "error",
  };

  if (loading) {
    return (
      <Box className="flex items-center justify-center h-screen">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex items-center justify-center h-screen">
        <Alert severity="error" className="max-w-md">
          <Typography variant="h6">Error al cargar el dashboard</Typography>
          <Typography variant="body2">{error}</Typography>
          <Button
            onClick={refreshDashboard}
            variant="contained"
            className="mt-3"
          >
            Reintentar
          </Button>
        </Alert>
      </Box>
    );
  }

  if (!dashboardData) {
    return (
      <Box className="flex items-center justify-center h-screen">
        <Typography variant="h6" className="text-gray-500">
          No hay datos disponibles
        </Typography>
      </Box>
    );
  }

  const isSuperAdmin = userRole === "SUPERADMIN";

  // ==========================================
  // DASHBOARD SUPER ADMIN
  // ==========================================
  if (isSuperAdmin) {
    const {
      resumenGeneral = {
        totalTiendas: 0,
        totalClientes: 0,
        ventasMes: { total: 0, cantidad: 0 },
      },
      pedidosHoy = { total: 0, completados: 0, pendientes: 0 },
      top5Productos = [],
      ventasPorTienda = [],
      grafica7Dias = [],
    } = dashboardData;

    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <Box className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <Box>
            <Typography variant="h4" className="font-bold text-gray-800">
              Dashboard General
            </Typography>
            <Typography variant="subtitle1" className="text-gray-500">
              Vista general de todas las tiendas
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={refreshDashboard}
            className="whitespace-nowrap"
          >
            Actualizar
          </Button>
        </Box>

        {/* Métricas Principales */}
        <Grid container spacing={3} className="mb-6">
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Tiendas Activas"
              value={resumenGeneral.totalTiendas}
              subtitle="Tiendas registradas"
              icon={Store}
              color="purple"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Clientes Activos"
              value={resumenGeneral.totalClientes}
              subtitle="Clientes registrados"
              icon={People}
              color="blue"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Ventas del Mes"
              value={formatCurrency(resumenGeneral.ventasMes.total)}
              subtitle={`${resumenGeneral.ventasMes.cantidad} pedidos completados`}
              icon={AttachMoney}
              color="green"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Pedidos Hoy"
              value={pedidosHoy.total || 0}
              subtitle={`${pedidosHoy.completados || 0} completados`}
              icon={ShoppingCart}
              color="orange"
            />
          </Grid>
        </Grid>

        {/* Gráficas */}
        <Grid container spacing={3} className="mb-6">
          <Grid item xs={12} md={8}>
            <Paper className="p-4 rounded-xl shadow-lg" elevation={3}>
              <Typography variant="h6" className="font-bold mb-4">
                Ventas de los últimos 7 días (Todas las tiendas)
              </Typography>
              {grafica7Dias.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={grafica7Dias}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="fecha"
                      tick={{ fontSize: 12 }}
                      stroke="#666"
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) =>
                        `$${(value / 1000).toFixed(0)}k`
                      }
                      stroke="#666"
                    />
                    <Tooltip
                      formatter={(value) => [formatCurrency(value), "Total"]}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: "#10b981", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Box className="flex flex-col items-center justify-center h-[300px] bg-gray-50 rounded-lg">
                  <AttachMoney className="text-gray-300 text-6xl mb-2" />
                  <Typography variant="body1" className="text-gray-500">
                    No hay datos de ventas disponibles
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper className="p-4 rounded-xl shadow-lg h-full" elevation={3}>
              <Typography variant="h6" className="font-bold mb-4">
                Top 5 Productos (Global)
              </Typography>
              <Box className="space-y-3">
                {top5Productos.length > 0 ? (
                  top5Productos.map((producto, index) => (
                    <Box
                      key={producto.productoId || index}
                      className="flex flex-col p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg hover:shadow-md transition-shadow gap-2"
                    >
                      <Box className="flex items-center gap-3">
                        <Box className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center font-bold text-white shadow-md">
                          {index + 1}
                        </Box>
                        <Box className="flex-1">
                          <Typography
                            variant="body2"
                            className="font-semibold text-gray-800"
                          >
                            {producto.nombre || "Sin nombre"}
                          </Typography>
                          <Typography
                            variant="caption"
                            className="text-gray-500"
                          >
                            {producto.tienda || "Sin tienda"}
                          </Typography>
                        </Box>
                      </Box>
                      <Box className="flex justify-between items-center ml-13">
                        <Typography variant="caption" className="text-gray-600">
                          {formatCurrency(producto.precio)}
                        </Typography>
                        <Chip
                          label={`${producto.cantidadVendida || 0} vendidos`}
                          size="small"
                          className="bg-blue-100 text-blue-700 font-semibold"
                        />
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Box className="flex flex-col items-center justify-center h-[250px] bg-gray-50 rounded-lg">
                    <ShoppingCart className="text-gray-300 text-5xl mb-2" />
                    <Typography
                      variant="body2"
                      className="text-gray-500 text-center"
                    >
                      No hay productos vendidos aún
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Ventas por Tienda - TABLA */}
        {ventasPorTienda.length > 0 && (
          <Paper className="p-4 rounded-xl shadow-lg mb-6" elevation={3}>
            <Box className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <Typography variant="h6" className="font-bold">
                Ventas por Tienda (Este Mes)
              </Typography>
              <Chip
                label={`${ventasPorTienda.length} Tiendas Activas`}
                color="primary"
                size="small"
              />
            </Box>
            <div className="overflow-x-auto">
              <TableContainer>
                <Table>
                  <TableHead className="bg-gray-100">
                    <TableRow>
                      <TableCell className="font-bold">Posición</TableCell>
                      <TableCell className="font-bold">Tienda</TableCell>
                      <TableCell className="font-bold" align="center">
                        Pedidos
                      </TableCell>
                      <TableCell className="font-bold" align="right">
                        Total Ventas
                      </TableCell>
                      <TableCell className="font-bold" align="right">
                        Promedio por Pedido
                      </TableCell>
                      <TableCell className="font-bold" align="center">
                        Rendimiento
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ventasPorTienda
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((tienda, index) => {
                        const actualIndex = page * rowsPerPage + index;
                        const promedioPorPedido =
                          tienda.cantidadPedidos > 0
                            ? tienda.totalVentas / tienda.cantidadPedidos
                            : 0;

                        // Calcular rendimiento basado en posición
                        let rendimientoColor = "default";
                        let rendimientoLabel = "Normal";

                        if (actualIndex === 0) {
                          rendimientoColor = "success";
                          rendimientoLabel = "Excelente";
                        } else if (actualIndex <= 2) {
                          rendimientoColor = "info";
                          rendimientoLabel = "Muy Bueno";
                        } else if (
                          actualIndex <= Math.floor(ventasPorTienda.length / 2)
                        ) {
                          rendimientoColor = "primary";
                          rendimientoLabel = "Bueno";
                        } else {
                          rendimientoColor = "warning";
                          rendimientoLabel = "Regular";
                        }

                        return (
                          <TableRow
                            key={tienda.tiendaId}
                            hover
                            className={
                              actualIndex < 3
                                ? "bg-gradient-to-r from-green-50 to-white"
                                : ""
                            }
                          >
                            <TableCell>
                              <Box className="flex items-center gap-2">
                                {actualIndex < 3 ? (
                                  <Box
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                                      actualIndex === 0
                                        ? "bg-yellow-500"
                                        : actualIndex === 1
                                        ? "bg-gray-400"
                                        : "bg-orange-600"
                                    }`}
                                  >
                                    {actualIndex + 1}
                                  </Box>
                                ) : (
                                  <Typography
                                    variant="body2"
                                    className="font-semibold ml-2"
                                  >
                                    #{actualIndex + 1}
                                  </Typography>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box className="flex items-center gap-2">
                                <Store
                                  className="text-green-600"
                                  fontSize="small"
                                />
                                <Typography
                                  variant="body2"
                                  className="font-semibold"
                                >
                                  {tienda.tiendaNombre}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={tienda.cantidadPedidos}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                variant="body2"
                                className="font-bold text-green-700"
                              >
                                {formatCurrency(tienda.totalVentas)}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                variant="body2"
                                className="text-gray-600"
                              >
                                {formatCurrency(promedioPorPedido)}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={rendimientoLabel}
                                size="small"
                                color={rendimientoColor}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            {/* Paginación */}
            {ventasPorTienda.length > 10 && (
              <TablePagination
                component="div"
                count={ventasPorTienda.length}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage="Tiendas por página:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} de ${count}`
                }
              />
            )}

            {/* Resumen de estadísticas */}
            <Box className="mt-4 pt-4 border-t border-gray-200">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box className="text-center p-3 bg-green-50 rounded-lg">
                    <Typography variant="caption" className="text-gray-600">
                      Total Ventas
                    </Typography>
                    <Typography
                      variant="h6"
                      className="font-bold text-green-700"
                    >
                      {formatCurrency(
                        ventasPorTienda.reduce(
                          (sum, t) => sum + t.totalVentas,
                          0
                        )
                      )}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box className="text-center p-3 bg-blue-50 rounded-lg">
                    <Typography variant="caption" className="text-gray-600">
                      Total Pedidos
                    </Typography>
                    <Typography
                      variant="h6"
                      className="font-bold text-blue-700"
                    >
                      {ventasPorTienda.reduce(
                        (sum, t) => sum + t.cantidadPedidos,
                        0
                      )}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box className="text-center p-3 bg-purple-50 rounded-lg">
                    <Typography variant="caption" className="text-gray-600">
                      Promedio General
                    </Typography>
                    <Typography
                      variant="h6"
                      className="font-bold text-purple-700"
                    >
                      {formatCurrency(
                        ventasPorTienda.reduce(
                          (sum, t) => sum + t.totalVentas,
                          0
                        ) /
                          ventasPorTienda.reduce(
                            (sum, t) => sum + t.cantidadPedidos,
                            0
                          )
                      )}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        )}
      </div>
    );
  }

  // ==========================================
  // DASHBOARD VENDEDOR (AdminTienda / Empleado)
  // ==========================================
  const {
    tienda = null,
    ventasMes = { total: 0, cantidad: 0 },
    pedidosHoy = { total: 0, completados: 0, pendientes: 0 },
    top5Productos = [],
    productosStockBajo = [],
    grafica7Dias = [],
    ultimosPedidos = [],
  } = dashboardData;

  const calcularTendencia = () => {
    if (grafica7Dias.length < 2) return { porcentaje: 0, esPositivo: true };
    const ultimosDias = grafica7Dias.slice(-2);
    const anterior = ultimosDias[0]?.total || 0;
    const actual = ultimosDias[1]?.total || 0;
    if (anterior === 0) return { porcentaje: 0, esPositivo: true };
    const cambio = ((actual - anterior) / anterior) * 100;
    return {
      porcentaje: Math.abs(cambio).toFixed(1),
      esPositivo: cambio >= 0,
    };
  };

  const tendencia = calcularTendencia();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Box className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <Box>
          <Typography variant="h4" className="font-bold text-gray-800">
            Dashboard - {tienda?.nombre || "Mi Tienda"}
          </Typography>
          <Typography variant="subtitle1" className="text-gray-500">
            {tienda?.direccion || "Sin dirección"} •{" "}
            {tienda?.telefono || "Sin teléfono"}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={refreshDashboard}
          className="whitespace-nowrap"
        >
          Actualizar
        </Button>
      </Box>

      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Ventas del Mes"
            value={formatCurrency(ventasMes.total)}
            subtitle={`${ventasMes.cantidad || 0} pedidos completados`}
            icon={AttachMoney}
            color="green"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Pedidos Hoy"
            value={pedidosHoy.total || 0}
            subtitle={`${pedidosHoy.completados || 0} completados`}
            icon={ShoppingCart}
            color="blue"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Pendientes"
            value={pedidosHoy.pendientes || 0}
            subtitle="Requieren atención"
            icon={Warning}
            color="orange"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Stock Bajo"
            value={productosStockBajo.length}
            subtitle="Productos críticos"
            icon={Inventory}
            color="red"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} md={8}>
          <Paper className="p-4 rounded-xl shadow-lg" elevation={3}>
            <Box className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
              <Typography variant="h6" className="font-bold">
                Ventas de los últimos 7 días
              </Typography>
              {grafica7Dias.length > 0 && (
                <Box className="flex items-center gap-1">
                  {tendencia.esPositivo ? (
                    <TrendingUp className="text-green-600" />
                  ) : (
                    <TrendingDown className="text-red-600" />
                  )}
                  <Typography
                    variant="body2"
                    className={
                      tendencia.esPositivo ? "text-green-600" : "text-red-600"
                    }
                  >
                    {tendencia.porcentaje}%
                  </Typography>
                </Box>
              )}
            </Box>
            {grafica7Dias.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={grafica7Dias}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="fecha"
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    stroke="#666"
                  />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), "Total"]}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Box className="flex flex-col items-center justify-center h-[300px] bg-gray-50 rounded-lg">
                <AttachMoney className="text-gray-300 text-6xl mb-2" />
                <Typography variant="body1" className="text-gray-500">
                  No hay datos de ventas disponibles
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper className="p-4 rounded-xl shadow-lg h-full" elevation={3}>
            <Typography variant="h6" className="font-bold mb-4">
              Top 5 Productos
            </Typography>
            <Box className="space-y-3">
              {top5Productos.length > 0 ? (
                top5Productos.map((producto, index) => (
                  <Box
                    key={producto.productoId || index}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg hover:shadow-md transition-shadow gap-3"
                  >
                    <Box className="flex items-center gap-3">
                      <Box className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center font-bold text-white shadow-md">
                        {index + 1}
                      </Box>
                      <Box>
                        <Typography
                          variant="body2"
                          className="font-semibold text-gray-800"
                        >
                          {producto.nombre || "Sin nombre"}
                        </Typography>
                        <Typography variant="caption" className="text-gray-500">
                          {formatCurrency(producto.precio)}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={`${producto.cantidadVendida || 0} vendidos`}
                      size="small"
                      className="bg-blue-100 text-blue-700 font-semibold self-start sm:self-auto"
                    />
                  </Box>
                ))
              ) : (
                <Box className="flex flex-col items-center justify-center h-[250px] bg-gray-50 rounded-lg">
                  <ShoppingCart className="text-gray-300 text-5xl mb-2" />
                  <Typography
                    variant="body2"
                    className="text-gray-500 text-center"
                  >
                    No hay productos vendidos aún
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {productosStockBajo.length > 0 && (
        <Box className="mb-6">
          <Alert severity="warning" className="mb-3">
            <Typography variant="subtitle2" className="font-bold">
              ⚠️ {productosStockBajo.length} productos con stock bajo
            </Typography>
            <Typography variant="caption">
              Considera reabastecer estos productos pronto
            </Typography>
          </Alert>
          <div className="overflow-x-auto">
            <TableContainer component={Paper} className="rounded-xl shadow-lg">
              <Table>
                <TableHead className="bg-gray-100">
                  <TableRow>
                    <TableCell className="font-bold">Producto</TableCell>
                    <TableCell className="font-bold" align="center">
                      Stock Actual
                    </TableCell>
                    <TableCell className="font-bold" align="center">
                      Stock Alerta
                    </TableCell>
                    <TableCell className="font-bold" align="center">
                      Estado
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productosStockBajo.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <Box className="flex items-center gap-2">
                          {item.producto?.imagen && (
                            <Avatar
                              src={item.producto.imagen}
                              variant="rounded"
                              className="w-10 h-10"
                            />
                          )}
                          {item.producto?.nombre || "Sin nombre"}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={item.stockActual || 0}
                          color="error"
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        {item.stockAlerta || 0}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label="Crítico"
                          color="error"
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Box>
      )}

      <Paper className="p-4 rounded-xl shadow-lg" elevation={3}>
        <Typography variant="h6" className="font-bold mb-4">
          Últimos Pedidos
        </Typography>
        <div className="overflow-x-auto">
          <TableContainer>
            <Table>
              <TableHead className="bg-gray-100">
                <TableRow>
                  <TableCell className="font-bold">ID</TableCell>
                  <TableCell className="font-bold">Cliente</TableCell>
                  <TableCell className="font-bold" align="right">
                    Total
                  </TableCell>
                  <TableCell className="font-bold" align="center">
                    Estado
                  </TableCell>
                  <TableCell className="font-bold">Fecha</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ultimosPedidos.length > 0 ? (
                  ultimosPedidos.map((pedido) => (
                    <TableRow key={pedido.id} hover>
                      <TableCell>
                        <Typography variant="body2" className="font-mono">
                          #{pedido.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" className="font-semibold">
                            {pedido.cliente?.nombreCompleto || "Sin nombre"}
                          </Typography>
                          <Typography
                            variant="caption"
                            className="text-gray-500"
                          >
                            {pedido.cliente?.email || "Sin email"}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right" className="font-bold">
                        {formatCurrency(pedido.total)}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={pedido.estado || "PENDIENTE"}
                          color={estadoColors[pedido.estado] || "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {pedido.createdAt
                          ? new Date(pedido.createdAt).toLocaleDateString(
                              "es-MX",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "Sin fecha"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Box className="py-8">
                        <ShoppingCart className="text-gray-300 text-5xl mb-2 mx-auto" />
                        <Typography variant="body2" className="text-gray-500">
                          No hay pedidos recientes
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Paper>
    </div>
  );
}
