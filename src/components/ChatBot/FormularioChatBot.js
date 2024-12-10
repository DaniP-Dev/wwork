'use client';

import React, { useState, useEffect } from 'react';
import { ServicioChatBot } from './Servicio';

const FormularioChatBot = () => {
  const [mensajes, setMensajes] = useState([]);
  const [inputMensaje, setInputMensaje] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [estaCargando, setEstaCargando] = useState(false);
  const [chatbot] = useState(new ServicioChatBot());

  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!inputMensaje.trim() || estaCargando) return;

    // Agregar mensaje del usuario
    const mensajeUsuario = {
      texto: inputMensaje,
      esUsuario: true,
      timestamp: new Date().toLocaleTimeString()
    };
    setMensajes(prev => [...prev, mensajeUsuario]);
    setInputMensaje('');
    setEstaCargando(true);

    try {
      // Obtener respuesta de Gemini
      const respuesta = await chatbot.enviarMensaje(inputMensaje);
      
      // Agregar respuesta del bot
      const mensajeBot = {
        texto: respuesta,
        esUsuario: false,
        timestamp: new Date().toLocaleTimeString()
      };
      setMensajes(prev => [...prev, mensajeBot]);
    } catch (error) {
      // Manejar error
      const mensajeError = {
        texto: "Lo siento, hubo un error al procesar tu mensaje.",
        esUsuario: false,
        timestamp: new Date().toLocaleTimeString()
      };
      setMensajes(prev => [...prev, mensajeError]);
    } finally {
      setEstaCargando(false);
    }
  };

  return (
    <div className={`
      fixed top-16 right-0 
      h-[calc(100vh-4rem)] 
      transition-all duration-300 ease-in-out
      ${isCollapsed ? 'w-0' : 'w-[350px]'}
      bg-white shadow-lg 
      flex flex-col
      z-40
    `}>
      {/* Botón para colapsar */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`
          absolute left-0 top-4 
          ${isCollapsed ? '-translate-x-full' : 'translate-x-0'}
          bg-blue-500 text-white p-2 
          ${isCollapsed ? 'rounded-l-lg' : 'rounded-l-none'}
          hover:bg-blue-600 transition-colors
          ${isCollapsed ? 'opacity-100' : 'opacity-0'}
        `}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Contenido del chat */}
      <div className={`flex flex-col h-full ${isCollapsed ? 'hidden' : ''}`}>
        {/* Header */}
        <div className="p-4 bg-blue-500 text-white flex justify-between items-center">
          <h3 className="font-semibold text-lg">Asistente Virtual</h3>
          <button
            onClick={() => setIsCollapsed(true)}
            className="hover:bg-blue-600 rounded-full p-2 transition-colors"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6"
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Área de mensajes */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
          {mensajes.map((mensaje, index) => (
            <div 
              key={index} 
              className={`max-w-[80%] p-3 rounded-lg ${
                mensaje.esUsuario 
                  ? 'self-end bg-blue-500 text-white' 
                  : 'self-start bg-gray-100 text-black'
              }`}
            >
              <div className="mb-1">{mensaje.texto}</div>
              <div className="text-xs opacity-70 text-right">
                {mensaje.timestamp}
              </div>
            </div>
          ))}
        </div>

        {/* Formulario de entrada */}
        <form 
          className="sticky bottom-0 p-4 border-t border-gray-200 flex gap-2 bg-white" 
          onSubmit={enviarMensaje}
        >
          <input
            type="text"
            value={inputMensaje}
            onChange={(e) => setInputMensaje(e.target.value)}
            placeholder="Escribe tu mensaje aquí..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
            disabled={estaCargando}
          />
          <button 
            type="submit"
            className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
            disabled={estaCargando}
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
  );
};

export default FormularioChatBot;
