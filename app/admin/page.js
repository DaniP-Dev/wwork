import React from 'react';
import "./globals.css";
import TotalVentas from '@/components/TotalVentas';
import PromedioVentasPorDia from '@/components/PromedioVentasPorDia';
import IngresosPorCategoria from '@/components/IngresosPorCategoria';
import NumeroTransacciones from '@/components/NumeroTransacciones';
import TasaRetornoClientes from '@/components/TasaRetornoClientes';

const page = () => {
    return (
        <div className="p-4">
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="py-8 px-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 flex items-center justify-center">
                    <div className="text-center w-full">
                        <TotalVentas />
                    </div>
                </div>
                <div className="py-8 px-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 flex items-center justify-center">
                    <div className="text-center w-full">
                        <NumeroTransacciones />
                    </div>
                </div>
                <div className="py-8 px-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 flex items-center justify-center">
                    <div className="text-center w-full">
                        <PromedioVentasPorDia />
                    </div>
                </div>
                <div className="py-8 px-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 flex items-center justify-center">
                    <div className="text-center w-full">
                        <TasaRetornoClientes />
                    </div>
                </div>
            </div>
            <div className="flex justify-center w-full mt-6">
                <div className="w-full max-w-screen-xl p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
                    <div className="text-center w-full">
                        <IngresosPorCategoria />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default page;