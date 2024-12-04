
import React from 'react';

const Content = ({ children, className = '' }) => {
    return (
        <>
            <div className={`p-5 bg-red-500 flex flex-col flex-1  ${className}`} >
                <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
                <div className='flex-1 overflow-auto'> 
                    {children}
                </div>
            </div>
        </>
    );
};

export default Content;
