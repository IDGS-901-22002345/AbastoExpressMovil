import React from "react";
import { Paper, Typography } from "@mui/material"; // 🔹 IMPORTANTE

const Profile = () => {
  return (
    <div>
      <Paper className="p-6 rounded-xl shadow-md bg-white">
        <Typography variant="h4" className="text-green-700 font-bold mb-4">
          Perfil
        </Typography>
        <Typography>Bienvenido a SmartLogix. Aquí irá el perfil</Typography>
      </Paper>
    </div>
  );
};

export default Profile;
