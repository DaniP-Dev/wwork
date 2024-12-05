"use client";

import AddProduct from '@/components/AddProduct';
import EliminarEditar from '@/components/EliminarEditar';
import React from 'react';

const PageAddProduct = () => {
    return (
        <div className="flex flex-row w-full h-screen items-center justify-center">
            {/* Componente AddProduct */}
            <div className="flex-1 max-w-lg p-2">
                <AddProduct />
            </div>
            {/* Componente EliminarEditar */}
            <div className="flex-1 max-w-lg p-2">
                <EliminarEditar />
            </div>
        </div>
    );
};

export default PageAddProduct;
