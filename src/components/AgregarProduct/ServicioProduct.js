import { collection, addDoc, getDocs, onSnapshot, doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

class ServicioProduct {
    async agregarProducto(productoData) {
        try {
            const productoConIva = {
                ...productoData,
                iva: Number(productoData.iva)
            };
            return await addDoc(collection(db, "productos"), productoConIva);
        } catch (error) {
            throw new Error('Error al agregar el producto: ' + error.message);
        }
    }

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
            throw new Error('Error al obtener categorías: ' + error.message);
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

    async agregarCategoria(nombreCategoria) {
        try {
            const categoriaRef = doc(db, 'categorias', nombreCategoria);
            await setDoc(categoriaRef, {
                nombre: nombreCategoria,
                creacion: new Date()
            });
            return true;
        } catch (error) {
            throw new Error('Error al agregar la categoría: ' + error.message);
        }
    }
}

export default ServicioProduct;
