import React from 'react';
import './LoadingPage.css';

function LoadingPage({ size = 200, thickness = 15, speed = 2 }){
    const ringStyle = {
        width: `${size}px`,
        height: `${size}px`,
        borderWidth: `${thickness}px`,
        animationDuration: `${speed}s`,
    };
    
    return (
        <div className="loading-container h-screen flex justify-center items-center flex-col bg-black">
            <div className="rings-wrapper ">
                <div className="ring ring-1 " style={{...ringStyle, borderColor: '#3b82f6'}}></div>
                <div className="ring ring-2 " style={{...ringStyle, borderColor: '#a855f7'}}></div>
            </div>
            <h1 className='mt-20 text-white'>Loading... This may take several minutes</h1>
        </div>
    );
}

export default LoadingPage