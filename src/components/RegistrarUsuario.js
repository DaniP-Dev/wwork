"use client";
import React, { useState } from "react";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useRouter } from "next/navigation";

const RegistrarUsuario = ({ alRegistrarUsuario }) => {
  const router = useRouter();
  const [datosUsuario, setDatosUsuario] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    email: "",
    fechaRegistro: new Date(),
    historialCompras: [],
    contraseña: "",
  });

  const [errores, setErrores] = useState({
    email: "",
    contraseña: "",
  });

  const [mensajeExito, setMensajeExito] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const validarEmail = (email) => {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
  };

  const validarContraseña = (contraseña) => {
    return (
      contraseña.length >= 8 && // Mínimo 8 caracteres
      /[A-Z]/.test(contraseña) && // Al menos una mayúscula
      /[a-z]/.test(contraseña) && // Al menos una minúscula
      /[0-9]/.test(contraseña) && // Al menos un número
      /[!@#$%^&*]/.test(contraseña)
    ); // Al menos un carácter especial
  };

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    setDatosUsuario((datosAnteriores) => ({
      ...datosAnteriores,
      [name]: value,
    }));

    // Validaciones
    if (name === "email") {
      setErrores((prev) => ({
        ...prev,
        email: validarEmail(value) ? "" : "Email inválido",
      }));
    }
    if (name === "contraseña") {
      setErrores((prev) => ({
        ...prev,
        contraseña: validarContraseña(value)
          ? ""
          : "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial",
      }));
    }
  };

  const verificarEmailExistente = async (email) => {
    const q = query(collection(db, "clientes"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Verificar si el email ya existe
      const emailExiste = await verificarEmailExistente(datosUsuario.email);

      if (emailExiste) {
        setError(
          "Este correo electrónico ya está registrado. Por favor, utilice otro."
        );
        setIsSubmitting(false);
        return;
      }

      await addDoc(collection(db, "clientes"), {
        ...datosUsuario,
        fechaRegistro: new Date(),
      });

      setMensajeExito("¡Usuario registrado exitosamente!");

      setDatosUsuario({
        nombre: "",
        apellido: "",
        direccion: "",
        email: "",
        fechaRegistro: new Date(),
        historialCompras: [],
        contraseña: "",
      });

      if (alRegistrarUsuario) {
        alRegistrarUsuario();
      }

      setTimeout(() => {
        router.push("/marketplace");
      }, 3000);
    } catch (error) {
      console.error("Error al registrar el usuario: ", error);
      setError("Error al registrar el usuario. Por favor, intente nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-16 sm:scale-100 scale-95 sm:max-w-md">
      <h2 className="text-2xl font-bold mb-4">Registrar Usuario</h2>

      {mensajeExito && (
        <div className="mb-2 p-2 bg-green-100 text-green-700 rounded">
          {mensajeExito}
        </div>
      )}

      {error && (
        <div className="mb-2 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={manejarEnvio}>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="nombre"
          >
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={datosUsuario.nombre}
            onChange={manejarCambio}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="apellido"
          >
            Apellido
          </label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={datosUsuario.apellido}
            onChange={manejarCambio}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="direccion"
          >
            Dirección
          </label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={datosUsuario.direccion}
            onChange={manejarCambio}
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
            value={datosUsuario.email}
            onChange={manejarCambio}
            className={`w-full px-3 py-2 border rounded-md ${
              errores.email ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errores.email && (
            <p className="text-red-500 text-sm mt-1">{errores.email}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="contraseña"
          >
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="contraseña"
              name="contraseña"
              value={datosUsuario.contraseña}
              onChange={manejarCambio}
              className={`w-full px-3 py-2 border rounded-md ${
                errores.contraseña ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          </div>
          {errores.contraseña && (
            <p className="text-red-500 text-sm mt-1">{errores.contraseña}</p>
          )}
        </div>
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-500 text-white px-6 py-2 rounded-md 
                            ${
                              isSubmitting
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-blue-600"
                            }`}
          >
            {isSubmitting ? "Registrando..." : "Registrar Usuario"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrarUsuario;
