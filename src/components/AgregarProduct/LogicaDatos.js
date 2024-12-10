export const validarDatosProducto = (productoData) => {
  if (!productoData.categoria) {
    throw new Error("La categoría es requerida");
  }

  if (
    productoData.categoria.toLowerCase() === "nuevo" ||
    productoData.categoria.toLowerCase() === "nueva"
  ) {
    throw new Error(
      'No se permite usar "Nuevo" o "Nueva" como nombre de categoría.'
    );
  }

  Object.entries(productoData).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      throw new Error(`El campo ${key} es requerido`);
    }
    if (typeof value === "number" && isNaN(value)) {
      throw new Error(`El campo ${key} debe ser un número válido`);
    }
  });
};

export const prepararDatosParaGuardar = (productData, categoriaFinal) => {
  return {
    nombre: productData.nombre,
    descripcion: productData.descripcion,
    precio: Number(productData.precio.replace(/,/g, "")),
    precio_lote: Number(productData.precio_lote.replace(/,/g, "")),
    ganancia_porcentaje: Number(productData.ganancia_porcentaje),
    ganancia_valor: Number(productData.ganancia_valor.replace(/,/g, "")),
    ganancia_unidad: Number(productData.ganancia_unidad.replace(/,/g, "")),
    valor_venta: Number(productData.valor_venta.replace(/,/g, "")),
    stock_inicial: Number(productData.stock_inicial),
    iva: Number(productData.iva),
    imagenURL: productData.imagenURL || "",
    categoria: categoriaFinal,
    creacion: new Date(),
    disponible: true,
    ultima_actualizacion: new Date(),
    stock_actual: Number(productData.stock_inicial),
  };
};
