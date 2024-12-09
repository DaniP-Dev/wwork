"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

const Header = ({ role, onToggleSidebar }) => {
    const router = useRouter();

    // Configuración de navegación por rol
    const navConfig = {
        admin: [
            { 
                label: 'MarketPlace', 
                action: () => window.open('/marketplace', '_blank'),
            },
            { 
                label: 'Inicio', 
                action: () => router.push('/admin/'),
            }
        ],
        marketplace: [
            { 
                label: 'Inicio', 
                action: () => router.push('/marketplace'),
            },
            { 
                label: 'Acerca de', 
                action: () => router.push('#'),
            },
            { 
                label: 'Contacto', 
                action: () => router.push('#'),
            }
        ]
    };

    const renderContent = () => {
        if (!navConfig[role]) {
            return <p>Perfil no reconocido</p>;
        }

        return (
            <div className='flex items-center w-full'>
                {role === 'admin' && (
                    <button 
                        className='flex-none mr-4' 
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleSidebar();
                        }}
                    >
                        ☰
                    </button>
                )}
                
                {role === 'marketplace' && (
                    <button 
                        className='flex-none mr-4' 
                        onClick={() => router.push('/marketplace/registroClient')}
                    >
                        Registrate!
                    </button>
                )}

                <nav className="flex flex-grow justify-center space-x-8">
                    {navConfig[role].map(({ label, action }) => (
                        <button 
                            key={label}
                            onClick={action}
                            className="hover:underline mx-4"
                        >
                            {label}
                        </button>
                    ))}
                </nav>
            </div>
        );
    };

    return (
        <header className='bg-blue-600 text-white p-4 shadow-lg flex fixed top-0 left-0 w-full h-16 z-50'>
            {renderContent()}
        </header>
    );
};

export default Header;
