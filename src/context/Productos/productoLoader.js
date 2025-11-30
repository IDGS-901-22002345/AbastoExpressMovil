import { redirect } from "react-router-dom";
import { httpAPIGet } from "../../services/apiService";

export async function productosLoader() {
  try {
    const [productosResponse, categoriasResponse] = await Promise.all([
      httpAPIGet("/productos"),
      httpAPIGet("/categorias-productos"),
    ]);

    console.log("productosResponse:", productosResponse);
    console.log("categoriasResponse:", categoriasResponse);

    return {
      producto: {  
        productos: productosResponse.data || [],
        categorias: categoriasResponse.data || [],
      }
    };
  } catch (error) {
    console.error("Error loading productos:", error);
    return {
      producto: {
        productos: [],
        categorias: [],
      }
    };
  }
}

export async function productoByIdLoader({ params }) {
  try {
    const [productoResponse, categoriasResponse] = await Promise.all([
      httpAPIGet(`/productos/${params.id}`),
      httpAPIGet("/categorias-productos")
    ]);

    console.log("productoResponse:", productoResponse);
    console.log("categoriasResponse:", categoriasResponse);

    if (!productoResponse?.data) {
      throw new Error("Producto no encontrado");
    }

    if (!categoriasResponse?.data) {
      throw new Error("Categorías no encontradas");
    }

    return {
      producto: {
        ...productoResponse.data,
        categoriasProducto: categoriasResponse.data  
      }
    };

  } catch (error) {
    console.error("Error en productoByIdLoader:", error);

    if (error.status === 401) {
      localStorage.removeItem("token");
      return redirect("/login");
    }

    if (error.status === 403 || error.status === 404) {
      return redirect("/productos");
    }

    throw new Response("Error al cargar el producto", { status: 500 });
  }
}
