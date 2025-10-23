import React from "react";
import { Typography, Paper, Grid, Box, Icon } from "@mui/material";
import {
  AttachMoney as MoneyIcon,
  ShoppingBasket as OrdersIcon,
  TrendingUp as TrendIcon,
  Inventory2 as ProductIcon,
} from "@mui/icons-material";
import MetricCard from "../components/Dashboard/MetricCard";

export default function Dashboard() {
  return (
    <Box className="p-6">
      <Typography variant="h4" className="text-green-700 font-extrabold mb-6">
        Resumen de Ventas
      </Typography>

      <Grid container spacing={3} className="mb-8">
        <Grid xs={12} sm={6} md={3}>
          <MetricCard
            title="Ingresos Hoy"
            value="$1,250.00"
            icon={<MoneyIcon />}
            color="green"
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <MetricCard
            title="Pedidos (24h)"
            value="85"
            icon={<OrdersIcon />}
            color="blue"
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <MetricCard
            title="Venta Promedio"
            value="$14.71"
            icon={<TrendIcon />}
            color="orange"
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <MetricCard
            title="Prod. Vendidos"
            value="320"
            icon={<ProductIcon />}
            color="red"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Paper className="p-6 rounded-xl shadow-lg h-96">
            <Typography
              variant="h6"
              className="font-semibold mb-4 text-gray-700"
            >
              Ventas por Día (Últimos 7 Días)
            </Typography>
            <Box className="h-[calc(100%-40px)] flex items-center justify-center text-gray-400">
              [Aquí iría el Componente de Gráfico de Líneas]
            </Box>
          </Paper>
        </Grid>

        <Grid xs={12} md={4}>
          <Paper className="p-6 rounded-xl shadow-lg h-96">
            <Typography
              variant="h6"
              className="font-semibold mb-4 text-gray-700"
            >
              Top 5 Productos Vendidos
            </Typography>
            <Box className="h-[calc(100%-40px)] flex items-center justify-center text-gray-400">
              [Aquí iría la Lista/Tabla de Productos]
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
