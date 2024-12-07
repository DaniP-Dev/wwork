"use client";

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const TasaRetornoClientes = () => {
    const [tasaRetorno, setTasaRetorno] = useState(0);

    useEffect(() => {
        const fetchTasaRetornoClientes = async () => {
            try {
                const clientesSnapshot = await getDocs(collection(db, "clientes"));
                const comprasSnapshot = await getDocs(collection(db, "compras"));

                const clientesUnicos = new Set();
                const clientesRecurrentes = new Set();

                comprasSnapshot.forEach((doc) => {
                    const clienteId = doc.data().clienteID;
                    if (clientesUnicos.has(clienteId)) {
                        clientesRecurrentes.add(clienteId);
                    } else {
                        clientesUnicos.add(clienteId);
                    }
                });

                const tasa = (clientesRecurrentes.size / clientesUnicos.size) * 100;
                setTasaRetorno(tasa.toFixed(2));

            } catch (e) {
                console.error("Error fetching tasa de retorno de clientes: ", e);
            }
        };

        fetchTasaRetornoClientes();
    }, []);

    return (
        <div>
            <h3 className="text-xl font-semibold">Tasa de Retorno de Clientes</h3>
            <p className="text-lg">{tasaRetorno}%</p>
        </div>
    );
};

export default TasaRetornoClientes;
