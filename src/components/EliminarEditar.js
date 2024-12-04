"use client";

import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase'; // Ajusta la ruta según tu estructura de carpetas

const EliminarEditar = ({ onProductChange }) => {
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        const querySnapshot = await getDocs(collection(db, 'productos'));
        const productsList = [];
        querySnapshot.forEach((doc) => {
            productsList.push({ id: doc.id, ...doc.data() });
        });
        setProducts(productsList);
        if (onProductChange) {
            onProductChange(productsList); // Llamada al callback cuando los productos cambian
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (productId) => {
        await deleteDoc(doc(db, 'productos', productId));
        setProducts(products.filter(product => product.id !== productId));
    };

    const handleEdit = (product) => {
        console.log("Editar producto: ", product);
        // Aquí puedes abrir un formulario de edición o modal
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-16 sm:scale-100 scale-95 sm:max-w-md">
            <h2 className="text-2xl font-bold mb-4">Eliminar o Editar Productos</h2>
            <ul className="divide-y divide-gray-300">
                {products.length === 0 ? (
                    <p className="text-center text-gray-500">No hay productos disponibles</p>
                ) : (
                    products.map((product) => (
                        <li
                            key={product.id}
                            className="flex justify-between items-center py-3"
                        >
                            <div>
                                <p className="text-lg font-medium">{product.nombre}</p>
                                <p className="text-sm text-gray-500">{product.descripcion}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                                    onClick={() => handleDelete(product.id)}
                                >
                                    Eliminar
                                </button>
                                <button
                                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                                    onClick={() => handleEdit(product)}
                                >
                                    Editar
                                </button>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default EliminarEditar;
