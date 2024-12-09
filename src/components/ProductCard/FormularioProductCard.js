import React, { useState } from 'react';
import BotonComprar from './components/BotonComprar';

const FormularioProductCard = ({ product, activeCard, onCardClick }) => {
    const [showModal, setShowModal] = useState(false);
    const isExpanded = activeCard === product.id;

    if (!product) return null;

    return (
        <>
            <article 
                className={`
                    bg-white shadow-md rounded-lg p-4 m-4
                    flex flex-col transition-all duration-300 ease-in-out cursor-pointer
                    hover:shadow-xl hover:scale-105 hover:bg-gray-50
                    ${isExpanded ? 'h-auto' : 'h-[50vh]'}
                `}
                onClick={() => onCardClick(isExpanded ? null : product.id)}
            >
                <figure className="w-full h-[30vh] bg-gray-200 rounded-t-lg flex items-center justify-center overflow-hidden">
                    <img
                        src={product.image || 'https://via.placeholder.com/150'}
                        alt={product.nombre}
                        className="w-full h-full object-cover rounded-t-lg"
                    />
                </figure>

                <div className="p-2 flex flex-col flex-grow">
                    <h2 className="text-lg font-semibold truncate">{product.nombre}</h2>
                    <p className="text-blue-600 font-bold truncate">${product.valor_venta}</p>
                </div>

                {isExpanded && (
                    <div className="p-4 mt-4 text-gray-600">
                        <h3 className="font-semibold">Descripción</h3>
                        <p className="text-sm mt-1">{product.descripcion}</p>

                        <div className="mt-4 flex justify-between items-center">
                            <p className={`
                                ${product.stock_inicial > 0 ? 'text-green-500' : 'text-red-500'}
                                font-medium
                            `}>
                                {product.stock_inicial > 0 ? 'Disponible' : 'No disponible'}
                            </p>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowModal(true);
                                }}
                                className="
                                    bg-blue-500 text-white px-4 py-2 rounded-md 
                                    hover:bg-blue-600 transition-colors duration-200
                                    disabled:bg-gray-400 disabled:cursor-not-allowed
                                "
                                disabled={product.stock_inicial <= 0}
                            >
                                Comprar
                            </button>
                        </div>
                    </div>
                )}
            </article>

            {showModal && (
                <BotonComprar
                    productoID={product.id}
                    precioUnitario={product.valor_venta}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
};

export default FormularioProductCard;

