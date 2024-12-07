"use client";
import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const AddProduct = ({ onProductAdd }) => {
    const [productData, setProductData] = useState({
        nombre: "",
        descripcion: "",
        precio: "",
        categoria: "calzado",
        creacion: new Date(),
        stock_inicial: 100,
        imagenURL: "",
        disponibilidad: true,
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProductData((prevData) => ({
            ...prevData,
            [name]: name === "disponibilidad" ? value === "true" : value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await addDoc(collection(db, "productos"), {
                ...productData,
                precio: Number(productData.precio),
                stock_inicial: Number(productData.stock_inicial),
                creacion: new Date(),
            });
            console.log("Producto añadido con éxito");


            setProductData({
                nombre: "",
                descripcion: "",
                precio: "",
                categoria: "",
                creacion: new Date(),
                stock_inicial: 100,
                imagenURL: "",
                disponibilidad: true,
            });

            if (onProductAdd) {
                onProductAdd(); // Llama al callback para actualizar el estado padre si es necesario
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
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="imagenURL">
                        URL de la Imagen
                    </label>
                    <input
                        type="text"
                        id="imagenURL"
                        name="imagenURL"
                        value={productData.imagenURL}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="disponibilidad">
                        Disponibilidad
                    </label>
                    <select
                        id="disponibilidad"
                        name="disponibilidad"
                        value={productData.disponibilidad}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                        <option value="true">Disponible</option>
                        <option value="false">No Disponible</option>
                    </select>
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
