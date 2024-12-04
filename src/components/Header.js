"use client";
import React from 'react';

const Header = ({ role, onToggleSidebar }) => {
    let content;

    if (role === 'admin') {
        content = (
            <div className='flex justify-between items-center w-full'>
                <button className='flex-none' onClick={onToggleSidebar}>click</button>
                <a className='mx-auto'>MarketPlace</a>
            </div>
        );
    } else if (role === 'marketplace') {
        content = (
            <div className='flex justify-center w-full'>
                <a className="hover:underline mx-4" href="#">Inicio</a>
                <a className="hover:underline mx-4" href="#">Acerca de</a>
                <a className="hover:underline mx-4" href="#">Contacto</a>
            </div>
        );
    } else {
        content = <p>Perfil no reconocido</p>;
    }

    return (
        <header className='bg-blue-600 text-white p-4 shadow-lg flex justify-center items-center fixed top-0 left-0 w-full h-16 z-50'>
            {content}
        </header>
    );
};

export default Header;
