"use client";
import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase"; // Ajusta la ruta según tu estructura de carpetas

const RegisterUser = ({ onUserRegister }) => {
    const [userData, setUserData] = useState({
        nombre: "",
        direccion: "direccion prueba",
        email: "email prueba",
        fechaRegistro: new Date("December 5, 2024 08:04:29"),
        historialCompras: ["pedidoID1", "pedidoID2"],
        contraseña: ""
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await addDoc(collection(db, "clientes"), {
                ...userData,
                fechaRegistro: new Date(), // Asegurar formato de fecha actualizado
            });
            console.log("Usuario registrado con éxito");

            // Restablecer los valores del formulario
            setUserData({
                nombre: "",
                direccion: "direccion prueba",
                email: "email prueba",
                fechaRegistro: new Date(),
                historialCompras: ["pedidoID1", "pedidoID2"],
                contraseña: ""
            });

            if (onUserRegister) {
                onUserRegister(); // Llama al callback para actualizar el estado padre si es necesario
            }
        } catch (e) {
            console.error("Error al registrar el usuario: ", e);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-16 sm:scale-100 scale-95 sm:max-w-md">
            <h2 className="text-2xl font-bold mb-4">Registrar Usuario</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="nombre">
                        Nombre
                    </label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={userData.nombre}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="direccion">
                        Dirección
                    </label>
                    <input
                        type="text"
                        id="direccion"
                        name="direccion"
                        value={userData.direccion}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="contraseña">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        id="contraseña"
                        name="contraseña"
                        value={userData.contraseña}
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
                        Registrar Usuario
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegisterUser;
