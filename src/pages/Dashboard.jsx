import React from "react";
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
} from "@mui/material";
import {
  AttachMoney,
  ShoppingCart,
  Warning,
  Inventory,
  Refresh,
  TrendingUp,
  TrendingDown,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import MetricCard from "../components/Dashboard/MetricCard";
import { useDashboard } from "../context/dashboard/DashboardContext";

export default function Dashboard() {
  const { dashboardData, loading, error, refreshDashboard } = useDashboard();

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

  const {
    ventasMes = { total: 0, cantidad: 0 },
    pedidosHoy = { total: 0, completados: 0, pendientes: 0 },
    top5Productos = [],
    productosStockBajo = [],
    grafica7Dias = [],
    ultimosPedidos = [],
  } = dashboardData;

  const graficaFormateada = Array.isArray(grafica7Dias) ? grafica7Dias : [];
  const topProductosValidos = Array.isArray(top5Productos) ? top5Productos : [];

  const calcularTendencia = () => {
    if (graficaFormateada.length < 2)
      return { porcentaje: 0, esPositivo: true };

    const ultimosDias = graficaFormateada.slice(-2);
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
            Dashboard
          </Typography>
          <Typography variant="subtitle1" className="text-gray-500">
            Resumen de tu negocio
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
              {graficaFormateada.length > 0 && (
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

            {graficaFormateada.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={graficaFormateada}>
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
                <Typography variant="caption" className="text-gray-400 mt-1">
                  Las ventas completadas aparecerán aquí
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
              {topProductosValidos.length > 0 ? (
                topProductosValidos.map((producto, index) => (
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
                  <Typography variant="caption" className="text-gray-400 mt-1">
                    Tus productos más vendidos aparecerán aquí
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
                  <TableCell className="font-bold">Tienda</TableCell>
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
                    <TableRow key={pedido.id} hover className="cursor-pointer">
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

                      <TableCell>
                        {pedido.tienda?.nombre || "Sin tienda"}
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
                    <TableCell colSpan={6} align="center">
                      <Box className="py-8">
                        <ShoppingCart className="text-gray-300 text-5xl mb-2 mx-auto" />
                        <Typography variant="body2" className="text-gray-500">
                          No hay pedidos recientes
                        </Typography>
                        <Typography variant="caption" className="text-gray-400">
                          Los nuevos pedidos aparecerán aquí
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
