"use client";

import React, { useState } from "react";
import { collection, addDoc, doc, updateDoc, arrayUnion, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";

const BotonComprar = ({ productoID, precioUnitario, onClose }) => {
    const initialFormState = {
        email: "",
        password: "",
        metodoPago: "tarjeta",
        cantidad: 1
    };

    const [formData, setFormData] = useState(initialFormState);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [notification, setNotification] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const mostrarNotificacion = (type, message) => {
        setNotification({ type, message });
        if (type === 'success') {
            setTimeout(() => {
                setNotification({ type: '', message: '' });
                onClose();
            }, 2000);
        }
    };

    const procesarCompra = async () => {
        // Validar formulario
        if (!formData.email || !formData.password || formData.cantidad < 1) {
            throw new Error("Por favor complete todos los campos correctamente");
        }

        // Buscar cliente
        const clienteQuery = query(collection(db, "clientes"), where("email", "==", formData.email));
        const clienteSnapshot = await getDocs(clienteQuery);
        
        if (clienteSnapshot.empty) {
            throw new Error("Correo electrónico no encontrado");
        }

        const clienteDoc = clienteSnapshot.docs[0];
        const clienteData = clienteDoc.data();

        // Validar contraseña
        if (clienteData.contraseña !== formData.password) {
            throw new Error("Credenciales inválidas");
        }

        // Crear objeto de compra
        const compra = {
            clienteID: clienteDoc.id,
            fecha: new Date().toISOString(),
            productos: [{
                productoID,
                cantidad: Number(formData.cantidad),
                precioUnitario,
            }],
            total: Number(formData.cantidad) * precioUnitario,
            metodoPago: formData.metodoPago,
            estado: "completado"
        };

        // Guardar compra y actualizar historial
        const compraRef = await addDoc(collection(db, "compras"), compra);
        await updateDoc(doc(db, "clientes", clienteDoc.id), {
            historialCompras: arrayUnion({ ...compra, id: compraRef.id })
        });

        return compraRef;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setNotification({ type: '', message: '' });

        try {
            await procesarCompra();
            mostrarNotificacion('success', '¡Compra realizada con éxito!');
            setFormData(initialFormState);
        } catch (error) {
            console.error("Error al realizar la compra:", error);
            mostrarNotificacion('error', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto relative">
                {notification.message && (
                    <div className={`absolute top-0 left-0 right-0 p-3 text-white text-center ${
                        notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                        {notification.message}
                    </div>
                )}
                
                <h2 className="text-2xl font-bold mb-4">Comprar Producto</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
                            Contraseña
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="cantidad">
                            Cantidad
                        </label>
                        <input
                            type="number"
                            id="cantidad"
                            name="cantidad"
                            value={formData.cantidad}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="1"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="metodoPago">
                            Método de Pago
                        </label>
                        <select
                            id="metodoPago"
                            name="metodoPago"
                            value={formData.metodoPago}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="tarjeta">Tarjeta</option>
                            <option value="paypal">PayPal</option>
                            <option value="efectivo">Efectivo</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                            disabled={isLoading}
                        >
                            {isLoading ? "Procesando..." : "Confirmar Compra"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BotonComprar;
