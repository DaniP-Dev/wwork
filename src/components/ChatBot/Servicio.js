import { crearNuevoChat } from './GeminiConfig.js';
import { db } from '@/firebase';
import { collection, query, limit, getDocs } from 'firebase/firestore';

export class ServicioChatBot {
  constructor() {
    this.chat = crearNuevoChat();
  }

  async obtenerTodasLasColecciones() {
    try {
      const datos = {};
      
      // Lista exacta de tus colecciones
      const colecciones = [
        'categorias',
        'clientes',
        'compras',
        'facturas',
        'productos'
      ];

      // Obtener datos de cada colección
      for (const nombreColeccion of colecciones) {
        const coleccionRef = collection(db, nombreColeccion);
        const q = query(coleccionRef, limit(50)); // Aumentamos el límite a 50 documentos
        const snapshot = await getDocs(q);
        
        const documentos = [];
        snapshot.forEach((doc) => {
          documentos.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        datos[nombreColeccion] = documentos;
      }

      return JSON.stringify(datos, null, 2);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      return "";
    }
  }

  async enviarMensaje(mensaje) {
    try {
      const contextoDatos = await this.obtenerTodasLasColecciones();
      
      const mensajeConContexto = `
        Eres un asistente experto en análisis de datos empresariales.
        
        Datos actuales de la base de datos: ${contextoDatos}
        
        Instrucciones específicas:
        1. FORMATO DE RESPUESTA:
           - Título en mayúsculas
           - Usar números consecutivos al inicio de cada línea
           - Formato compacto y claro
           
        2. EJEMPLOS DE FORMATO:

           PRECIOS PRODUCTOS ACTUALES
           1. Producto A - $1.000
           2. Producto B - $5.000
           3. Producto C - $7.500
           
           o
           
           CLIENTES RECIENTES
           1. Cliente A - 3 compras
           2. Cliente B - 1 compra
           3. Cliente C - 2 compras
           
           o
           
           RESUMEN DE VENTAS
           1. Total vendido - $500.000
           2. Productos vendidos - 25
           3. Clientes atendidos - 10

        3. REGLAS IMPORTANTES:
           - Números consecutivos al inicio de cada línea
           - Información concisa y en la misma línea
           - Sin saltos de línea extra entre items
           - Solo salto de línea entre secciones diferentes

        Pregunta del usuario: ${mensaje}

        Responde usando este formato numerado y claro.
      `;

      const result = await this.chat.sendMessage(mensajeConContexto);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error al comunicarse con Gemini:", error);
      throw new Error("No pude procesar tu mensaje en este momento");
    }
  }

  reiniciarChat() {
    this.chat = crearNuevoChat();
  }
}
