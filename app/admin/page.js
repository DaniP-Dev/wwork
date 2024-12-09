import React from 'react';
import "./globals.css";
import TotalVentas from '@/components/TotalVentas';
import PromedioVentasPorDia from '@/components/PromedioVentasPorDia';
import IngresosPorCategoria from '@/components/IngresosPorCategoria';
import NumeroTransacciones from '@/components/NumeroTransacciones';
import TasaRetornoClientes from '@/components/TasaRetornoClientes';

const page = () => {
    return (
        <div>
            <div className="grid-container">
                <div className="card">
                    <div className="card-content">
                        <TotalVentas />
                    </div>
                </div>
                <div className="card">
                    <div className="card-content">
                        <NumeroTransacciones />
                    </div>
                </div>
                <div className="card">
                    <div className="card-content">
                        <PromedioVentasPorDia />
                    </div>
                </div>
                <div className="card">
                    <div className="card-content">
                        <TasaRetornoClientes />
                    </div>
                </div>
            </div>
            <div className="chart-container">
                <IngresosPorCategoria />
            </div>
        </div>
    );
};

export default page;