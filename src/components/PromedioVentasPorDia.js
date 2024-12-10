"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

const PromedioVentasPorDia = () => {
  const [promedioVentasPorDia, setPromedioVentasPorDia] = useState(0);

  useEffect(() => {
    const fetchPromedioVentasPorDia = async () => {
      try {
        const q = query(
          collection(db, "compras"),
          where("estado", "==", "completado")
        );
        const querySnapshot = await getDocs(q);
        let totalVentas = 0;
        const fechas = new Set();

        querySnapshot.forEach((doc) => {
          totalVentas += doc.data().total;
          const fecha = doc.data().fecha;

          // Verificar si fecha es un objeto Date o una cadena de texto
          if (fecha && fecha.toDate) {
            fechas.add(fecha.toDate().toLocaleDateString());
          } else {
            fechas.add(new Date(fecha).toLocaleDateString());
          }
        });

        const promedio = totalVentas / fechas.size;
        setPromedioVentasPorDia(promedio);
      } catch (e) {
        console.error("Error fetching promedio ventas por día: ", e);
      }
    };

    fetchPromedioVentasPorDia();
  }, []);

  return (
    <div>
      <h3 className="text-xl font-semibold">Promedio de Ventas por Día</h3>
      <p className="text-lg">${promedioVentasPorDia.toFixed(2)}</p>
    </div>
  );
};

export default PromedioVentasPorDia;
