import { redirect } from "react-router-dom";
import { httpAPIGet } from "../../services/apiService";

export async function perfilLoader() {
  try {
    const res = await httpAPIGet("/perfil");

    if (res.status !== "success") {
      return redirect("/login");
    }

    const userData = res.data;

    const rol = userData.rol || "";

    let tienda = null;
    let categorias = [];

    if (rol === "ADMINTIENDA" && userData.tiendaId) {
      tienda = userData.tienda || null;

      const resCategorias = await httpAPIGet("/categoria");

      if (resCategorias.status === "success") {
        categorias = resCategorias.data;
      }
    }

    return {
      user: { ...userData, rol },
      tienda,
      categorias,
    };
  } catch (error) {
    console.error("Error en loader del perfil:", error);
    return redirect("/login");
  }
}