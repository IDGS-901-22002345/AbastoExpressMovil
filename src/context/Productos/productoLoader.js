import { redirect } from "react-router-dom";
import { httpAPIGet } from "../../services/apiService";

export async function productosLoader() {
  try {
    const response = await httpAPIGet("/productos");
    
    if (response.status !== "success" || !response.data) {
      throw new Error("Productos no encontrados");
    }
    
    return response.data;
  } catch (error) {
    console.error("Error en productosLoader:", error);
    
    if (error.statusCode === 401 || error.status === 401) {
      localStorage.removeItem("token");
      return redirect("/login");
    }
    
    if (error.statusCode === 403 || error.status === 403) {
      return redirect("/dashboard");
    }
    
    return [];
  }
}

export async function productoByIdLoader({ params }) {
  try {
    const response = await httpAPIGet(`/productos/${params.id}`);
    
    if (response.status !== "success" || !response.data) {
      throw new Error("Producto no encontrado");
    }
    
    return response.data;
  } catch (error) {
    console.error("Error en productoByIdLoader:", error);
    
    if (error.statusCode === 401 || error.status === 401) {
      localStorage.removeItem("token");
      return redirect("/login");
    }
    
    if (error.statusCode === 403 || error.statusCode === 404) {
      return redirect("/productos");
    }
    
    throw new Response("Error al cargar el producto", { status: 500 });
  }
}