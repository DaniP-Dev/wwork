"use client";
import EliminarEditar from '@/components/EliminarEditar';
import Formulario from '@/components/AgregarProduct/Formulario';
import React from 'react';

const PageAddProduct = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="w-full">
                    <Formulario />
                </div>
                <div className="w-full">
                    <EliminarEditar />
                </div>
            </div>
        </div>
    );
};

export default PageAddProduct;
