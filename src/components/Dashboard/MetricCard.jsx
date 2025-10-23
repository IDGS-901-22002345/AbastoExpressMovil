import React from "react";
import { Typography, Paper, Grid, Box, Icon } from "@mui/material";

const MetricCard = ({ title, value, icon, color }) => {
  return (
    <div>
      {" "}
      <Paper
        className="p-4 rounded-xl shadow-lg transition-transform duration-300 hover:scale-[1.02] h-full"
        elevation={3}
      >
        <Box className="flex items-center justify-between">
          <Box>
            <Typography
              variant="subtitle1"
              className="text-gray-500 font-medium"
            >
              {title}
            </Typography>
            <Typography
              variant="h5"
              className={`font-extrabold mt-1 text-${color}-700`}
            >
              {value}
            </Typography>
          </Box>
          <Icon className={`text-${color}-500 text-4xl`}>{icon}</Icon>
        </Box>
      </Paper>
    </div>
  );
};

export default MetricCard;
