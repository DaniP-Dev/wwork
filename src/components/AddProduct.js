"use client";
import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

// Definir los campos del formulario de manera centralizada
const INITIAL_PRODUCT_STATE = {
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "calzado", 
    creacion: new Date(),
    stock_inicial: 100,
    imagenURL: "",
    disponibilidad: true,
};

const FORM_FIELDS = [
    { id: 'nombre', type: 'text', label: 'Nombre del Producto' },
    { id: 'descripcion', type: 'textarea', label: 'Descripción' },
    { id: 'precio', type: 'number', label: 'Precio' },
    { id: 'stock_inicial', type: 'number', label: 'Stock Inicial' },
    { id: 'imagenURL', type: 'text', label: 'URL de la Imagen' },
];

const AddProduct = ({ onProductAdd }) => {
    const [productData, setProductData] = useState(INITIAL_PRODUCT_STATE);
    const [categorias, setCategorias] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [mensajeExito, setMensajeExito] = useState(null);
    const [nuevaCategoria, setNuevaCategoria] = useState('');

    // Función para obtener categorías únicas
    const obtenerCategorias = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "productos"));
            const categoriasUnicas = new Set();
            
            querySnapshot.forEach((doc) => {
                const categoria = doc.data().categoria;
                if (categoria) {
                    categoriasUnicas.add(categoria.toLowerCase().trim());
                }
            });

            setCategorias(Array.from(categoriasUnicas).sort());
        } catch (error) {
            console.error("Error al obtener categorías:", error);
        }
    };

    // Cargar categorías al montar el componente
    useEffect(() => {
        // Primero obtenemos las categorías iniciales
        obtenerCategorias();

        // Configurar el listener en tiempo real
        const unsubscribe = onSnapshot(collection(db, "productos"), (snapshot) => {
            const categoriasUnicas = new Set();
            
            snapshot.forEach((doc) => {
                const categoria = doc.data().categoria;
                if (categoria) {
                    categoriasUnicas.add(categoria.toLowerCase().trim());
                }
            });

            setCategorias(Array.from(categoriasUnicas).sort());
        });

        // Limpiar el listener cuando el componente se desmonte
        return () => unsubscribe();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        
        if (name === 'categoria') {
            setProductData(prevData => ({
                ...prevData,
                categoria: value
            }));
        } else if (name === 'nuevaCategoria') {
            setNuevaCategoria(value);
        } else {
            setProductData(prevData => ({
                ...prevData,
                [name]: name === 'disponibilidad' ? value === 'true' : value,
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setMensajeExito(null);
        
        try {
            // Validar si la categoría es "nuevo" o "nueva"
            const categoriaFinal = productData.categoria === 'nueva' 
                ? nuevaCategoria.toLowerCase().trim() 
                : productData.categoria;

            if (categoriaFinal.toLowerCase() === 'nuevo' || categoriaFinal.toLowerCase() === 'nueva') {
                setError('No se permite usar "Nuevo" o "Nueva" como nombre de categoría.');
                setIsSubmitting(false);
                return;
            }

            const productToSave = {
                ...productData,
                categoria: categoriaFinal,
                precio: Number(productData.precio),
                stock_inicial: Number(productData.stock_inicial),
                creacion: new Date(),
            };

            await addDoc(collection(db, "productos"), productToSave);
            setProductData(INITIAL_PRODUCT_STATE);
            onProductAdd?.();
            setMensajeExito('¡Producto agregado exitosamente!');
            
            // Limpiar mensaje de éxito después de 3 segundos
            setTimeout(() => {
                setMensajeExito(null);
            }, 3000);
            
        } catch (error) {
            setError('Error al agregar el producto. Por favor, intente nuevamente.');
            console.error("Error al agregar el producto: ", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderField = ({ id, type, label }) => {
        if (type === 'textarea') {
            return (
                <textarea
                    id={id}
                    name={id}
                    value={productData[id]}
                    onChange={handleChange}
                    placeholder={label}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                />
            );
        }

        return (
            <input
                type={type}
                id={id}
                name={id}
                value={productData[id]}
                onChange={handleChange}
                placeholder={label}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
            />
        );
    };

    return (
        <div className="w-full bg-white shadow-lg rounded-lg p-4 h-full overflow-hidden">
            <div className="max-w-full bg-white rounded-lg h-full flex flex-col">
                <h2 className="text-2xl font-bold mb-2">Agregar Producto</h2>
                {error && (
                    <div className="mb-2 p-2 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}
                {mensajeExito && (
                    <div className="mb-2 p-2 bg-green-100 text-green-700 rounded">
                        {mensajeExito}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                    <div className="space-y-2">
                        {FORM_FIELDS.map((field) => (
                            <div key={field.id} className="mb-4">
                                {renderField(field)}
                            </div>
                        ))}
                        
                        <div className="mb-4">
                            <select
                                id="categoria"
                                name="categoria"
                                value={productData.categoria}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">Seleccione una categoría</option>
                                {categorias.map((categoria) => (
                                    <option key={categoria} value={categoria}>
                                        {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                                    </option>
                                ))}
                                <option value="nueva">+ Agregar nueva categoría</option>
                            </select>
                        </div>

                        {productData.categoria === 'nueva' && (
                            <div className="mb-4">
                                <input
                                    type="text"
                                    name="nuevaCategoria"
                                    value={nuevaCategoria}
                                    placeholder="Ingrese nueva categoría"
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                        )}

                        <div className="mb-4">
                            <select
                                id="disponibilidad"
                                name="disponibilidad"
                                value={productData.disponibilidad}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="true">Disponible</option>
                                <option value="false">No Disponible</option>
                            </select>
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`bg-blue-500 text-white px-4 py-2 rounded-md 
                                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                            >
                                {isSubmitting ? 'Agregando...' : 'Agregar Producto'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
