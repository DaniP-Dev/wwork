import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { crearNuevoChat } from "./GeminiConfig";

export class ServicioChatBot {
  constructor() {
    this.chatbot = crearNuevoChat();
  }

  async obtenerDatosFirebase() {
    try {
      const datos = {};
      const colecciones = ["productos", "clientes", "compras", "facturas"];

      for (const coleccion of colecciones) {
        const snapshot = await getDocs(collection(db, coleccion));
        datos[coleccion] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      }
      return datos;
    } catch (error) {
      console.error("Error obteniendo datos:", error);
      return null;
    }
  }

  async enviarMensaje(mensaje) {
    try {
      const datos = await this.obtenerDatosFirebase();
      const mensajeConContexto = `
        Contexto actual: ${JSON.stringify(datos)}
        Pregunta: ${mensaje}
      `;

      const result = await this.chatbot.sendMessage(mensajeConContexto);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error:", error);
      throw new Error("No pude procesar tu mensaje");
    }
  }
}
