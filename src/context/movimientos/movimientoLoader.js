import { httpAPIGet } from "../../services/apiService";

export async function movimientosLoader() {
  
  try {
    const movimientosResponse = await httpAPIGet("/movInventario");
    
    const productosResponse = await httpAPIGet("/productos");

    return {
      movimientos: movimientosResponse?.data || [],
      productos: productosResponse?.data || [],
    };
  } catch (error) {
    console.error("ERROR EN LOADER:", error);
    console.error("ERROR MESSAGE:", error.message);
    return { 
      movimientos: [], 
      productos: [],
    };
  }
}