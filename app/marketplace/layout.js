"use client";
import React from 'react';
import "./globals.css";
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const LayoutMarket = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header role='marketplace' className="sticky top-0 w-full z-50" />
      <main className="flex-1 pt-16 md:pt-20 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default LayoutMarket;
