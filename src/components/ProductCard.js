import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const ProductCard = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'productos'));
                const productsList = [];
                querySnapshot.forEach((doc) => {
                    productsList.push(doc.data());
                });
                setProducts(productsList);
            } catch (e) {
                console.error("Error fetching products: ", e);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="flex flex-wrap justify-center mt-16">
            {products.map((product, index) => (
                <div key={index} className="bg-white shadow-md rounded-lg p-4 m-2 flex flex-col w-full sm:w-64">
                    <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                        <img src={product.image || 'https://via.placeholder.com/150'} alt={product.nombre} className="w-full h-full object-cover rounded-t-lg" />
                    </div>
                    <div className="p-2 flex flex-col flex-grow">
                        <h2 className="text-lg font-semibold">{product.nombre}</h2>
                        <p className="text-gray-700 flex-grow">{product.descripcion}</p>
                        <p className="text-blue-600 font-bold">{product.precio}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductCard;
