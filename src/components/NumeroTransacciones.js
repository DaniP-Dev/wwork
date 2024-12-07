"use client";

import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

const NumeroTransacciones = () => {
    const [numeroTransacciones, setNumeroTransacciones] = useState(0);

    useEffect(() => {
        const fetchNumeroTransacciones = async () => {
            try {
                const q = query(collection(db, "compras"), where("estado", "==", "completado"));
                const querySnapshot = await getDocs(q);
                let transacciones = 0;

                querySnapshot.forEach(() => {
                    transacciones += 1;
                });

                setNumeroTransacciones(transacciones);

            } catch (e) {
                console.error("Error fetching numero transacciones: ", e);
            }
        };

        fetchNumeroTransacciones();
    }, []);

    return (
        <div>
            <h3 className="text-xl font-semibold">Número de Transacciones</h3>
            <p className="text-lg">{numeroTransacciones}</p>
        </div>
    );
};

export default NumeroTransacciones;
