import { redirect } from "react-router-dom";
import { httpAPIPost } from "../../services/apiService";
import { toast } from "react-toastify";

export async function createMovimientoAction({ request }) {
  const formData = await request.formData();
  
  const data = {
    productoId: parseInt(formData.get("productoId")),
    tipo: formData.get("tipo"),
    cantidad: parseFloat(formData.get("cantidad")),
    razon: formData.get("razon") || undefined,
  };

  try {
    const response = await httpAPIPost("/movInventario", data);
    
    const tipoTexto = data.tipo === "ENTRADA" ? "entrada de" : "salida de";
    toast.success(
      `Movimiento de ${tipoTexto} ${data.cantidad} unidades registrado exitosamente`
    );
    
    return redirect("/movimientos");
  } catch (error) {
    const errorMsg = error.message || "Error al registrar el movimiento";
    toast.error(errorMsg);
    return { error: errorMsg };
  }
}