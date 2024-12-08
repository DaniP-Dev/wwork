"use client";
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import BotonComprar from './BotonComprar';

const ProductCard = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const productosQuery = query(
            collection(db, 'productos'),
            where('disponible', '==', true)
        );

        const unsubscribe = onSnapshot(
            productosQuery,
            (snapshot) => {
                const productsList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setProducts(productsList);
                
                if (selectedProduct && !productsList.find(p => p.id === selectedProduct.id)) {
                    setSelectedProduct(null);
                    setShowModal(false);
                }
            },
            (error) => {
                console.error("Error escuchando cambios en productos: ", error);
            }
        );

        return () => unsubscribe();
    }, [selectedProduct]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-16">
            {products.map((product) => (
                <article 
                    key={product.id}
                    className={`
                        bg-white shadow-md rounded-lg p-4 
                        flex flex-col transition-all duration-300 ease-in-out cursor-pointer
                        ${selectedProduct?.id === product.id ? 'h-auto' : 'h-64'}
                    `}
                    onClick={() => setSelectedProduct(product)}
                >
                    <figure className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center overflow-hidden">
                        <img
                            src={product.image || 'https://via.placeholder.com/150'}
                            alt={product.nombre}
                            className="w-full h-full object-cover rounded-t-lg"
                        />
                    </figure>

                    <div className="p-2 flex flex-col flex-grow">
                        <h2 className="text-lg font-semibold truncate">{product.nombre}</h2>
                        <p className="text-blue-600 font-bold truncate">${product.precio}</p>
                    </div>

                    {selectedProduct?.id === product.id && (
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
            ))}

            {showModal && selectedProduct && (
                <BotonComprar
                    productoID={selectedProduct.id}
                    precioUnitario={selectedProduct.precio}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedProduct(null);
                    }}
                />
            )}
        </div>
    );
};

export default ProductCard;
