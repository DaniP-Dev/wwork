"use client";

import AddProduct from '@/components/AddProduct';
import EliminarEditar from '@/components/EliminarEditar';
import React from 'react';

const PageAddProduct = () => {
    return (
        <div className="flex flex-row flex-wrap h-screen items-center justify-center">
            <div className="flex-1 max-w-md p-2">
                <AddProduct />
            </div>
            <div className="flex-1 max-w-md p-2">
                <EliminarEditar />
            </div>
        </div>
    );
};

export default PageAddProduct;
