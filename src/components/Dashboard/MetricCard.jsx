import React from "react";
import { Typography, Paper, Box } from "@mui/material";

const MetricCard = ({ title, value, icon: IconComponent, color, subtitle }) => {
  const colorClasses = {
    blue: "text-blue-700 bg-blue-50",
    green: "text-green-700 bg-green-50",
    orange: "text-orange-700 bg-orange-50",
    red: "text-red-700 bg-red-50",
    purple: "text-purple-700 bg-purple-50",
    yellow: "text-yellow-700 bg-yellow-50",
  };

  const iconColorClasses = {
    blue: "text-blue-500",
    green: "text-green-500",
    orange: "text-orange-500",
    red: "text-red-500",
    purple: "text-purple-500",
    yellow: "text-yellow-500",
  };

  return (
    <Paper
      className="p-4 rounded-xl shadow-lg transition-transform duration-300 hover:scale-[1.02] h-full"
      elevation={3}
    >
      <Box className="flex items-center justify-between">
        <Box className="flex-1">
          <Typography variant="subtitle2" className="text-gray-500 font-medium">
            {title}
          </Typography>
          <Typography
            variant="h4"
            className={`font-extrabold mt-2 ${colorClasses[color]?.split(" ")[0] || "text-gray-700"
              }`}
          >
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" className="text-gray-400 mt-1">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box
          className={`p-3 rounded-full ${colorClasses[color]?.split(" ")[1] || "bg-gray-50"
            }`}
        >
          {IconComponent && (
            <IconComponent
              className={`${iconColorClasses[color] || "text-gray-500"}`}
              style={{ fontSize: 32 }}
            />
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default MetricCard;

