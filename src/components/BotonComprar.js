"use client";

import React, { useState } from "react";
import { collection, addDoc, doc, updateDoc, arrayUnion, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const BotonComprar = ({ productoID, precioUnitario, onClose }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        metodoPago: "tarjeta",
        cantidad: 1
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validarFormulario = () => {
        if (!formData.email || !formData.password || formData.cantidad < 1) {
            throw new Error("Por favor complete todos los campos correctamente");
        }
    };

    const buscarCliente = async () => {
        const q = query(collection(db, "clientes"), where("email", "==", formData.email));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            throw new Error("Correo electrónico no encontrado");
        }
        return querySnapshot.docs[0];
    };

    const crearCompra = (clienteID) => ({
        clienteID,
        fecha: new Date().toISOString(),
        productos: [{
            productoID,
            cantidad: Number(formData.cantidad),
            precioUnitario,
        }],
        total: Number(formData.cantidad) * precioUnitario,
        metodoPago: formData.metodoPago,
        estado: "completado"
    });

    const mostrarNotificacion = (type, message) => {
        setNotification({ type, message });
        if (type === 'success') {
            setTimeout(() => {
                setNotification({ type: '', message: '' });
                onClose();
            }, 2000);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError("");
        setNotification({ type: '', message: '' });

        try {
            validarFormulario();
            
            const clienteDoc = await buscarCliente();
            const clienteData = clienteDoc.data();

            if (clienteData.contraseña !== formData.password) {
                mostrarNotificacion('error', 'Credenciales inválidas');
                return;
            }

            const compra = crearCompra(clienteDoc.id);
            
            await addDoc(collection(db, "compras"), compra);
            await updateDoc(doc(db, "clientes", clienteDoc.id), {
                historialCompras: arrayUnion(compra)
            });

            mostrarNotificacion('success', '¡Compra realizada con éxito!');
        } catch (e) {
            console.error("Error al realizar la compra: ", e);
            mostrarNotificacion('error', e.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto relative">
                {/* Notificación */}
                {notification.message && (
                    <div className={`absolute top-0 left-0 right-0 p-3 text-white text-center ${
                        notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                        {notification.message}
                    </div>
                )}
                
                <h2 className="text-2xl font-bold mb-4">Comprar Producto</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="cantidad">
                            Cantidad
                        </label>
                        <input
                            type="number"
                            id="cantidad"
                            name="cantidad"
                            value={formData.cantidad}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            min="1"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="metodoPago">
                            Método de Pago
                        </label>
                        <select
                            id="metodoPago"
                            name="metodoPago"
                            value={formData.metodoPago}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                            <option value="tarjeta">Tarjeta</option>
                            <option value="paypal">PayPal</option>
                            <option value="efectivo">Efectivo</option>
                        </select>
                    </div>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
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
