import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";

class ServicioProduct {
  agregarProducto = async (productoData, archivo) => {
    try {
      const productId = doc(collection(db, "productos")).id;

      let imagenURL = null;
      if (archivo) {
        imagenURL = await this.subirImagen(archivo, productId);
      }

      const productoConImagen = {
        ...productoData,
        imagenURL: imagenURL,
        id: productId,
      };

      await setDoc(doc(db, "productos", productId), productoConImagen);

      return productoConImagen;
    } catch (error) {
      console.error("Error al agregar producto:", error);
      throw error;
    }
  };

  agregarCategoria = async (nombreCategoria) => {
    try {
      const categoriaRef = doc(db, "categorias", nombreCategoria);
      await setDoc(categoriaRef, {
        nombre: nombreCategoria,
        creacion: new Date(),
        ventas: 0,
      });
      return true;
    } catch (error) {
      throw new Error("Error al agregar la categoría: " + error.message);
    }
  };

  async obtenerCategorias() {
    try {
      const querySnapshot = await getDocs(collection(db, "productos"));
      const categoriasUnicas = new Set();

      querySnapshot.forEach((doc) => {
        const categoria = doc.data().categoria;
        if (categoria) {
          categoriasUnicas.add(categoria.toLowerCase().trim());
        }
      });

      return Array.from(categoriasUnicas).sort();
    } catch (error) {
      throw new Error("Error al obtener categorías: " + error.message);
    }
  }

  observarCategorias(callback) {
    return onSnapshot(collection(db, "productos"), (snapshot) => {
      const categoriasUnicas = new Set();
      snapshot.forEach((doc) => {
        const categoria = doc.data().categoria;
        if (categoria) {
          categoriasUnicas.add(categoria.toLowerCase().trim());
        }
      });
      callback(Array.from(categoriasUnicas).sort());
    });
  }

  async subirImagen(archivo, productId) {
    try {
      const nombreArchivo = `productos/${productId}-${archivo.name}`;
      const storageRef = ref(storage, nombreArchivo);

      const snapshot = await uploadBytes(storageRef, archivo);

      const url = await getDownloadURL(snapshot.ref);

      return url;
    } catch (error) {
      console.error("Error al subir imagen:", error);
      throw new Error("Error al subir la imagen");
    }
  }
}

export default ServicioProduct;
