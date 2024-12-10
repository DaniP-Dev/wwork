import { useEstadosFormulario } from "./LogicaEstadosFormulario";
import {
  calcularPreciosSegunTipo,
  calcularGananciasYVenta,
} from "./LogicaPrecios";
import { validarDatosProducto, prepararDatosParaGuardar } from "./LogicaDatos";

export const useLogicaProduct = (servicioProduct) => {
  const {
    productData,
    setProductData,
    categorias,
    nuevaCategoria,
    setNuevaCategoria,
    isSubmitting,
    setIsSubmitting,
    error,
    setError,
    mensajeExito,
    setMensajeExito,
    resetearFormulario,
  } = useEstadosFormulario(servicioProduct);

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Lista de campos que disparan recálculos
    const camposCalculables = [
      "ganancia_porcentaje",
      "ganancia_unidad",
      "ganancia_valor",
      "precio",
      "precio_lote",
      "stock_inicial",
      "iva",
    ];

    if (camposCalculables.includes(name)) {
      const nuevosPrecios = calcularPreciosSegunTipo(
        name,
        value,
        productData.stock_inicial,
        productData.precio,
        productData.iva
      );

      if (nuevosPrecios) {
        setProductData((prev) => ({
          ...prev,
          ...nuevosPrecios,
          [name]: value, // Aseguramos que el campo editado mantenga el valor ingresado
        }));
      }
    } else {
      setProductData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMensajeExito(null);

    try {
      const categoriaFinal =
        productData.categoria === "nueva"
          ? nuevaCategoria.toLowerCase().trim()
          : productData.categoria.toLowerCase().trim();

      validarDatosProducto({ ...productData, categoria: categoriaFinal });

      if (productData.categoria === "nueva") {
        await servicioProduct.agregarCategoria(categoriaFinal);
      }

      const productoParaGuardar = prepararDatosParaGuardar(
        productData,
        categoriaFinal
      );
      await servicioProduct.agregarProducto(productoParaGuardar);

      resetearFormulario();
    } catch (error) {
      console.error("Error al guardar:", error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    productData,
    categorias,
    nuevaCategoria,
    setNuevaCategoria,
    isSubmitting,
    error,
    mensajeExito,
    handleChange,
    handleSubmit,
  };
};
