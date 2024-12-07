import React from 'react';
import "./globals.css";
import TotalVentas from '@/components/TotalVentas';
import PromedioVentasPorDia from '@/components/PromedioVentasPorDia';
import IngresosPorCategoria from '@/components/IngresosPorCategoria';
import NumeroTransacciones from '@/components/NumeroTransacciones';
import TasaRetornoClientes from '@/components/TasaRetornoClientes';
const page = () => {
    return (
        <>
            <div>
                <div>
                    <IngresosPorCategoria />
                </div>

                <div>
                    <TotalVentas />
                </div>
                <div>
                    <PromedioVentasPorDia />
                </div>
                <div>
                    <NumeroTransacciones />
                </div>
                <div>
                    <TasaRetornoClientes />

                </div>

            </div>

        </>
    );
};

export default page;