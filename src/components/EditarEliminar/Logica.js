import { useState, useEffect } from 'react';

export const useLogicaEditarEliminar = (servicio) => {
    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [paginaActual, setPaginaActual] = useState(1);
    const [productosPerPage] = useState(8);
    const [error, setError] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');
    const [productoEditando, setProductoEditando] = useState(null);
    const [nuevaCategoria, setNuevaCategoria] = useState('');

    useEffect(() => {
        const unsubscribe = servicio.observarProductos((productos) => {
            setProductos(productos);
            setProductosFiltrados(productos);
        });

        servicio.obtenerCategorias().then(setCategorias);

        return () => unsubscribe();
    }, [servicio]);

    const filtrarProductos = (termino) => {
        const filtrados = productos.filter(producto =>
            producto.nombre.toLowerCase().includes(termino.toLowerCase()) ||
            producto.descripcion.toLowerCase().includes(termino.toLowerCase())
        );
        setProductosFiltrados(filtrados);
        setPaginaActual(1);
    };

    const obtenerProductosPaginados = () => {
        const indexUltimo = paginaActual * productosPerPage;
        const indexPrimero = indexUltimo - productosPerPage;
        return productosFiltrados.slice(indexPrimero, indexUltimo);
    };

    const handleGuardarEdicion = async (producto) => {
        try {
            const datosActualizados = {
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                imagenURL: producto.imagenURL,
                categoria: producto.categoria === 'nueva' ? nuevaCategoria : producto.categoria,
                disponible: producto.disponible,
                precio: producto.precio,
                precio_lote: producto.precio_lote,
                ganancia_porcentaje: producto.ganancia_porcentaje,
                ganancia_valor: producto.ganancia_valor,
                ganancia_unidad: producto.ganancia_unidad,
                valor_venta: producto.valor_venta,
                stock_inicial: producto.stock_inicial,
                iva: producto.iva
            };

            await servicio.actualizarProducto(producto.id, datosActualizados);
            setProductoEditando(null);
            setMensajeExito('Producto actualizado exitosamente');
        } catch (error) {
            setError(error.message);
        }
    };

    return {
        productos: obtenerProductosPaginados(),
        totalProductos: productosFiltrados.length,
        categorias,
        paginaActual,
        productosPerPage,
        error,
        mensajeExito,
        productoEditando,
        nuevaCategoria,
        filtrarProductos,
        setPaginaActual,
        setError,
        setMensajeExito,
        setProductoEditando,
        setNuevaCategoria,
        handleGuardarEdicion,
        busqueda,
        setBusqueda
    };
};
