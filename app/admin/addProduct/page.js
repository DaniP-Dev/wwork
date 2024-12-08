"use client";
import AddProduct from '@/components/AddProduct';
import EliminarEditar from '@/components/EliminarEditar';
import React from 'react';

const PageAddProduct = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="w-full">
                    <AddProduct />
                </div>
                <div className="w-full">
                    <EliminarEditar />
                </div>
            </div>
        </div>
    );
};

export default PageAddProduct;
