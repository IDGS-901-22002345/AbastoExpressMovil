import { redirect } from "react-router-dom";
import {
  httpAPIPost,
  httpAPIPut,
  httpAPIDelete,
} from "../../services/apiService";
import { toast } from "react-toastify";

export async function createProductoAction({ request }) {
  const formData = await request.formData();
  const data = {
    nombre: formData.get("nombre"),
    descripcion: formData.get("descripcion"),
    precio: formData.get("precio"),
    imagen: formData.get("imagen"),
    unidadMedida: formData.get("unidadMedida") || undefined,
  };

  try {
    const response = await httpAPIPost("/productos", data);
    toast.success(`Producto ${response.data.nombre} creado exitosamente`);
    return redirect("/productos");
  } catch (error) {
    toast.error(error.message || "Error al crear el producto");
    return { error: error.message || "Error al crear el producto" };
  }
}

export async function updateProductoAction({ request, params }) {
  const formData = await request.formData();
  const data = {};

  const nombre = formData.get("nombre");
  const descripcion = formData.get("descripcion");
  const precio = formData.get("precio");
  const imagen = formData.get("imagen");
  const unidadMedida = formData.get("unidadMedida");

  if (nombre) data.nombre = nombre;
  if (descripcion) data.descripcion = descripcion;
  if (precio) data.precio = precio;
  if (imagen) data.imagen = imagen;
  if (unidadMedida) data.unidadMedida = unidadMedida;

  try {
    const response = await httpAPIPut(`/productos/${params.id}`, data);
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