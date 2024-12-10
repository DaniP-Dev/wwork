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
      const mensajeBot = {
        texto: response,
        esUsuario: false,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMensajes((prev) => [...prev, mensajeBot]);
    } catch (error) {
      const mensajeError = {
        texto: "Lo siento, hubo un error al procesar tu mensaje.",
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
