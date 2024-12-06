"use client";

import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const EliminarEditar = ({ onProductChange }) => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productData, setProductData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock_inicial: '',
        disponible: true,
    });

    const fetchProducts = async () => {
        const querySnapshot = await getDocs(collection(db, 'productos'));
        const productsList = [];
        querySnapshot.forEach((doc) => {
            const product = doc.data();
            productsList.push({ id: doc.id, ...product });
        });
        setProducts(productsList);
        if (onProductChange) {
            onProductChange(productsList);
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
        setEditingProduct(product);
        setProductData({
            nombre: product.nombre,
            descripcion: product.descripcion,
            precio: product.precio,
            stock_inicial: product.stock_inicial,
            disponible: product.disponible,
        });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setProductData(prevData => ({
            ...prevData,
            [name]: name === 'disponible' ? value === 'Disponible' : value,
        }));
    };

    const handleSave = async (productId) => {
        const productRef = doc(db, 'productos', productId);
        await updateDoc(productRef, {
            nombre: productData.nombre,
            descripcion: productData.descripcion,
            precio: Number(productData.precio),
            stock_inicial: Number(productData.stock_inicial),
            disponible: productData.disponible,
        });

        setProducts(products.map(product =>
            product.id === productId ? { ...product, ...productData } : product
        ));
        setEditingProduct(null);
    };

    return (
        <div className="max-w-full w-full mx-auto bg-white shadow-lg rounded-lg p-6 mt-16 xs:scale-90 sm:scale-100 sm:mx-4 md:mx-6 lg:mx-8">
            <h2 className="text-2xl font-bold mb-4">Eliminar o Editar Productos</h2>
            {editingProduct ? (
                <div>
                    <h3 className="text-xl font-bold mb-4">Editar Producto</h3>
                    <form onSubmit={(e) => { e.preventDefault(); handleSave(editingProduct.id); }} className="space-y-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="nombre">
                                Nombre del Producto
                            </label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={productData.nombre}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="descripcion">
                                Descripción
                            </label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                value={productData.descripcion}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            ></textarea>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="precio">
                                Precio
                            </label>
                            <input
                                type="number"
                                id="precio"
                                name="precio"
                                value={productData.precio}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="stock_inicial">
                                Stock Inicial
                            </label>
                            <input
                                type="number"
                                id="stock_inicial"
                                name="stock_inicial"
                                value={productData.stock_inicial}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="disponible">
                                Disponibilidad
                            </label>
                            <select
                                id="disponible"
                                name="disponible"
                                value={productData.disponible ? 'Disponible' : 'No Disponible'}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="Disponible">Disponible</option>
                                <option value="No Disponible">No Disponible</option>
                            </select>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <ul className="divide-y divide-gray-300">
                    {products.length === 0 ? (
                        <p className="text-center text-gray-500">No hay productos disponibles</p>
                    ) : (
                        products.map((product) => (
                            <li
                                key={product.id}
                                className="flex flex-row justify-between items-start py-3 space-y-2 sm:space-y-0"
                            >
                                <div className="flex flex-col flex-grow">
                                    <p className="text-lg font-medium">{product.nombre}</p>
                                    <p className="text-sm text-gray-500">{product.descripcion}</p>
                                </div>
                                <div className="flex flex-col space-y-2">
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
            )}
        </div>
    );
};

export default EliminarEditar;
