"use client";

import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const EliminarEditar = ({ onProductChange }) => {
    const [productos, setProductos] = useState([]);
    const [productoEditando, setProductoEditando] = useState(null);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [productosPerPage] = useState(8);
    const [cargando, setCargando] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');
    const [datosProducto, setDatosProducto] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stockInicial: '',
        disponible: true,
        imagenURL: '',
        categoria: '',
    });

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'productos'), (snapshot) => {
            const listaProductos = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProductos(listaProductos);
            setProductosFiltrados(listaProductos);
            if (onProductChange) {
                onProductChange(listaProductos);
            }
        });

        return () => unsubscribe();
    }, []);

    const manejarEliminacion = async (idProducto) => {
        await deleteDoc(doc(db, 'productos', idProducto));
        setProductos(productos.filter(producto => producto.id !== idProducto));
        if (onProductChange) {
            onProductChange(productos.filter(producto => producto.id !== idProducto));
        }
    };

    const manejarEdicion = (producto) => {
        setProductoEditando(producto);
        setDatosProducto({
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: producto.precio,
            stockInicial: producto.stock_inicial,
            disponible: producto.disponible,
            imagenURL: producto.imagenURL || '',
            categoria: producto.categoria || '',
        });
    };

    const manejarCambioInput = (evento) => {
        const { name, value } = evento.target;
        setDatosProducto(datosAnteriores => ({
            ...datosAnteriores,
            [name]: name === 'disponible' ? value === 'Disponible' : value,
        }));
    };

    const manejarGuardado = async (idProducto) => {
        const refProducto = doc(db, 'productos', idProducto);
        const datosActualizados = {
            nombre: datosProducto.nombre,
            descripcion: datosProducto.descripcion,
            precio: Number(datosProducto.precio),
            stock_inicial: Number(datosProducto.stockInicial),
            disponible: datosProducto.disponible,
            imagenURL: datosProducto.imagenURL,
            categoria: datosProducto.categoria,
        };

        await updateDoc(refProducto, datosActualizados);

        const productosActualizados = productos.map(producto =>
            producto.id === idProducto ? { ...producto, ...datosActualizados } : producto
        );

        setProductos(productosActualizados);
        if (onProductChange) {
            onProductChange(productosActualizados);
        }
        setProductoEditando(null);
    };

    // Función para filtrar productos
    const filtrarProductos = (terminoBusqueda) => {
        const filtrados = productos.filter(producto =>
            producto.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
            producto.descripcion.toLowerCase().includes(terminoBusqueda.toLowerCase())
        );
        setProductosFiltrados(filtrados);
        setPaginaActual(1);
    };

    // Calcular productos para la página actual
    const indexUltimoProducto = paginaActual * productosPerPage;
    const indexPrimerProducto = indexUltimoProducto - productosPerPage;
    const productosActuales = productosFiltrados.slice(indexPrimerProducto, indexUltimoProducto);

    return (
        <div className="w-full bg-white shadow-lg rounded-lg p-4 h-full flex flex-col">
            {/* Barra de búsqueda */}
            <div className="mb-2">
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={busqueda}
                    onChange={(e) => {
                        setBusqueda(e.target.value);
                        filtrarProductos(e.target.value);
                    }}
                />
            </div>

            {/* Grid de productos */}
            <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {productosActuales.map((producto) => (
                        <div 
                            key={producto.id}
                            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                        >
                            <div className="mb-4">
                                <h3 className="font-medium text-xl mb-2 truncate">{producto.nombre}</h3>
                                <p className="text-gray-600 text-base line-clamp-2">
                                    {producto.descripcion.length > 80 
                                        ? `${producto.descripcion.substring(0, 80)}...` 
                                        : producto.descripcion}
                                </p>
                            </div>
                            <div className="flex justify-center space-x-1">
                                <button
                                    onClick={() => manejarEdicion(producto)}
                                    className="bg-blue-500 text-white px-2 py-1.5 rounded-md hover:bg-blue-600 text-sm font-medium w-16 text-center"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => manejarEliminacion(producto.id)}
                                    className="bg-red-500 text-white px-2 py-1.5 rounded-md hover:bg-red-600 text-sm font-medium w-16 text-center"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Paginación */}
            <div className="mt-2 flex justify-center space-x-2">
                <button
                    onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                    disabled={paginaActual === 1}
                    className="px-4 py-2 border rounded-md disabled:opacity-50"
                >
                    Anterior
                </button>
                <span className="px-4 py-2">
                    Página {paginaActual} de {Math.ceil(productosFiltrados.length / productosPerPage)}
                </span>
                <button
                    onClick={() => setPaginaActual(prev =>
                        Math.min(prev + 1, Math.ceil(productosFiltrados.length / productosPerPage))
                    )}
                    disabled={paginaActual >= Math.ceil(productosFiltrados.length / productosPerPage)}
                    className="px-4 py-2 border rounded-md disabled:opacity-50"
                >
                    Siguiente
                </button>
            </div>

            {/* Modal de edición flotante */}
            {productoEditando && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Editar Producto</h3>
                            <button 
                                onClick={() => setProductoEditando(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <span className="text-2xl">&times;</span>
                            </button>
                        </div>
                        
                        <form onSubmit={(e) => { 
                            e.preventDefault(); 
                            manejarGuardado(productoEditando.id); 
                        }} className="space-y-3">
                            <input
                                type="text"
                                name="nombre"
                                value={datosProducto.nombre}
                                onChange={manejarCambioInput}
                                placeholder="Nombre del Producto"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            />
                            
                            <textarea
                                name="descripcion"
                                value={datosProducto.descripcion}
                                onChange={manejarCambioInput}
                                placeholder="Descripción"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            ></textarea>
                            
                            <input
                                type="number"
                                name="precio"
                                value={datosProducto.precio}
                                onChange={manejarCambioInput}
                                placeholder="Precio"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            />
                            
                            <input
                                type="number"
                                name="stockInicial"
                                value={datosProducto.stockInicial}
                                onChange={manejarCambioInput}
                                placeholder="Stock Inicial"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            />

                            <input
                                type="text"
                                name="imagenURL"
                                value={datosProducto.imagenURL}
                                onChange={manejarCambioInput}
                                placeholder="URL de la Imagen"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />

                            <input
                                type="text"
                                name="categoria"
                                value={datosProducto.categoria}
                                onChange={manejarCambioInput}
                                placeholder="Categoría"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            />
                            
                            <select
                                name="disponible"
                                value={datosProducto.disponible ? 'Disponible' : 'No Disponible'}
                                onChange={manejarCambioInput}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="Disponible">Disponible</option>
                                <option value="No Disponible">No Disponible</option>
                            </select>

                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setProductoEditando(null)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EliminarEditar;
