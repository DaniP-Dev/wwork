import { useState, useEffect } from "react";

export const ESTADO_INICIAL = {
  nombre: "",
  descripcion: "",
  precio: "",
  precio_lote: "",
  ganancia_porcentaje: "",
  ganancia_valor: "",
  ganancia_unidad: "",
  valor_venta: "",
  categoria: "calzado",
  creacion: new Date(),
  stock_inicial: 100,
  iva: "0",
  imagenURL: "",
};

export const useEstadosFormulario = (servicioProduct) => {
  const [productData, setProductData] = useState(ESTADO_INICIAL);
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);

  useEffect(() => {
    const unsubscribe = servicioProduct.observarCategorias(setCategorias);
    return () => unsubscribe();
  }, [servicioProduct]);

  const resetearFormulario = () => {
    setProductData(ESTADO_INICIAL);
    setNuevaCategoria("");
    setError(null);
    setMensajeExito("¡Producto agregado exitosamente!");
    setTimeout(() => setMensajeExito(null), 3000);
  };

  return {
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
  };
};
