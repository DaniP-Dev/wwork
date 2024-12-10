import { useState, useEffect } from "react";
import { ServicioProductCard } from "./Servicio";

export const useLogicaProductCard = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const unsubscribe = ServicioProductCard.observarProductos(
      (productsList) => {
        setProducts(productsList);

        if (
          selectedProduct &&
          !productsList.find((p) => p.id === selectedProduct.id)
        ) {
          setSelectedProduct(null);
          setShowModal(false);
        }
      }
    );

    return () => unsubscribe();
  }, [selectedProduct]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleComprarClick = (e) => {
    e.stopPropagation();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  return {
    products,
    selectedProduct,
    showModal,
    handleProductClick,
    handleComprarClick,
    handleCloseModal,
  };
};
