import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/firebase";

class ServicioEditarEliminar {
  observarProductos(callback) {
    return onSnapshot(collection(db, "productos"), (snapshot) => {
      const productos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(productos);
    });
  }

  async eliminarProducto(idProducto) {
    try {
      await deleteDoc(doc(db, "productos", idProducto));
      return true;
    } catch (error) {
      throw new Error("Error al eliminar el producto: " + error.message);
    }
  }

  async actualizarProducto(idProducto, datosActualizados) {
    try {
      const refProducto = doc(db, "productos", idProducto);
      await updateDoc(refProducto, datosActualizados);
      return true;
    } catch (error) {
      throw new Error("Error al actualizar el producto: " + error.message);
    }
  }

  async obtenerCategorias() {
    const querySnapshot = await getDocs(collection(db, "productos"));
    const categoriasUnicas = new Set();

    querySnapshot.forEach((doc) => {
      const categoria = doc.data().categoria;
      if (categoria) {
        categoriasUnicas.add(categoria.toLowerCase().trim());
      }
    });

    return Array.from(categoriasUnicas).sort();
  }
}

export default ServicioEditarEliminar;
