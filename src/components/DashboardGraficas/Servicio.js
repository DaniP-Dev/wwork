"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

export const traerDatos = async () => {
    try {
        const categoriasGet = await getDocs(collection(db, "categorias"))
        const datos = categoriasGet.docs.map(doc => ({
            nombre: doc.id,
            totalVendido: doc.data().totalVendido
        }))
        return datos
    } catch (error) {
        console.log("Error:", error)
        return []
    }
}



const Servicio = () => {
    const [categorias, setCategorias] = useState([])

    useEffect(() => {
        traerDatos().then(datos => {
            setCategorias(datos)
        })
    }, [])

    return (
        <>
        </>
    );
};

export default Servicio;
