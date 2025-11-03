import { redirect } from "react-router-dom";
import { httpAPIPost } from "../../services/apiService";
import { toast } from "react-toastify";

export async function loginAction({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const response = await httpAPIPost("/login", { email, password });

    localStorage.setItem("token", response.token);
    toast.success(`Bienvenido ${response.user.nombreCompleto}`);
    return redirect("/");
  } catch (error) {
    toast.error(error.message || "Error al iniciar sesión");
    return null;
  }
}
