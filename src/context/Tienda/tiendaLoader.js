import { redirect } from "react-router-dom";
import { httpAPIGet } from "../../services/apiService";

export async function tiendaLoader() {
  try {
    const response = await httpAPIGet("/tienda");

    if (response.status !== "success" || !response.data) {
      throw new Error("Tiendas no encontradas");
    }

    return response.data;
  } catch (error) {
    console.error("Error en tiendaLoader:", error);

    localStorage.removeItem("token");
    return redirect("/login");
  }
}
