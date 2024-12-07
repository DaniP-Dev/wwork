"use client";

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const IngresosPorCategoria = () => {
    const [ingresosPorCategoria, setIngresosPorCategoria] = useState({});

    useEffect(() => {
        const fetchIngresosPorCategoria = async () => {
            try {
                const productosSnapshot = await getDocs(collection(db, "productos"));
                const comprasSnapshot = await getDocs(collection(db, "compras"));

                const categoriaIngreso = {};

                productosSnapshot.forEach((doc) => {
                    const producto = doc.data();
                    const categoria = producto.categoria;

                    if (!categoriaIngreso[categoria]) {
                        categoriaIngreso[categoria] = 0;
                    }

                    const stockInicial = producto.stock_inicial;
                    const ventasRealizadas = producto.stock_inicial - producto.disponibilidad;
                    const cantidadVendida = stockInicial - ventasRealizadas;
                    const precioVenta = producto.precio;

                    categoriaIngreso[categoria] += cantidadVendida * precioVenta;
                });

                setIngresosPorCategoria(categoriaIngreso);

            } catch (e) {
                console.error("Error fetching ingresos por categoria: ", e);
            }
        };

        fetchIngresosPorCategoria();
    }, []);

    const categorias = Object.keys(ingresosPorCategoria);
    const ingresos = Object.values(ingresosPorCategoria);

    return (
        <div className="relative mx-auto h-96 w-full">
            <Bar
                data={{
                    labels: categorias,
                    datasets: [{
                        label: 'Ingresos por Categoría',
                        data: ingresos,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                }}
                options={{ responsive: true }}
            />
        </div>
    );
};

export default IngresosPorCategoria;
