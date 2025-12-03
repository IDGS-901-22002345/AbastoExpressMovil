import { httpAPIGet } from "../../services/apiService";
import { redirect } from "react-router-dom";

export async function pedidosLoader() {
  try {
    const userResponse = await httpAPIGet("/perfil");

    if (userResponse.status !== "success") {
      return redirect("/login");
    }

    const user = userResponse.data;

    const pedidosResponse = await httpAPIGet("/pedidos");

    const pedidos =
      pedidosResponse.status === "success" ? pedidosResponse.data : [];

    return {
      user,
      pedidos,
    };
  } catch (error) {
    console.error("ERROR EN LOADER DE PEDIDOS:", error);
    return redirect("/login");
  }
}
