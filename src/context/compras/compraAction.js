import { httpAPIPost, httpAPIPatch } from "../../services/apiService";
import { toast } from "react-toastify";

// Eliminamos 'params' de aquí porque no se usa
export async function compraAction({ request }) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  // === CREAR COMPRA ===
  if (intent === "create") {
    try {
      const productosRaw = formData.get("productos");
      const productos = JSON.parse(productosRaw);

      const data = {
        proveedorId: parseInt(formData.get("proveedorId")),
        productos: productos.map(p => ({
          productoId: p.id,
          cantidad: parseInt(p.cantidad),
          precioCompra: parseFloat(p.precioCompra)
        }))
      };

      await httpAPIPost("/compras", data);
      toast.success("Compra registrada exitosamente");
      return null;
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error al registrar la compra");
      return { error: error.message };
    }
  }

  if (intent === "cancel") {
    const compraId = formData.get("compraId");
    try {
      await httpAPIPatch(`/compras/${compraId}/cancelar`);
      toast.success("Compra cancelada y stock revertido");
      return null;
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error al cancelar la compra");
      return { error: error.message };
    }
  }

  return null;
}