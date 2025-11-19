import { redirect } from "react-router-dom";
import { httpAPIPut } from "../../services/apiService";
import { toast } from "react-toastify";

export async function perfilActions({ request }) {
  const form = await request.formData();
  const rol = form.get("rol");

  console.log("🎭 Rol desde form:", rol);

  const payload = {};

  const nombreCompleto = form.get("nombreCompleto")?.trim();
  if (nombreCompleto) payload.nombreCompleto = nombreCompleto;

  const email = form.get("email")?.trim();
  if (email) payload.email = email;

  const password = form.get("password");
  if (password) payload.password = password;

  if (rol === "ADMINTIENDA") {
    const categoriasRaw = form.getAll("categorias");
    const categoriasIds = categoriasRaw
      .filter((id) => id !== "" && id !== null && id !== undefined)
      .map((id) => parseInt(id, 10))
      .filter((id) => !isNaN(id));

    if (categoriasIds.length > 0) {
      payload.categorias = categoriasIds;
    }

    const tienda = {};
    
    const tiendaNombre = form.get("tiendaNombre")?.trim();
    if (tiendaNombre) tienda.nombre = tiendaNombre;

    const tiendaDescripcion = form.get("tiendaDescripcion")?.trim();
    if (tiendaDescripcion) tienda.descripcion = tiendaDescripcion;

    const tiendaDireccion = form.get("tiendaDireccion")?.trim();
    if (tiendaDireccion) tienda.direccion = tiendaDireccion;

    const tiendaTelefono = form.get("tiendaTelefono")?.trim();
    if (tiendaTelefono) tienda.telefono = tiendaTelefono;

    const tiendaEmailContacto = form.get("tiendaEmailContacto")?.trim();
    if (tiendaEmailContacto) tienda.emailContacto = tiendaEmailContacto;

    if (Object.keys(tienda).length > 0) {
      payload.tienda = tienda;
    }
  }

  try {
    const res = await httpAPIPut("/perfil", payload);

    if (res.status !== "success") {
      toast.error(res.error || "Error al actualizar perfil");
      return null;
    }

    toast.success("Perfil actualizado correctamente");
    return redirect("/profile");
  } catch (error) {
    console.error("Error en perfilActions:", error);
    toast.error(error?.response?.data?.error || "Error al actualizar perfil");
    return null;
  }
}