import React, { useState, useEffect } from 'react';
import { traerDatos } from './Servicio';

const Logica = () => {
    const [categorias, setCategorias] = useState([])

    useEffect(() => {
        traerDatos().then(datos => {
            setCategorias(datos)
        })
    }, [])

    return (
        <div>
            {categorias.map(cat => (
                <div key={cat.nombre}>
                    {cat.nombre}: {cat.totalVendido}
                </div>
            ))}
        </div>
    )
}

export default Logica;