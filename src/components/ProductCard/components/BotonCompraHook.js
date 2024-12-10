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
} from "firebase/firestore";
import { db } from "../../../firebase";

const useLogicaCompra = (productoID, precioUnitario, onClose) => {
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
    if (!formData.email || !formData.password || formData.cantidad < 1) {
      throw new Error("Por favor complete todos los campos correctamente");
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

    const compra = {
      clienteID: clienteDoc.id,
      fecha: new Date().toISOString(),
      productos: [
        {
          productoID,
          cantidad: Number(formData.cantidad),
          precioUnitario,
        },
      ],
      total: Number(formData.cantidad) * precioUnitario,
      metodoPago: formData.metodoPago,
      estado: "completado",
    };

    const compraRef = await addDoc(collection(db, "compras"), compra);
    await updateDoc(doc(db, "clientes", clienteDoc.id), {
      historialCompras: arrayUnion({ ...compra, id: compraRef.id }),
    });

    return compraRef;
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
