import { redirect } from "react-router-dom";
import {
  httpAPIPostFormData,
  httpAPIPutFormData,
  httpAPIDelete,
} from "../../services/apiService";
import { toast } from "react-toastify";

export async function createProductoAction({ request }) {
  const formData = await request.formData();
  try {
    const response = await httpAPIPostFormData("/productos", formData);
    toast.success(`Producto ${response.data.nombre} creado exitosamente`);
    return redirect("/productos");
  } catch (error) {
    toast.error(error.message || "Error al crear el producto");
    return { error: error.message || "Error al crear el producto" };
  }
}

export async function updateProductoAction({ request, params }) {
  const formData = await request.formData();
  try {
    const response = await httpAPIPutFormData(`/productos/${params.id}`, formData);
    toast.success(`Producto ${response.data.nombre} actualizado exitosamente`);
    return redirect("/productos");
  } catch (error) {
    toast.error(error.message || "Error al actualizar producto");
    return { error: error.message || "Error al actualizar producto" };
  }
}

export async function deleteProductoAction({ params }) {
  try {
    await httpAPIDelete(`/productos/${params.id}`);
    toast.success("Producto eliminado exitosamente");
    return redirect("/productos");
  } catch (error) {
    toast.error(error.message || "Error al eliminar producto");
    return { error: error.message || "Error al eliminar producto" };
  }
}