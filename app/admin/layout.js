"use client";
import React from 'react';
import "./globals.css";
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { useCallback, useEffect, useState } from 'react';
import FormularioChatBot from '@/components/ChatBot/FormularioChatBot';

const LayoutAdmin = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Combinamos los event listeners en un solo useEffect
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') setIsSidebarOpen(false);
        };
        
        const handleResize = () => {
            if (window.innerWidth < 768) setIsSidebarOpen(false);
        };

        window.addEventListener('keydown', handleEsc);
        window.addEventListener('resize', handleResize);
        
        // Limpieza de event listeners
        return () => {
            window.removeEventListener('keydown', handleEsc);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const toggleSidebar = useCallback(() => {
        setIsSidebarOpen(prev => !prev);
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col relative">
            <Header 
                role="admin" 
                onToggleSidebar={toggleSidebar}
            />
            <div className="flex flex-1 relative mt-16">
                <Sidebar 
                    isOpen={isSidebarOpen} 
                    onClose={() => setIsSidebarOpen(false)}
                    className="z-40 top-16"
                />
                <main 
                    className={`
                        flex-1 p-4 
                        transition-all duration-300
                        ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}
                        md:mr-[350px]
                    `}
                >
                    {children}
                </main>
            </div>
            <FormularioChatBot />
        </div>
    );
};

export default LayoutAdmin;
