import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase";

export const ServicioProductCard = {
  observarProductos: (callback) => {
    const productosQuery = query(
      collection(db, "productos"),
      where("disponible", "==", true)
    );

    return onSnapshot(
      productosQuery,
      (snapshot) => {
        const productsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          categoria: doc.data().categoria,
          iva: doc.data().iva,
          ...doc.data(),
        }));
        callback(productsList);
      },
      (error) => {
        console.error("Error escuchando cambios en productos: ", error);
      }
    );
  },
};
