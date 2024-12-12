import { db } from "@/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { crearNuevoChat } from "./GeminiConfig";
import { procesarDatos } from './promptConfig';

export class ServicioChatBot {
  constructor() {
    this.chatbot = crearNuevoChat();
    this.procesadorDatos = procesarDatos;
  }

  async obtenerDatosFirebase() {
    try {
      const datos = {};
      const colecciones = ["productos", "clientes", "compras", "categorias"];
      
      for (const coleccion of colecciones) {
        const snapshot = await getDocs(collection(db, coleccion));
        datos[coleccion] = snapshot.docs.map((doc) => {
          const data = doc.data();
          // Eliminamos datos sensibles
          if (coleccion === 'clientes') {
            const { contraseña, ...datosCliente } = data;
            return { id: doc.id, ...datosCliente };
          }
          return { id: doc.id, ...data };
        });
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
      
      // Procesar datos antes de enviarlos
      const datosAnalisis = {
        ventasPeriodo: this.procesadorDatos(datos).calcularVentasPeriodo(
          datos.compras,
          { inicio: new Date(new Date().setMonth(new Date().getMonth() - 1)), fin: new Date() }
        ),
        productosMasVendidos: this.procesadorDatos(datos).obtenerProductosMasVendidos(
          datos.compras,
          datos.productos
        ),
        patronesCompra: this.procesadorDatos(datos).analizarPatronesCompra(
          datos.compras,
          datos.clientes
        )
      };

      const promptSistema = `
        Eres un asistente experto en análisis de datos de un sistema de ventas.
        
        Análisis actual del sistema:
        ${JSON.stringify(datosAnalisis)}
        
        Datos actuales del sistema:
        ${JSON.stringify(datos)}
        
        Reglas:
        1. No revelar información sensible de clientes
        2. Dar respuestas concisas y relevantes
        3. Sugerir acciones basadas en los análisis proporcionados
        4. Si no tienes suficiente información, indícalo
        
        Pregunta del usuario: ${mensaje}
      `;

      const result = await this.chatbot.sendMessage(promptSistema);
      return result.response.text();
    } catch (error) {
      console.error("Error:", error);
      throw new Error("Lo siento, ocurrió un error al procesar tu mensaje");
    }
  }
}
