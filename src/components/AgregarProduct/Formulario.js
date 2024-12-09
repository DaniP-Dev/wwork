import React from 'react';
import { useLogicaProduct } from './LogicaProduct';
import ServicioProduct from './ServicioProduct';

const CAMPOS_FORMULARIO = [
    { id: 'nombre', type: 'text', label: 'Nombre del Producto' },
    { id: 'descripcion', type: 'textarea', label: 'Descripción' },
    { id: 'imagenURL', type: 'text', label: 'URL de la Imagen' },
];

const Formulario = () => {
    const servicioProduct = new ServicioProduct();
    const {
        productData,
        categorias,
        nuevaCategoria,
        setNuevaCategoria,
        isSubmitting,
        error,
        mensajeExito,
        handleChange,
        handleSubmit
    } = useLogicaProduct(servicioProduct);

    const renderCampo = ({ id, type, label }) => {
        const commonClasses = "w-full px-3 py-2 border border-gray-300 rounded-md";
        
        return (
            <div className="flex flex-col">
                <label htmlFor={id} className="mb-1 text-sm font-medium text-gray-700">
                    {label}
                </label>
                {type === 'textarea' ? (
                    <textarea
                        id={id}
                        name={id}
                        value={productData[id]}
                        onChange={handleChange}
                        className={commonClasses}
                        required
                    />
                ) : (
                    <input
                        type={type}
                        id={id}
                        name={id}
                        value={productData[id]}
                        onChange={handleChange}
                        className={commonClasses}
                        required
                    />
                )}
            </div>
        );
    };

    const formatearPrecio = (valor) => {
        if (!valor) return '';
        return `$ ${Number(valor).toLocaleString('es-MX', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    const renderGananciaSection = () => (
        <div className="mb-4">
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-3">
                    <label htmlFor="ganancia_porcentaje" className="mb-1 text-sm font-medium text-gray-700">
                        Ganancia %
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            id="ganancia_porcentaje"
                            name="ganancia_porcentaje"
                            value={productData.ganancia_porcentaje}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md pr-8"
                            min="0"
                            max="9999"
                            placeholder="0"
                            required
                        />
                        <span className="absolute right-3 top-2">%</span>
                    </div>
                </div>
                
                <div className="col-span-5">
                    <label htmlFor="ganancia_valor" className="mb-1 text-sm font-medium text-gray-700 truncate">
                        Ganancia Lote
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-2">$</span>
                        <input
                            type="text"
                            id="ganancia_valor"
                            name="ganancia_valor"
                            value={productData.ganancia_valor}
                            onChange={handleChange}
                            className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md"
                            placeholder="0.00"
                            required
                        />
                    </div>
                </div>
                
                <div className="col-span-4">
                    <label htmlFor="ganancia_unidad" className="mb-1 text-sm font-medium text-gray-700 truncate">
                        Ganancia Unidad
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-2">$</span>
                        <input
                            type="text"
                            id="ganancia_unidad"
                            name="ganancia_unidad"
                            value={productData.ganancia_unidad}
                            onChange={handleChange}
                            className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md"
                            placeholder="0.00"
                            required
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderValorVenta = () => (
        <div className="mb-4">
            <label htmlFor="valor_venta" className="mb-1 text-sm font-medium text-gray-700">
                Valor de Venta por Unidad
            </label>
            <div className="relative">
                <span className="absolute left-3 top-2">$</span>
                <input
                    type="text"
                    id="valor_venta"
                    name="valor_venta"
                    value={productData.valor_venta}
                    className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    disabled
                />
            </div>
            <p className="text-xs text-gray-500 mt-1">
                Precio final de venta por unidad incluyendo la ganancia
            </p>
        </div>
    );

    const renderCantidadIvaSection = () => (
        <div className="mb-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <label htmlFor="stock_inicial" className="mb-1 text-sm font-medium text-gray-700">
                        Cantidad
                    </label>
                    <input
                        type="number"
                        id="stock_inicial"
                        name="stock_inicial"
                        value={productData.stock_inicial}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="iva" className="mb-1 text-sm font-medium text-gray-700">
                        IVA
                    </label>
                    <select
                        id="iva"
                        name="iva"
                        value={productData.iva}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                        <option value="0">0%</option>
                        <option value="19">19%</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderPreciosSection = () => {
        const esCantidadValida = productData.stock_inicial && Number(productData.stock_inicial) > 0;

        return (
            <>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col">
                        <label htmlFor="precio" className="mb-1 text-sm font-medium text-gray-700">
                            Precio por unidad
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-2">$</span>
                            <input
                                type="text"
                                id="precio"
                                name="precio"
                                value={productData.precio}
                                onChange={handleChange}
                                className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md"
                                disabled={!esCantidadValida}
                                required
                            />
                        </div>
                        {!esCantidadValida && (
                            <p className="text-sm text-gray-500 mt-1">
                                {!productData.stock_inicial 
                                    ? 'Primero ingrese la cantidad' 
                                    : 'La cantidad debe ser mayor a 0'}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="precio_lote" className="mb-1 text-sm font-medium text-gray-700">
                            Precio por lote
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-2">$</span>
                            <input
                                type="text"
                                id="precio_lote"
                                name="precio_lote"
                                value={productData.precio_lote}
                                onChange={handleChange}
                                className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md"
                                disabled={!esCantidadValida}
                                required
                            />
                        </div>
                    </div>
                </div>
                
                {esCantidadValida && (
                    <>
                        {renderGananciaSection()}
                        {renderValorVenta()}
                    </>
                )}
            </>
        );
    };

    const renderSelectores = () => (
        <>
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                    Categoría
                </label>
                <select
                    name="categoria"
                    value={productData.categoria}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                >
                    <option value="">Seleccione una categoría</option>
                    {categorias.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                    ))}
                    <option value="nueva">+ Agregar nueva categoría</option>
                </select>
            </div>

            {productData.categoria === 'nueva' && (
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">
                        Nueva Categoría
                    </label>
                    <input
                        type="text"
                        value={nuevaCategoria}
                        onChange={(e) => setNuevaCategoria(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Escriba el nombre de la nueva categoría"
                        required
                    />
                </div>
            )}
        </>
    );

    return (
        <div className="w-full bg-white shadow-lg rounded-lg p-4 h-full overflow-hidden">
            <div className="max-w-full bg-white rounded-lg h-full flex flex-col">
                <h2 className="text-2xl font-bold mb-2">Agregar Producto</h2>
                
                {error && (
                    <div className="mb-2 p-2 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}
                
                {mensajeExito && (
                    <div className="mb-2 p-2 bg-green-100 text-green-700 rounded">
                        {mensajeExito}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                    <div className="space-y-2">
                        {CAMPOS_FORMULARIO.map((campo) => (
                            <div key={campo.id} className="mb-4">
                                {renderCampo(campo)}
                            </div>
                        ))}
                        
                        {renderCantidadIvaSection()}
                        {renderPreciosSection()}
                        {renderSelectores()}
                        
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`bg-blue-500 text-white px-4 py-2 rounded-md 
                                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                            >
                                {isSubmitting ? 'Agregando...' : 'Agregar Producto'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Formulario;
