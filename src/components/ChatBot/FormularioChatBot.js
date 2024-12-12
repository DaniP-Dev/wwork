"use client";

import { useLogicaChatBot } from "./Logica";
import { useEffect, useRef } from "react";

const FormularioChatBot = () => {
  const {
    mensajes,
    input,
    isCollapsed,
    loading,
    cambiarMensajeEntrada,
    manejarEnvio,
    toggleChat,
  } = useLogicaChatBot();

  const mensajesContainerRef = useRef(null);

  // Efecto para hacer scroll hacia abajo cuando hay nuevos mensajes
  useEffect(() => {
    if (mensajesContainerRef.current) {
      mensajesContainerRef.current.scrollTop =
        mensajesContainerRef.current.scrollHeight;
    }
  }, [mensajes]);

  return (
    <div className="fixed top-16 right-0 bottom-0 transition-all duration-300 ease-in-out">
      {isCollapsed && (
        <button
          onClick={toggleChat}
          className="fixed top-20 right-0 bg-white p-2 rounded-l-lg shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      )}

      <div
        className={`h-full flex flex-col ${
          isCollapsed ? "w-0" : "w-[350px]"
        } bg-white shadow-lg rounded-l-lg overflow-hidden`}
      >
        {/* Header fijo */}
        <div className="flex-none h-14 p-4 bg-blue-500 text-white flex justify-between items-center">
          <h3 className="font-semibold text-lg">Asistente Virtual</h3>
          <button
            onClick={toggleChat}
            className="hover:bg-blue-600 rounded-full p-2 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Área de mensajes con scroll */}
        <div
          ref={mensajesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {mensajes.map((mensaje, index) => (
            <div
              key={index}
              className={`flex ${
                mensaje.esUsuario ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  mensaje.esUsuario
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-black"
                }`}
              >
                <div className="mb-1">{mensaje.texto}</div>
                <div className="text-xs opacity-70 text-right">
                  {mensaje.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Formulario siempre visible en la parte inferior */}
        <div className="flex-none border-t border-gray-200 bg-white p-4">
          <form onSubmit={manejarEnvio} className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={cambiarMensajeEntrada}
              placeholder="Escribe tu mensaje aquí..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
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
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormularioChatBot;
