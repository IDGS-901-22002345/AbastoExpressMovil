import { httpAPIGet } from "../../services/apiService";
import { toast } from "react-toastify";

export async function compraLoader() {
  try {
    const [comprasRes, proveedoresRes, productosRes] = await Promise.all([
      httpAPIGet("/compras"),
      httpAPIGet("/proveedores"),
      httpAPIGet("/productos"),
    ]);

    return {
      compras: comprasRes.data || [],
      proveedores: proveedoresRes.data || [],
      productos: productosRes.data || [],
    };
  } catch (error) {
    console.error("Error cargando datos de compras:", error);
    toast.error("Error al cargar los datos");
    return { compras: [], proveedores: [], productos: [] };
  }
}