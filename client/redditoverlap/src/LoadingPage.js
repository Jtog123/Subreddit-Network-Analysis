import React from 'react';
import './LoadingPage.css';

function LoadingPage({ size = 200, thickness = 15, color1 = '#ff6b6b', color2 = '#4ecdc4', speed = 2 }){
    const ringStyle = {
        width: `${size}px`,
        height: `${size}px`,
        borderWidth: `${thickness}px`,
        animationDuration: `${speed}s`,
    };
    
    return (
        <div className="loading-container h-screen flex justify-center items-center">
            <div className="rings-wrapper ">
                <div className="ring ring-1" style={{...ringStyle, borderColor: color1}}></div>
                <div className="ring ring-2" style={{...ringStyle, borderColor: color2}}></div>
            </div>
        </div>
    );
}

export default LoadingPage