"use client";
import React, { useState } from "react";
import FormularioProductCard from "@/components/ProductCard/FormularioProductCard";
import { useLogicaProductCard } from "@/components/ProductCard/Logica";
import BotonComprar from "@/components/ProductCard/components/BotonComprar";

const PageMarket = () => {
  const [activeCard, setActiveCard] = useState(null);
  const {
    products,
    selectedProduct,
    showModal,
    handleProductClick,
    handleComprarClick,
    handleCloseModal,
  } = useLogicaProductCard();

  const handleCardClick = (productId) => {
    setActiveCard(productId);
  };

  return (
    <div className="container mx-auto p-6 sm:p-8">
      <div
        className="grid gap-x-12 gap-y-16 mt-16"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          margin: "0 auto",
          maxWidth: "1600px",
        }}
      >
        {products.map((product) => (
          <FormularioProductCard
            key={product.id}
            product={product}
            activeCard={activeCard}
            onCardClick={handleCardClick}
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
    </div>
  );
};

export default PageMarket;
