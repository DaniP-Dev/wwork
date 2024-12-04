"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

const Sidebar = ({ isOpen }) => {
    const router = useRouter();

    const handleAddProductClick = () => {
        router.push('/admin/addProduct');
    };

    return (
        <nav
            className={`p-4 bg-blue-400 fixed top-16 left-0 h-[calc(100vh-64px)] w-64 transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
                } sidebar`}
        >
            <ul>
                <li className="mb-4">
                    <button className="w-full text-left py-2 px-4 hover:bg-blue-500 rounded" onClick={handleAddProductClick}>
                        Agregar Producto
                    </button>
                </li>
                <li className="mb-4">
                    <button className="w-full text-left py-2 px-4 hover:bg-blue-500 rounded">Botón 1</button>
                </li>
            </ul>
        </nav>
    );
};

export default Sidebar;
