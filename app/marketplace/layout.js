"use client";
import React from 'react';
import "./globals.css";
import Footer from '@/components/Footer';
import Header from '@/components/Header';



const layoutMarket = ({ children }) => {
    return (
        <>
            <Header role='marketplace' />
            <div className="mt-16">
                {children}
            </div>
            <Footer />
        </>
    );
};

export default layoutMarket;
