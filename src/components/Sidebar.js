"use client";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const Sidebar = ({ isOpen, onClose, className }) => {
  const router = useRouter();
  const referenciaLateral = useRef(null);

  const clickAgregarProducto = () => {
    router.push("/admin/addProduct");
    onClose();
  };

  const manejarClickFuera = (evento) => {
    if (
      referenciaLateral.current &&
      !referenciaLateral.current.contains(evento.target)
    ) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", manejarClickFuera);
    return () => {
      document.removeEventListener("mousedown", manejarClickFuera);
    };
  }, []);

  return (
    <nav
      ref={referenciaLateral}
      className={`
                fixed top-16 left-0 
                h-[calc(100vh-4rem)] 
                w-64 
                bg-blue-600 
                text-white 
                p-4 
                transition-transform duration-300 ease-in-out 
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                z-40
                shadow-2xl
                ${className}
            `}
    >
      <ul>
        <li className="mb-4">
          <button
            className="w-full text-left py-2 px-4 hover:bg-blue-700 rounded bg-blue-600"
            onClick={clickAgregarProducto}
          >
            Ingreso y Edicion
          </button>
        </li>
        <li className="mb-4">
          <button 
            className="w-full text-left py-2 px-4 hover:bg-blue-700 rounded bg-blue-600"
          >
            Comportamiento de ventas
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
