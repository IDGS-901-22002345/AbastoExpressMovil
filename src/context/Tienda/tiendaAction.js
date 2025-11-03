import { redirect } from "react-router-dom";
import {
  httpAPIPost,
  httpAPIPut,
  httpAPIDelete,
} from "../../services/apiService";
import { toast } from "react-toastify";

export async function createTiendaAction({ request }) {
  const formData = await request.formData();
  const data = {
    nombre: formData.get("nombre"),
    descripcion: formData.get("descripcion"),
    direccion: formData.get("direccion"),
    telefono: formData.get("telefono"),
    emailContacto: formData.get("emailContacto"),
    logoUrl: formData.get("logoUrl"),
    empleados: {
      nombreCompleto: formData.get("adminNombre"),
      email: formData.get("adminEmail"),
      password: formData.get("adminPassword"),
    },
  };

  try {
    const response = await httpAPIPost("/tienda", data);
    toast.success(`Tienda ${response.nombre} creada`);
    return redirect("/tiendas");
  } catch (error) {
    return { error: error.message || "Error al crear la tienda" };
  }
}

export async function updateTiendaAction({ request, params }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    const response = await httpAPIPut(`/tienda/${params.id}`, data);
    toast.success(`Tienda ${response.nombre} actualizada`);
    return redirect("/tiendas");
  } catch (error) {
    toast.error(error.message || "Error al actualizar tienda");
    return null;
  }
}

export async function deleteTiendaAction({ params }) {
  try {
    await httpAPIDelete(`/tienda/${params.id}`);
    toast.success("Tienda eliminada");
    return redirect("/tiendas");
  } catch (error) {
    toast.error(error.message || "Error al eliminar tienda");
    return null;
  }
}
