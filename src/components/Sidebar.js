"use client";
import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const Sidebar = ({ isOpen, onClose }) => {
    const router = useRouter();
    const sidebarRef = useRef(null);

    const AddProductClick = () => {
        router.push('/admin/addProduct');
    };

    const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav
            ref={sidebarRef}
            className={`p-4 bg-blue-400 fixed top-16 left-0 h-[calc(100vh-64px)] w-64 transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
                } sidebar`}
            style={{ zIndex: 1000 }}
        >
            <ul>
                <li className="mb-4">
                    <button className="w-full text-left py-2 px-4 hover:bg-blue-500 rounded" onClick={AddProductClick}>
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
