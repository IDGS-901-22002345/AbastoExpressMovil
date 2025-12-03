import { redirect } from "react-router-dom";
import { httpAPIPatch } from "../../services/apiService";
import { toast } from "react-toastify";

export async function pagarPedidoAction({ request }) {
  try {
    const formData = await request.formData();
    const pedidoId = formData.get("pedidoId");

    if (!pedidoId) throw new Error("ID de pedido no enviado");

    await httpAPIPatch(`/pedidos/${pedidoId}`, {});

    toast.success("Pedido pagado correctamente");
    return redirect("/ventas");
  } catch (error) {
    toast.error(error.message || "Error al pagar el pedido");
    return { error: error.message || "Error al pagar el pedido" };
  }
}

export async function cancelarPedidoAction({ request }) {
  try {
    const formData = await request.formData();
    const pedidoId = formData.get("pedidoId");

    if (!pedidoId) throw new Error("ID de pedido no enviado");
    await httpAPIPatch(`/pedidos/cancelar/${pedidoId}`, {});
    toast.success("Pedido cancelado correctamente");
    return redirect("/pedidos");
  } catch (error) {
    toast.error(error.message || "Error al cancelar el pedido");
    return { error: error.message || "Error al cancelar el pedido" };
  }
}
