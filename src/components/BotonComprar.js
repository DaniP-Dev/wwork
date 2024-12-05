"use client";

import React, { useState } from "react";
import { collection, addDoc, doc, updateDoc, arrayUnion, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Ajusta la ruta según tu estructura de carpetas

const BotonComprar = ({ productoID, precioUnitario, onClose }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [metodoPago, setMetodoPago] = useState("tarjeta");
    const [cantidad, setCantidad] = useState(1); // Estado para la cantidad
    const [error, setError] = useState(""); // Estado para manejar errores

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Buscar el cliente basado en el correo electrónico
            const q = query(collection(db, "clientes"), where("email", "==", email));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                throw new Error("Correo electrónico no encontrado");
            }
            const clienteDoc = querySnapshot.docs[0];
            const clienteData = clienteDoc.data();

            // Verificar si la contraseña es correcta
            if (clienteData.contraseña !== password) {
                throw new Error("Contraseña incorrecta");
            }

            const clienteID = clienteDoc.id;

            // Documento de compra
            const compra = {
                clienteID,
                fecha: new Date().toISOString(),
                productos: [
                    {
                        productoID,
                        cantidad,
                        precioUnitario,
                    }
                ],
                total: cantidad * precioUnitario,
                metodoPago,
                estado: "completado"
            };

            // Agregar compra a la colección de compras
            await addDoc(collection(db, "compras"), compra);

            // Actualizar el historial de compras del cliente
            const clienteRef = doc(db, "clientes", clienteID);
            await updateDoc(clienteRef, {
                historialCompras: arrayUnion(compra)
            });

            onClose(); // Cerrar el modal después de la compra exitosa
        } catch (e) {
            console.error("Error al realizar la compra: ", e);
            setError("Error al realizar la compra: " + e.message); // Mostrar error al usuario
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto">
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                            value={cantidad}
                            onChange={(e) => setCantidad(e.target.value)}
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
                            value={metodoPago}
                            onChange={(e) => setMetodoPago(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                            <option value="tarjeta">Tarjeta</option>
                            <option value="paypal">PayPal</option>
                            <option value="efectivo">Efectivo</option>
                        </select>
                    </div>
                    {error && <p className="text-red-500">{error}</p>} {/* Mostrar mensaje de error */}
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            Confirmar Compra
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BotonComprar;
