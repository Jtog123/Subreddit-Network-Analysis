import React, { useState } from 'react';


function GraphPage( {graphs} ) {
    /*
        <div>
            <img src = {`http://localhost:5000/${graphs.bar_graph}`} alt="Bar Graph"/>
            <img src = {`http://localhost:5000/${graphs.heatmap}`} alt="heatmap"/>
            <img src = {`http://localhost:5000/${graphs.network_graph}`} alt="network graph"/>
        </div>
    */
    /*
    const slideContainer = 
        [
        <img src = {`http://localhost:5000/${graphs. bar_graph}`}   alt="Bar Graph"/>,
         <img src = {`http://localhost:5000/${graphs.heatmap}`} alt="heatmap"/>,
         <img src = {`http://localhost:5000/${graphs.network_graph}`} alt="network graph"/>
        ]
    */
    const[currentIndex, setCurrentIndex] = useState(0);

    const divContainer = 
    [
        <div className='bg-purple-400 w-full h-full flex justify-center items-center'> slide 1</div>,
        <div className='bg-purple-600 w-full h-full flex justify-center items-center'> slide 2</div>,
        <div className='bg-purple-800 w-full h-full flex justify-center items-center'> slide 3</div>

    ]

    function handleNextClick() {
        if(currentIndex < divContainer.length - 1) {
            setCurrentIndex(currentIndex + 1)
        }
        else {
            setCurrentIndex(divContainer.length - 1)
        }
        //setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, divContainer.length - 1));

    }

    function handlePrevClick() {
        if(currentIndex > 0) {
            setCurrentIndex(currentIndex - 1)
        }
        else {
            setCurrentIndex(0)
        }

        //setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }

    return (
        <div className="graph-page h-screen bg-black flex justify-center items-center">

            <div className="graph-container h-21/24 w-22/24 bg-white flex justify-center items-center">

                <div className="slide-container w-full h-full bg-red-400 flex flex-col justify-center items-center">

                    <div className="left-button-container bg-green-400 h-12 w-12 flex justify-center absolute left-5  transform -translate-y-1/2 items-center">
                        <button className="bg-blue-400 h-10 w-12 rounded-full"
                        onClick={handlePrevClick}>left</button>
                    </div>

                    <div className="right-button-container bg-green-400 h-12 w-12 flex justify-center absolute right-5  transform -translate-y-1/2 items-center">
                        <button className="bg-blue-400 h-10 w-12 rounded-full" onClick={handleNextClick}>right</button>
                    </div>

                    
                    <React.Fragment key = {currentIndex}>
                        {divContainer[currentIndex]}
                    </React.Fragment>
                    




                </div>

            </div>

        </div>

    )

}

export default GraphPage