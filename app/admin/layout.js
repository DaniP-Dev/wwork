"use client";
import React from 'react';
import "./globals.css";
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { useCallback, useState } from 'react';
import FormularioChatBot from '@/components/ChatBot/FormularioChatBot';

const LayoutAdmin = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = useCallback(() => {
        setIsSidebarOpen(prev => !prev);
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Header 
                role="admin" 
                onToggleSidebar={toggleSidebar}
                className="fixed top-0 left-0 right-0 h-16 z-50 bg-white shadow-md"
            />

            <div className="flex flex-1 mt-16">
                <Sidebar 
                    isOpen={isSidebarOpen} 
                    onClose={() => setIsSidebarOpen(false)}
                    className={`
                        fixed top-16 left-0 
                        h-[calc(100vh-4rem)] 
                        w-64
                        transition-transform duration-300 ease-in-out
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                        md:translate-x-0 md:static md:h-[calc(100vh-4rem)]
                        z-40 bg-white shadow-lg
                    `}
                />

                <main className={`
                    flex-1 
                    transition-all duration-300 ease-in-out
                    w-full
                    ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'}
                `}>
                    <div className="container mx-auto px-4 py-6">
                        {children}
                    </div>
                </main>
            </div>

            <FormularioChatBot className="fixed bottom-4 right-4 z-40" />
        </div>
    );
};

export default LayoutAdmin;
