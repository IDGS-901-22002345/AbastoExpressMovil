import { redirect } from "react-router-dom";
import { httpAPIGet } from "../../services/apiService";

export async function empleadosLoader() {
  try {
    const response = await httpAPIGet("/empleados");
    
    if (response.status !== "success" || !response.data) {
      throw new Error("Empleados no encontrados");
    }
    
    return response.data;
  } catch (error) {
    console.error("Error en empleadosLoader:", error);
    
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

export async function empleadoByIdLoader({ params }) {
  try {
    const response = await httpAPIGet(`/empleados/${params.id}`);
    
    if (response.status !== "success" || !response.data) {
      throw new Error("Empleado no encontrado");
    }
    
    return response.data;
  } catch (error) {
    console.error("Error en empleadoByIdLoader:", error);
    
    if (error.statusCode === 401 || error.status === 401) {
      localStorage.removeItem("token");
      return redirect("/login");
    }
    
    if (error.statusCode === 403 || error.statusCode === 404) {
      return redirect("/empleados");
    }
    
    throw new Response("Error al cargar el empleado", { status: 500 });
  }
}