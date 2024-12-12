"use client";

import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";

const IngresosPorCategoria = () => {
  const [ingresosPorCategoria, setIngresosPorCategoria] = useState({});

  useEffect(() => {
    // Crear una query ordenada por nombre para consistencia
    const categoriasQuery = query(
      collection(db, "categorias"),
      orderBy("nombre")
    );

    // Configurar el listener en tiempo real
    const unsubscribe = onSnapshot(
      categoriasQuery,
      {
        next: (snapshot) => {
          const categoriaIngreso = {};
          snapshot.docs.forEach((doc) => {
            const categoria = doc.data();
            if (categoria.nombre) {
              categoriaIngreso[categoria.nombre] = Number(categoria.ventas) || 0;
            }
          });
          console.log("Datos actualizados:", categoriaIngreso); // Para debugging
          setIngresosPorCategoria(categoriaIngreso);
        },
        error: (error) => {
          console.error("Error en el listener de categorías:", error);
        }
      }
    );

    // Limpiar el listener
    return () => {
      console.log("Limpiando listener de categorías");
      unsubscribe();
    };
  }, []);

  // Ordenar categorías por valor de ventas (opcional)
  const categorias = Object.keys(ingresosPorCategoria).sort((a, b) => 
    ingresosPorCategoria[b] - ingresosPorCategoria[a]
  );
  const ingresos = categorias.map(cat => ingresosPorCategoria[cat]);

  return (
    <div className="w-full h-full min-h-[400px] p-4">
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="w-full max-w-[500px] h-auto aspect-square">
          <Doughnut
            data={{
              labels: categorias,
              datasets: [
                {
                  label: "Ventas por Categoría (sin IVA)",
                  data: ingresos,
                  backgroundColor: [
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                    "rgba(255, 159, 64, 0.6)",
                  ],
                  borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 159, 64, 1)",
                  ],
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  position: "bottom",
                  display: true,
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const total = context.dataset.data.reduce(
                        (a, b) => a + b,
                        0
                      );
                      const value = context.raw || 0;
                      const percentage =
                        total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
                      return `${
                        context.label
                      }: $${value.toLocaleString()} (${percentage}%)`;
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default IngresosPorCategoria;
