"use client";
import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const Sidebar = ({ isOpen, onClose }) => {
    const router = useRouter();
    const referenciaLateral = useRef(null);

    const clickAgregarProducto = () => {
        router.push('/admin/addProduct');
        onClose();
    };

    const manejarClickFuera = (evento) => {
        if (referenciaLateral.current && !referenciaLateral.current.contains(evento.target)) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', manejarClickFuera);
        return () => {
            document.removeEventListener('mousedown', manejarClickFuera);
        };
    }, []);

    return (
        <nav
            ref={referenciaLateral}
            className={`p-4 bg-blue-400 fixed top-16 left-0 h-[calc(100vh-64px)] w-64 transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
                } sidebar`}
            style={{ zIndex: 1000 }}
        >
            <ul>
                <li className="mb-4">
                    <button className="w-full text-left py-2 px-4 hover:bg-blue-500 rounded" onClick={clickAgregarProducto}>
                        Ingreso y Edicion
                    </button>
                </li>
                <li className="mb-4">
                    <button className="w-full text-left py-2 px-4 hover:bg-blue-500 rounded">
                        Comportamiento de ventas
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Sidebar;
