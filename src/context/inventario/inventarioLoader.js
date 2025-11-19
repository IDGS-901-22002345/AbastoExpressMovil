import { httpAPIGet } from "../../services/apiService";

export async function inventarioLoader() {
  try {

    const response = await httpAPIGet('/inventario'); 
    
    return response.data; 

  } catch (error) {
    console.error('❌ Error al cargar el inventario:', error.message);
    throw new Error(error.message || 'Error desconocido al cargar el inventario.');
  }
}