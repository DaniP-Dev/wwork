import { useState, useEffect } from 'react';

const ESTADO_INICIAL = {
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

export const useLogicaProduct = (servicioProduct) => {
    const [productData, setProductData] = useState(ESTADO_INICIAL);
    const [categorias, setCategorias] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [mensajeExito, setMensajeExito] = useState(null);
    const [nuevaCategoria, setNuevaCategoria] = useState('');

    useEffect(() => {
        const unsubscribe = servicioProduct.observarCategorias(setCategorias);
        return () => unsubscribe();
    }, [servicioProduct]);

    const formatearPrecioInput = (valor) => {
        if (!valor) return '';
        
        // Elimina todo excepto números y punto decimal
        let numeroLimpio = valor.replace(/[^\d.]/g, '');
        
        // Maneja múltiples puntos decimales
        const partes = numeroLimpio.split('.');
        if (partes.length > 2) {
            numeroLimpio = partes[0] + '.' + partes[1];
        }

        // Separa enteros y decimales
        const [enteros, decimales] = numeroLimpio.split('.');
        
        // Formatea la parte entera con separadores de miles
        let enterosFormateados = enteros;
        if (enteros.length > 3) {
            enterosFormateados = enteros.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        
        // Reconstruye el número con los decimales si existen
        if (decimales !== undefined) {
            return `${enterosFormateados}.${decimales.slice(0, 2)}`;
        }
        
        return enterosFormateados;
    };

    const calcularGananciasYVenta = (precioLote, gananciaPorcentaje, stock, ivaOverride = null) => {
        if (!precioLote || !stock) return { gananciaValor: '', gananciaUnidad: '', valorVenta: '' };
        
        const precioLoteNumero = Number(precioLote.replace(/,/g, ''));
        const gananciaPorcentajeNumero = Number(gananciaPorcentaje || 0);
        const ivaNumero = ivaOverride !== null ? Number(ivaOverride) : Number(productData.iva || 0);
        
        // Calcula la ganancia total del lote
        const gananciaValor = (precioLoteNumero * gananciaPorcentajeNumero) / 100;
        
        // Calcula la ganancia por unidad
        const gananciaUnidad = gananciaValor / stock;
        
        // Calcula el valor de venta por unidad (incluyendo IVA)
        const subtotalVentaUnidad = (precioLoteNumero + gananciaValor) / stock;
        const valorVentaUnidad = subtotalVentaUnidad * (1 + (ivaNumero / 100));
        
        return {
            gananciaValor: formatearPrecioCalculado(gananciaValor),
            gananciaUnidad: formatearPrecioCalculado(gananciaUnidad),
            valorVenta: formatearPrecioCalculado(valorVentaUnidad)
        };
    };

    const calcularPrecio = (tipo, valor, stockActual) => {
        if (!stockActual || stockActual <= 0 || stockActual === '0') return;
        
        const stock = Number(stockActual);
        const numeroValor = Number(valor.replace(/,/g, ''));

        if (tipo === 'unidad') {
            const precioLote = formatearPrecioCalculado(numeroValor * stock);
            const { gananciaValor, gananciaUnidad, valorVenta } = calcularGananciasYVenta(
                precioLote, 
                productData.ganancia_porcentaje, 
                stock
            );
            
            setProductData(prev => ({
                ...prev,
                precio: formatearPrecioInput(valor),
                precio_lote: precioLote,
                ganancia_valor: gananciaValor,
                ganancia_unidad: gananciaUnidad,
                valor_venta: valorVenta
            }));
        } else if (tipo === 'lote') {
            const precioUnidad = formatearPrecioCalculado(numeroValor / stock);
            const { gananciaValor, gananciaUnidad, valorVenta } = calcularGananciasYVenta(
                valor, 
                productData.ganancia_porcentaje, 
                stock
            );
            
            setProductData(prev => ({
                ...prev,
                precio: precioUnidad,
                precio_lote: formatearPrecioInput(valor),
                ganancia_valor: gananciaValor,
                ganancia_unidad: gananciaUnidad,
                valor_venta: valorVenta
            }));
        }
    };

    const formatearPrecioCalculado = (valor) => {
        if (!valor) return '';
        const numero = Number(valor);
        const partes = numero.toFixed(2).split('.');
        let enterosFormateados = partes[0];
        if (partes[0].length > 3) {
            enterosFormateados = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        return `${enterosFormateados}.${partes[1]}`;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        
        if (name === 'iva') {
            // Primero actualizamos el IVA en el estado
            setProductData(prev => {
                // Aseguramos que tenemos los valores necesarios para el cálculo
                if (prev.precio_lote && prev.stock_inicial > 0) {
                    const { gananciaValor, gananciaUnidad, valorVenta } = calcularGananciasYVenta(
                        prev.precio_lote,
                        prev.ganancia_porcentaje,
                        prev.stock_inicial,
                        value // Pasamos el nuevo valor del IVA directamente
                    );
                    
                    return {
                        ...prev,
                        iva: value,
                        ganancia_valor: gananciaValor,
                        ganancia_unidad: gananciaUnidad,
                        valor_venta: valorVenta
                    };
                }
                
                return {
                    ...prev,
                    iva: value
                };
            });
        } else if (name === 'ganancia_porcentaje') {
            const porcentaje = Math.min(9999, Math.max(0, Number(value) || 0));
            setProductData(prev => {
                const { gananciaValor, gananciaUnidad, valorVenta } = calcularGananciasYVenta(
                    prev.precio_lote,
                    porcentaje,
                    prev.stock_inicial
                );
                
                return {
                    ...prev,
                    ganancia_porcentaje: porcentaje.toString(),
                    ganancia_valor: gananciaValor,
                    ganancia_unidad: gananciaUnidad,
                    valor_venta: valorVenta
                };
            });
        } else if (name === 'ganancia_valor') {
            const valorNumerico = Number(value.replace(/,/g, ''));
            const precioLoteNumero = Number(productData.precio_lote.replace(/,/g, ''));
            
            if (precioLoteNumero > 0) {
                const porcentaje = (valorNumerico * 100) / precioLoteNumero;
                const { gananciaUnidad, valorVenta } = calcularGananciasYVenta(
                    productData.precio_lote,
                    porcentaje,
                    productData.stock_inicial
                );
                
                setProductData(prev => ({
                    ...prev,
                    ganancia_valor: formatearPrecioInput(value),
                    ganancia_unidad: gananciaUnidad,
                    ganancia_porcentaje: Math.min(9999, porcentaje).toFixed(2),
                    valor_venta: valorVenta
                }));
            }
        } else if (name === 'ganancia_unidad') {
            const valorUnidadNumerico = Number(value.replace(/,/g, ''));
            const stock = Number(productData.stock_inicial);
            const valorTotalGanancia = valorUnidadNumerico * stock;
            const precioLoteNumero = Number(productData.precio_lote.replace(/,/g, ''));
            
            if (precioLoteNumero > 0 && stock > 0) {
                const porcentaje = (valorTotalGanancia * 100) / precioLoteNumero;
                const valorVentaUnidad = (precioLoteNumero / stock) + valorUnidadNumerico;
                const valorVentaConIva = valorVentaUnidad * (1 + (Number(productData.iva) / 100));
                
                setProductData(prev => ({
                    ...prev,
                    ganancia_unidad: formatearPrecioInput(value),
                    ganancia_valor: formatearPrecioCalculado(valorTotalGanancia),
                    ganancia_porcentaje: Math.min(9999, porcentaje).toFixed(2),
                    valor_venta: formatearPrecioCalculado(valorVentaConIva)
                }));
            }
        } else if (name === 'precio') {
            calcularPrecio('unidad', value, productData.stock_inicial);
        } else if (name === 'precio_lote') {
            calcularPrecio('lote', value, productData.stock_inicial);
        } else if (name === 'stock_inicial') {
            const newValue = value === '' ? '' : Math.max(0, parseInt(value) || 0).toString();
            setProductData(prev => {
                const newData = {
                    ...prev,
                    stock_inicial: newValue,
                    precio: newValue === '0' ? '' : prev.precio,
                    precio_lote: newValue === '0' ? '' : prev.precio_lote,
                    ganancia_valor: ''
                };
                if (prev.precio && newValue !== '0') {
                    calcularPrecio('unidad', prev.precio, newValue);
                }
                return newData;
            });
        } else {
            setProductData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setMensajeExito(null);

        try {
            const categoriaFinal = productData.categoria === 'nueva' 
                ? nuevaCategoria.toLowerCase().trim() 
                : productData.categoria;

            if (categoriaFinal.toLowerCase() === 'nuevo' || categoriaFinal.toLowerCase() === 'nueva') {
                throw new Error('No se permite usar "Nuevo" o "Nueva" como nombre de categoría.');
            }

            const productoParaGuardar = {
                ...productData,
                categoria: categoriaFinal,
                precio: Number(productData.precio.replace(/,/g, '')),
                precio_lote: Number(productData.precio_lote.replace(/,/g, '')),
                stock_inicial: Number(productData.stock_inicial),
                creacion: new Date(),
            };

            await servicioProduct.agregarProducto(productoParaGuardar);
            setProductData(ESTADO_INICIAL);
            setMensajeExito('¡Producto agregado exitosamente!');
            
            setTimeout(() => setMensajeExito(null), 3000);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        productData,
        categorias,
        nuevaCategoria,
        isSubmitting,
        error,
        mensajeExito,
        handleChange,
        handleSubmit
    };
};
