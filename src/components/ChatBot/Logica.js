import { useState } from "react";
import { ServicioChatBot } from "./Servicio";

export const useLogicaChatBot = () => {
  const [mensajes, setMensajes] = useState([]);
  const [input, setInput] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [chatbot] = useState(new ServicioChatBot());

  const cambiarMensajeEntrada = (e) => {
    setInput(e.target.value);
  };

  const toggleChat = () => {
    setIsCollapsed(!isCollapsed);
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const mensajeUsuario = {
      texto: input,
      esUsuario: true,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMensajes((prev) => [...prev, mensajeUsuario]);
    setInput("");
    setLoading(true);

    try {
      const response = await chatbot.enviarMensaje(input);
      if (!response) throw new Error("Respuesta vacía del chatbot");
      
      const mensajeBot = {
        texto: response,
        esUsuario: false,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMensajes((prev) => [...prev, mensajeBot]);
    } catch (error) {
      console.error("Error en el chat:", error);
      const mensajeError = {
        texto: "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo más tarde.",
        esUsuario: false,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMensajes((prev) => [...prev, mensajeError]);
    } finally {
      setLoading(false);
    }
  };

  return {
    mensajes,
    input,
    isCollapsed,
    loading,
    cambiarMensajeEntrada,
    manejarEnvio,
    toggleChat,
  };
};
