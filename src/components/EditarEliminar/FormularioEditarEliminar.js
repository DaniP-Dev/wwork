"use client";
import { useState } from 'react';
import ServicioEditarEliminar from './Servicio';
import { useLogicaEditarEliminar } from './Logica';
import BotonEditar from './components/BotonEditar';
import BotonEliminar from './components/BotonEliminar';

const FormularioEditarEliminar = () => {
    const servicio = new ServicioEditarEliminar();
    const {
        productos,
        totalProductos,
        categorias,
        paginaActual,
        productosPerPage,
        error,
        mensajeExito,
        productoEditando,
        nuevaCategoria,
        filtrarProductos,
        setPaginaActual,
        setProductoEditando,
        setNuevaCategoria,
        handleGuardarEdicion,
        busqueda,
        setBusqueda
    } = useLogicaEditarEliminar(servicio);

    const handleEliminar = async (idProducto) => {
        try {
            await servicio.eliminarProducto(idProducto);
            setMensajeExito('Producto eliminado exitosamente');
        } catch (error) {
            setError(error.message);
        }
    };

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

            {/* Mensajes */}
            {error && (
                <div className="mb-2 p-2 bg-red-100 text-red-700 rounded">{error}</div>
            )}
            {mensajeExito && (
                <div className="mb-2 p-2 bg-green-100 text-green-700 rounded">{mensajeExito}</div>
            )}

            {/* Grid de productos */}
            <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {productos.map((producto) => (
                        <div key={producto.id} className="border rounded-lg p-4">
                            <h3 className="font-medium text-xl mb-2 truncate">{producto.nombre}</h3>
                            <p className="text-gray-600 text-base line-clamp-2">
                                {producto.descripcion}
                            </p>
                            <div className="flex justify-center space-x-1 mt-4">
                                <BotonEditar 
                                    onEditar={() => setProductoEditando(producto)} 
                                />
                                <BotonEliminar 
                                    onEliminar={() => handleEliminar(producto.id)} 
                                />
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
                    Página {paginaActual} de {Math.ceil(totalProductos / productosPerPage)}
                </span>
                <button
                    onClick={() => setPaginaActual(prev =>
                        Math.min(prev + 1, Math.ceil(totalProductos / productosPerPage))
                    )}
                    disabled={paginaActual >= Math.ceil(totalProductos / productosPerPage)}
                    className="px-4 py-2 border rounded-md disabled:opacity-50"
                >
                    Siguiente
                </button>
            </div>

            {/* Modal de edición */}
            {productoEditando && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
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
                            handleGuardarEdicion(productoEditando);
                        }} className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input
                                    type="text"
                                    value={productoEditando.nombre}
                                    onChange={(e) => setProductoEditando({
                                        ...productoEditando,
                                        nombre: e.target.value
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                                <textarea
                                    value={productoEditando.descripcion}
                                    onChange={(e) => setProductoEditando({
                                        ...productoEditando,
                                        descripcion: e.target.value
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">URL de Imagen</label>
                                <input
                                    type="text"
                                    value={productoEditando.imagenURL || ''}
                                    onChange={(e) => setProductoEditando({
                                        ...productoEditando,
                                        imagenURL: e.target.value
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Categoría</label>
                                <select
                                    value={productoEditando.categoria}
                                    onChange={(e) => setProductoEditando({
                                        ...productoEditando,
                                        categoria: e.target.value
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                >
                                    {categorias.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </option>
                                    ))}
                                    <option value="nueva">+ Agregar nueva categoría</option>
                                </select>
                            </div>

                            {productoEditando.categoria === 'nueva' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Nueva Categoría
                                    </label>
                                    <input
                                        type="text"
                                        value={nuevaCategoria}
                                        onChange={(e) => setNuevaCategoria(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Disponibilidad
                                </label>
                                <select
                                    value={productoEditando.disponible ? 'disponible' : 'no_disponible'}
                                    onChange={(e) => setProductoEditando({
                                        ...productoEditando,
                                        disponible: e.target.value === 'disponible'
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="disponible">Disponible</option>
                                    <option value="no_disponible">No Disponible</option>
                                </select>
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
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
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormularioEditarEliminar;
