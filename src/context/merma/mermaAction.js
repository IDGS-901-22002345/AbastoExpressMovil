import { httpAPIPost } from "../../services/apiService";
import { toast } from "react-toastify";

export async function createMermaAction({ request }) {
  const formData = await request.formData();
  
  // Convertimos los datos del FormData al formato que espera el backend
  const data = {
    productoId: parseInt(formData.get("productoId")),
    cantidad: parseInt(formData.get("cantidad")),
    motivo: formData.get("motivo"),
    nota: formData.get("nota") || undefined,
  };

  try {
    // Solo esperamos a que termine, no necesitamos guardar la respuesta si no la usamos
    await httpAPIPost("/mermas", data);
    
    toast.success(`Merma registrada correctamente. Stock actualizado.`);
    return null; // Retornamos null para quedarnos en la misma página y que el loader recargue
  } catch (error) {
    const errorMsg = error.message || "Error al registrar la merma";
    toast.error(errorMsg);
    return { error: errorMsg };
  }
}