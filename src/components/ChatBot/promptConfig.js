export const procesarDatos = (datos) => {
  // Función para calcular ventas por período
  const calcularVentasPeriodo = (compras, periodo) => {
    return compras.filter(compra => compra.fecha >= periodo.inicio && compra.fecha <= periodo.fin)
                  .reduce((total, compra) => total + compra.monto, 0);
  };

  // Función para obtener productos más vendidos
  const obtenerProductosMasVendidos = (compras, productos) => {
    const conteoProductos = compras.reduce((conteo, compra) => {
      compra.productos.forEach(producto => {
        conteo[producto.id] = (conteo[producto.id] || 0) + producto.cantidad;
      });
      return conteo;
    }, {});

    return productos.map(producto => ({
      ...producto,
      cantidadVendida: conteoProductos[producto.id] || 0
    })).sort((a, b) => b.cantidadVendida - a.cantidadVendida);
  };

  // Función para analizar patrones de compra
  const analizarPatronesCompra = (compras, clientes) => {
    const patrones = clientes.map(cliente => {
      const comprasCliente = compras.filter(compra => compra.clienteId === cliente.id);
      const totalGastado = comprasCliente.reduce((total, compra) => total + compra.monto, 0);
      return {
        clienteId: cliente.id,
        totalGastado,
        numeroCompras: comprasCliente.length
      };
    });

    return patrones;
  };

  return {
    calcularVentasPeriodo,
    obtenerProductosMasVendidos,
    analizarPatronesCompra,
  };
}; 