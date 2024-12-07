"use client";
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

const TotalVentas = () => {
    const [totalVentas, setTotalVentas] = useState(0);

    useEffect(() => {
        const fetchTotalVentas = async () => {
            try {
                const q = query(collection(db, "compras"), where("estado", "==", "completado"));
                const querySnapshot = await getDocs(q);
                let total = 0;

                querySnapshot.forEach((doc) => {
                    total += doc.data().total;
                });

                setTotalVentas(total);

            } catch (e) {
                console.error("Error fetching total ventas: ", e);
            }
        };

        fetchTotalVentas();
    }, []);

    return (
        <div>
            <h3 className="text-xl font-semibold">Total de Ventas</h3>
            <p className="text-lg">${totalVentas}</p>
        </div>
    );
};

export default TotalVentas;
