"use client";
import AddProduct from '@/components/AddProduct';
import EliminarEditar from '@/components/EliminarEditar';
import React from 'react';

const PageAddProduct = () => {
    return (
        <div className="container">
            <div className="component">
                <AddProduct />
            </div>
            <div className="component">
                <EliminarEditar />
            </div>
        </div>
    );
};

export default PageAddProduct;
