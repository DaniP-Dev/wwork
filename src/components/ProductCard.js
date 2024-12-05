"use client";
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import BotonComprar from './BotonComprar'; // Ajusta la ruta según tu estructura de carpetas

const ProductCard = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'productos'));
                const productsList = [];
                querySnapshot.forEach((doc) => {
                    productsList.push({ id: doc.id, ...doc.data() });
                });
                setProducts(productsList);
            } catch (e) {
                console.error("Error fetching products: ", e);
            }
        };

        fetchProducts();
    }, []);

    const handleCardClick = (product) => {
        setSelectedProduct(product);
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    // Filtrar los productos que tienen "disponible" como true
    const availableProducts = products.filter(product => product.disponible === true);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-16">
            {availableProducts.map((product) => (
                <div
                    key={product.id}
                    onClick={() => handleCardClick(product)}
                    className={`bg-white shadow-md rounded-lg p-4 flex flex-col transition-all duration-300 ease-in-out cursor-pointer
                    ${selectedProduct?.id === product.id ? 'h-auto' : 'h-64'}`}
                >
                    <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center overflow-hidden">
                        <img
                            src={product.image || 'https://via.placeholder.com/150'}
                            alt={product.nombre}
                            className="w-full h-full object-cover rounded-t-lg"
                        />
                    </div>
                    <div className="p-2 flex flex-col flex-grow">
                        <h2 className="text-lg font-semibold truncate">{product.nombre}</h2>
                        <p className="text-blue-600 font-bold truncate">{product.precio}</p>
                    </div>

                    {/* Detalles adicionales, visibles solo si el producto está seleccionado */}
                    {selectedProduct?.id === product.id && (
                        <div className="p-4 mt-4 text-gray-600">
                            <h3 className="font-semibold">Descripción</h3>
                            <p>{product.descripcion}</p>

                            {/* Disponibilidad */}
                            <div className="mt-2">
                                <p className={product.stock_inicial > 0 ? 'text-green-500' : 'text-red-500'}>
                                    {product.stock_inicial > 0 ? 'Disponible' : 'No disponible'}
                                </p>
                            </div>

                            {/* Botón para abrir el modal */}
                            <div className="mt-4">
                                <button
                                    onClick={openModal}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                >
                                    Comprar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {/* Modal de Comprar */}
            {showModal && selectedProduct && (
                <BotonComprar
                    productoID={selectedProduct.id}
                    precioUnitario={selectedProduct.precio}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default ProductCard;
