import { httpAPIGet } from "../../services/apiService";
import { toast } from "react-toastify";

export async function mermaLoader() {
  try {
    // Ejecutamos ambas peticiones en paralelo para optimizar
    const [mermasRes, productosRes] = await Promise.all([
      httpAPIGet("/mermas"),
      httpAPIGet("/productos"),
    ]);

    return {
      mermas: mermasRes.data || [],
      productos: productosRes.data || [],
    };
  } catch (error) {
    console.error("Error cargando mermas:", error);
    toast.error("Error al cargar los datos de mermas");
    return { mermas: [], productos: [] };
  }
}