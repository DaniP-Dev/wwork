"use client";
import React from 'react';
import "./globals.css";
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const LayoutMarket = ({ children }) => {
  return (
    <div className="flex flex-col flex-1">
      <Header role='marketplace' />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default LayoutMarket;
