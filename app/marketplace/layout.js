"use client";
import React from 'react';
import "./globals.css";
import Footer from '@/components/Footer';
import Header from '@/components/Header';



const layoutMarket = ({ children }) => {
    return (
        <>
            <Header role='marketplace' />
            <div className="mt-16"> {/* Ajuste el margen superior */}
                {children}
            </div>
            <Footer />
        </>
    );
};

export default layoutMarket;
