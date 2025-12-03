import { httpAPIGet } from "../../services/apiService";

export async function ventasLoader() {
  try {
    const ventasResponse = await httpAPIGet("/ventas");

    return ventasResponse?.data || [];
  } catch (error) {
    console.error("ERROR EN LOADER DE Ventas:", error);
    console.error("ERROR MESSAGE:", error.message);
    return [];
  }
}
