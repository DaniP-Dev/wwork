import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("variables de entorno");
}

export const genAI = new GoogleGenerativeAI(apiKey);

export const crearNuevoChat = () => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  return model.startChat();
};
