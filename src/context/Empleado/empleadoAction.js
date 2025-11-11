import { redirect } from "react-router-dom";
import {
  httpAPIPost,
  httpAPIPut,
  httpAPIDelete,
} from "../../services/apiService";
import { toast } from "react-toastify";

export async function createEmpleadoAction({ request }) {
  const formData = await request.formData();
  const data = {
    nombreCompleto: formData.get("nombreCompleto"),
    email: formData.get("email"),
    password: formData.get("password"),
    rol: formData.get("rol"), 
  };

  try {
    const response = await httpAPIPost("/empleados", data);
    toast.success(`Empleado ${response.data.nombreCompleto} creado exitosamente`);
    return redirect("/empleados");
  } catch (error) {
    toast.error(error.message || "Error al crear el empleado");
    return { error: error.message || "Error al crear el empleado" };
  }
}

export async function updateEmpleadoAction({ request, params }) {
  const formData = await request.formData();
  const data = {};

  // Solo incluir campos que tienen valor
  const nombreCompleto = formData.get("nombreCompleto");
  const email = formData.get("email");
  const password = formData.get("password");
  const rol = formData.get("rol");

  if (nombreCompleto) data.nombreCompleto = nombreCompleto;
  if (email) data.email = email;
  if (password) data.password = password;
  if (rol) data.rol = rol;

  try {
    const response = await httpAPIPut(`/empleados/${params.id}`, data);
    toast.success(`Empleado ${response.data.nombreCompleto} actualizado exitosamente`);
    return redirect("/empleados");
  } catch (error) {
    toast.error(error.message || "Error al actualizar empleado");
    return { error: error.message || "Error al actualizar empleado" };
  }
}

export async function deleteEmpleadoAction({ params }) {
  try {
    await httpAPIDelete(`/empleados/${params.id}`);
    toast.success("Empleado eliminado exitosamente");
    return redirect("/empleados");
  } catch (error) {
    toast.error(error.message || "Error al eliminar empleado");
    return { error: error.message || "Error al eliminar empleado" };
  }
}