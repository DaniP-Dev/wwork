import { useState } from "react";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../../../firebase";

const useLogicaCompra = (productoID, precioUnitario, categoria, iva, onClose) => {
  const initialFormState = {
    email: "",
    password: "",
    metodoPago: "tarjeta",
    cantidad: 1,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const mostrarNotificacion = (type, message) => {
    setNotification({ type, message });
    if (type === "success") {
      setTimeout(() => {
        setNotification({ type: "", message: "" });
        onClose();
      }, 2000);
    }
  };

  const procesarCompra = async () => {
    try {
      if (!formData.email || !formData.password || formData.cantidad < 1) {
        throw new Error("Por favor complete todos los campos correctamente");
      }

      if (!productoID) {
        console.error("Falta productoID:", productoID);
        throw new Error("ID del producto no disponible");
      }
      if (!precioUnitario) {
        console.error("Falta precioUnitario:", precioUnitario);
        throw new Error("Precio del producto no disponible");
      }
      if (!categoria) {
        console.error("Falta categoria:", categoria);
        throw new Error("Categoría del producto no disponible");
      }
      if (iva === undefined || iva === null) {
        console.error("Falta iva o es inválido:", iva);
        throw new Error("IVA del producto no disponible");
      }

      const clienteQuery = query(
        collection(db, "clientes"),
        where("email", "==", formData.email)
      );
      const clienteSnapshot = await getDocs(clienteQuery);

      if (clienteSnapshot.empty) {
        throw new Error("Correo electrónico no encontrado");
      }

      const clienteDoc = clienteSnapshot.docs[0];
      const clienteData = clienteDoc.data();

      if (clienteData.contraseña !== formData.password) {
        throw new Error("Credenciales inválidas");
      }

      // Calcular precio sin IVA
      const ivaNumerico = Number(iva);
      const precioSinIva = precioUnitario / (1 + (ivaNumerico / 100));
      const cantidadTotal = Number(formData.cantidad);
      const ventasSinIva = precioSinIva * cantidadTotal;

      const compra = {
        clienteID: clienteDoc.id,
        fecha: new Date().toISOString(),
        productos: [
          {
            productoID,
            cantidad: cantidadTotal,
            precioUnitario,
            precioSinIva
          },
        ],
        total: cantidadTotal * precioUnitario,
        metodoPago: formData.metodoPago,
        estado: "completado",
      };

      const compraRef = await addDoc(collection(db, "compras"), compra);
      await updateDoc(doc(db, "clientes", clienteDoc.id), {
        historialCompras: arrayUnion({ ...compra, id: compraRef.id }),
      });

      const categoriaRef = doc(db, "categorias", categoria);
      const categoriaDoc = await getDoc(categoriaRef);

      if (categoriaDoc.exists()) {
        const ventasActuales = categoriaDoc.data().ventas || 0;
        await updateDoc(categoriaRef, {
          ventas: ventasActuales + ventasSinIva
        });
      }

      return compraRef;
    } catch (error) {
      console.error("Error en procesarCompra:", {
        error,
        params: { 
          productoID, 
          precioUnitario, 
          categoria, 
          iva: Number(iva)
        }
      });
      throw error;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setNotification({ type: "", message: "" });

    try {
      await procesarCompra();
      mostrarNotificacion("success", "¡Compra realizada con éxito!");
      setFormData(initialFormState);
    } catch (error) {
      console.error("Error al realizar la compra:", error);
      mostrarNotificacion("error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    showPassword,
    notification,
    handleChange,
    handleSubmit,
    setShowPassword,
  };
};

export default useLogicaCompra;
