export const calcularPreciosSegunTipo = (
  tipo,
  valor,
  stock,
  precioBase,
  iva,
  productData
) => {
  const stockNumero = Number(stock) || 0;
  const ivaNumero = Number(iva) || 0;
  const precioBaseNumero = precioBase
    ? Number(precioBase.replace(/,/g, ""))
    : 0;
  const gananciaPorcentajeActual = Number(
    productData?.ganancia_porcentaje || 0
  );

  const hayPrecioBase = precioBaseNumero > 0;

  const calcularTodosLosValores = ({
    precioBase = precioBaseNumero,
    gananciaPorc = gananciaPorcentajeActual,
    stock = stockNumero,
    iva = ivaNumero,
  }) => {
    if (!hayPrecioBase) {
      return {
        precio: formatearPrecioInput(String(precioBase)),
        precio_lote: stock ? formatearPrecioCalculado(precioBase * stock) : "",
        ganancia_porcentaje: "",
        ganancia_unidad: "",
        ganancia_valor: "",
        valor_venta: "",
      };
    }

    const precioConIva = precioBase * (1 + iva / 100);
    const precioLote = precioBase * stock;
    const gananciaUnidad = precioConIva * (gananciaPorc / 100);
    const gananciaLote = gananciaUnidad * stock;
    const valorVenta = precioConIva + gananciaUnidad;

    return {
      precio: formatearPrecioInput(String(precioBase)),
      precio_lote: formatearPrecioCalculado(precioLote),
      ganancia_porcentaje: gananciaPorc > 0 ? gananciaPorc.toFixed(2) : "",
      ganancia_unidad:
        gananciaUnidad > 0 ? formatearPrecioCalculado(gananciaUnidad) : "",
      ganancia_valor:
        gananciaLote > 0 ? formatearPrecioCalculado(gananciaLote) : "",
      valor_venta: valorVenta > 0 ? formatearPrecioCalculado(valorVenta) : "",
    };
  };

  switch (tipo) {
    case "stock_inicial": {
      const nuevoStock = Number(valor) || 0;
      return {
        ...calcularTodosLosValores({ stock: nuevoStock }),
        stock_inicial: valor,
      };
    }

    case "precio": {
      const nuevoPrecio = valor ? Number(valor.replace(/,/g, "")) : 0;
      return calcularTodosLosValores({ precioBase: nuevoPrecio });
    }

    case "precio_lote": {
      if (!stockNumero) return null;
      const precioLote = valor ? Number(valor.replace(/,/g, "")) : 0;
      const nuevoPrecioBase = precioLote / stockNumero;
      return calcularTodosLosValores({ precioBase: nuevoPrecioBase });
    }

    case "ganancia_porcentaje": {
      if (!hayPrecioBase) return null;
      const nuevoPorcentaje = Number(valor) || 0;
      return calcularTodosLosValores({ gananciaPorc: nuevoPorcentaje });
    }

    case "ganancia_unidad": {
      if (!hayPrecioBase) return null;
      const gananciaUnidad = valor ? Number(valor.replace(/,/g, "")) : 0;
      const precioConIva = precioBaseNumero * (1 + ivaNumero / 100);
      const nuevoPorcentaje = (gananciaUnidad / precioConIva) * 100;
      return calcularTodosLosValores({ gananciaPorc: nuevoPorcentaje });
    }

    case "ganancia_valor": {
      if (!hayPrecioBase || !stockNumero) return null;
      const gananciaLote = valor ? Number(valor.replace(/,/g, "")) : 0;
      const gananciaUnidad = gananciaLote / stockNumero;
      const precioConIva = precioBaseNumero * (1 + ivaNumero / 100);
      const nuevoPorcentaje = (gananciaUnidad / precioConIva) * 100;
      return calcularTodosLosValores({ gananciaPorc: nuevoPorcentaje });
    }

    case "iva": {
      const nuevoIva = Number(valor) || 0;
      return calcularTodosLosValores({ iva: nuevoIva });
    }

    default:
      return null;
  }
};

const formatearPrecioInput = (valor) => {
  if (!valor || valor === "0" || valor === "0.00") return "";
  return valor
    .toString()
    .replace(/\D/g, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const formatearPrecioCalculado = (numero) => {
  if (!numero || numero === 0) return "";
  return numero.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export { formatearPrecioInput, formatearPrecioCalculado };
