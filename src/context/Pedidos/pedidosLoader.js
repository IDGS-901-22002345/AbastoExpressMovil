import { httpAPIGet } from "../../services/apiService";

export async function pedidosLoader() {
  try {
    const pedidosResponse = await httpAPIGet("/pedidos");

    return pedidosResponse?.data || [];
  } catch (error) {
    console.error("ERROR EN LOADER DE PEDIDOS:", error);
    console.error("ERROR MESSAGE:", error.message);
    return [];
  }
}