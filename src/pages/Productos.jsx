import React from "react";
import { Paper, Typography } from "@mui/material";

const Productos = () => {
  return (
    <div>
      <Paper className="p-6 rounded-xl shadow-md bg-white">
        <Typography variant="h4" className="text-green-700 font-bold mb-4">
          Productos
        </Typography>
        <Typography>Bienvenido a SmartLogix. Aquí irá Productos</Typography>
      </Paper>
    </div>
  );
};

export default Productos;
