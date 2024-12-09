"use client";
import React from 'react';
import FormularioProductCard from '@/components/ProductCard/FormularioProductCard';
import { useLogicaProductCard } from '@/components/ProductCard/Logica';
import BotonComprar from '@/components/ProductCard/components/BotonComprar';

const PageMarket = () => {
    const {
        products,
        selectedProduct,
        showModal,
        handleProductClick,
        handleComprarClick,
        handleCloseModal
    } = useLogicaProductCard();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-16">
            {products.map(product => (
                <FormularioProductCard 
                    key={product.id}
                    product={product}
                    onComprarClick={() => handleComprarClick(product)}
                />
            ))}
            
            {showModal && selectedProduct && (
                <BotonComprar 
                    productoID={selectedProduct.id}
                    precioUnitario={selectedProduct.valor_venta}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default PageMarket;
