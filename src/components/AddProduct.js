"use client";

import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Ajusta la ruta según tu estructura de carpetas

const AddProduct = ({ onProductAdd }) => {
    const [productData, setProductData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        categoria: 'calzado', // Categoría inicial
        creacion: new Date(),  // Fecha de creación
        stock_inicial: 100     // Stock inicial
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProductData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await addDoc(collection(db, 'productos'), {
                ...productData,
                precio: Number(productData.precio),
            });
            console.log("Producto añadido con éxito");
            // Limpia el formulario después de enviarlo
            setProductData({
                nombre: '',
                descripcion: '',
                precio: '',
                categoria: 'calzado',
                creacion: new Date(),
                stock_inicial: 100
            });
            if (onProductAdd) {
                onProductAdd(); // Llamada al callback después de agregar un producto
            }
        } catch (e) {
            console.error("Error al agregar el producto: ", e);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-16 sm:scale-100 scale-95 sm:max-w-md">
            <h2 className="text-2xl font-bold mb-4">Agregar Producto</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="nombre">
                        Nombre del Producto
                    </label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={productData.nombre}
                        onChange={handleChange}
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
                        onChange={handleChange}
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
                        onChange={handleChange}
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
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="categoria">
                        Categoría
                    </label>
                    <input
                        type="text"
                        id="categoria"
                        name="categoria"
                        value={productData.categoria}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Agregar Producto
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
