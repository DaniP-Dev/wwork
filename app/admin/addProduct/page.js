"use client";
import EliminarEditar from '@/components/EliminarEditar';
import Formulario from '@/components/AgregarProduct/Formulario';
import React from 'react';

const PageAddProduct = () => {
    return (
        <div className="container mx-auto px-1 py-2 md:px-4 md:py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-8">
                <div className="w-full p-1 md:p-4 border-b md:border-b-0 md:border-r border-gray-300">
                    <Formulario />
                </div>
                <div className="w-full p-1 md:p-4">
                    <EliminarEditar />
                </div>
            </div>
        </div>
    );
};

export default PageAddProduct;
