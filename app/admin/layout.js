"use client";
import React, { useState, useCallback } from 'react';
import "./globals.css";
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';

const LayoutAdmin = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = useCallback(() => {
        setIsSidebarOpen(prevState => !prevState);
    }, []);

    const closeSidebar = useCallback(() => {
        setIsSidebarOpen(false);
    }, []);

    return (
        <>
            <Header role='admin' onToggleSidebar={toggleSidebar} />
            <div className="flex">
                <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
                <div className="flex-1 mt-16">
                    {children}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default LayoutAdmin;
