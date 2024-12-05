"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

const Header = ({ role, onToggleSidebar }) => {
    const router = useRouter();

    const AdminHomeClick = () => {
        router.push('/admin/addProduct');
    };

    const MarketHomeClick = () => {
        router.push('/marketplace');
    };

    const RegistroClick = () => {
        router.push('/marketplace/registroClient');
    };


    let content;

    if (role === 'admin') {
        content = (
            <div className='flex items-center w-full'>

                <button className='flex-none mr-4' onClick={onToggleSidebar}>click</button>

                <div className="flex flex-grow justify-center space-x-8">
                    <a href="/marketplace" target="_blank" rel="noopener noreferrer">
                        MarketPlace
                    </a>
                    <a href="/admin" onClick={AdminHomeClick}>
                        Inicio
                    </a>
                </div>

            </div>
        );
    } else if (role === 'marketplace') {
        content = (
            <div className='flex justify-center w-full'>
                <button className='flex-none mr-4' onClick={RegistroClick} >Registrate!</button>

                <div className="flex flex-grow justify-center space-x-8">
                    <button className="hover:underline mx-4" onClick={MarketHomeClick}>Inicio</button>
                    <button className="hover:underline mx-4" href="#">Acerca de</button>
                    <button className="hover:underline mx-4" href="#">Contacto</button>

                </div>

            </div>
        );
    } else {
        content = <p>Perfil no reconocido</p>;
    }

    return (
        <header className='bg-blue-600 text-white p-4 shadow-lg flex fixed top-0 left-0 w-full h-16 z-50'>
            {content}
        </header>
    );
};

export default Header;
