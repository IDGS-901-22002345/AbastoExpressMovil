import { redirect } from "react-router-dom";
import { httpAPIGet } from "../../services/apiService";

export async function authLoader() {
  const token = localStorage.getItem("token");
  if (!token) return redirect("/login");

  try {
    const response = await httpAPIGet("/usuarios/profile");

    if (response.status !== "success" || !response.data) {
      throw new Error("Usuario no encontrado");
    }

    return response.data;
  } catch (error) {
    console.error("Error en authLoader:", error);

    localStorage.removeItem("token");
    return redirect("/login");
  }
}
