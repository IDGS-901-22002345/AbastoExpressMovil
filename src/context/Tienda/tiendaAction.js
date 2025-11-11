import { redirect } from "react-router-dom";
import {
  httpAPIGet,
  httpAPIPost,
  httpAPIPut,
  httpAPIDelete,
} from "../../services/apiService";
import { toast } from "react-toastify";

export async function fetchCategorias() {
  try {
    const data = await httpAPIGet("/categoria");
    return data.data || [];
  } catch (error) {
    console.error("❌ Error al obtener categorías:", error);
    toast.error("No se pudieron cargar las categorías");
    return [];
  }
}

export async function createTiendaAction({ request }) {
  const formData = await request.formData();

  // 🔍 DEBUG: Ver todo lo que viene en el FormData
  console.log("=== FormData Debug ===");
  for (let [key, value] of formData.entries()) {
    console.log(key, ":", value);
  }
  console.log("====================");

  // 🧩 Obtener todas las categorías del FormData
  const categoriasIds = formData.getAll("categorias[]")
    .map((id) => Number(id))
    .filter((id) => !isNaN(id));

  console.log("📦 Categorías IDs procesados:", categoriasIds);

  if (!categoriasIds.length) {
    toast.error("Debes seleccionar al menos una categoría");
    return null;
  }

  const data = {
    nombre: formData.get("nombre"),
    descripcion: formData.get("descripcion"),
    direccion: formData.get("direccion"),
    telefono: formData.get("telefono"),
    emailContacto: formData.get("emailContacto"),
    logoUrl: formData.get("logoUrl"),
    categoriasIds,
    empleados: {
      nombreCompleto: formData.get("adminNombre"),
      email: formData.get("adminEmail"),
      password: formData.get("adminPassword"),
    },
  };

  console.log("📤 Data a enviar:", JSON.stringify(data, null, 2));

  try {
    const response = await httpAPIPost("/tienda", data);
    const tienda = response?.data?.data || response?.data || response;

    toast.success(`🏪 Tienda "${tienda.nombre}" creada con éxito`);
    return redirect("/tiendas");
  } catch (error) {
    console.error("❌ Error al crear tienda:", error);

    const msg =
      error?.response?.data?.error ||
      error.message ||
      "Error al crear la tienda";

    toast.error(msg);
    return null;
  }
}

export async function updateTiendaAction({ request, params }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    const response = await httpAPIPut(`/tienda/${params.id}`, data);
    const tienda = response?.data || response;

    toast.success(`✅ Tienda "${tienda.nombre}" actualizada`);
    return redirect("/tiendas");
  } catch (error) {
    console.error("❌ Error al actualizar tienda:", error);
    toast.error(error.message || "Error al actualizar tienda");
    return null;
  }
}

export async function deleteTiendaAction({ params }) {
  try {
    await httpAPIDelete(`/tienda/${params.id}`);
    toast.success("🗑️ Tienda eliminada correctamente");
    return redirect("/tiendas");
  } catch (error) {
    console.error("❌ Error al eliminar tienda:", error);
    toast.error(error.message || "Error al eliminar tienda");
    return null;
  }
}