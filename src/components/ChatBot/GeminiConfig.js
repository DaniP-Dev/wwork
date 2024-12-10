import { GoogleGenerativeAI } from "@google/generative-ai";

// Verifica si existe la API key
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("La API key de Gemini no está configurada en las variables de entorno");
}

// Inicializa la instancia de Gemini
export const genAI = new GoogleGenerativeAI(apiKey);

// Función helper para crear una nueva instancia del chat
export const crearNuevoChat = () => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  return model.startChat();
};
