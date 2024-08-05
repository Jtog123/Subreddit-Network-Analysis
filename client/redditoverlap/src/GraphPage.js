import React, { useEffect, useState } from 'react';
import LoadingPage from './LoadingPage';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faHouse } from './icons';


function GraphPage( {graphs ,setGraphs} ) {

    const[currentIndex, setCurrentIndex] = useState(0);
    const[isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();

    /*
        <div>
            <img src = {`http://localhost:5000/${graphs.bar_graph}`} alt="Bar Graph"/>
            <img src = {`http://localhost:5000/${graphs.heatmap}`} alt="heatmap"/>
            <img src = {`http://localhost:5000/${graphs.network_graph}`} alt="network graph"/>
        </div>
    */
        /*
        Ensure that all graphs a fully loaded before rendering them to prevent background from showing.
        Create an array of image load promises then use promise.all to wait for all images to load before setting loading to setisLoaded to true

        Use promises
        */

    useEffect(() => {
        if (graphs && graphs.bar_graph && graphs.heatmap && graphs.network_graph) {

            const images = [
                `http://localhost:5000/${graphs.bar_graph}`,
                `http://localhost:5000/${graphs.heatmap}`,
                `http://localhost:5000/${graphs.network_graph}`
            ];

            const imageLoadPromises = images.map((src) => {
                return new Promise((resolve) => {
                    const img =  new Image()
                    img.src = src;
                    img.onload = resolve
                    img.onerror = resolve
                })
            })

            Promise.all(imageLoadPromises).then(() => {
                setIsLoaded(true);
            })
                //setIsLoaded(true);
        }
    }, [graphs])
    
    const slideContainer = isLoaded ? 
    [
        <img className='w-full h-full' src = {`http://localhost:5000/${graphs.bar_graph}`} alt="Bar Graph"/>,
        <img className='w-full h-full' src = {`http://localhost:5000/${graphs.heatmap}`} alt="heatmap"/>,
        <img className='w-full h-full' src = {`http://localhost:5000/${graphs.network_graph}`} alt="network graph"/>
    ] : [];
    
 
    /*
    const divContainer = 
    [
        <div className='bg-purple-400 w-full h-full flex justify-center items-center'> slide 1</div>,
        <div className='bg-purple-600 w-full h-full flex justify-center items-center'> slide 2</div>,
        <div className='bg-purple-800 w-full h-full flex justify-center items-center'> slide 3</div>

    ]
        */
    
    function handleHomeClick() {
        setGraphs(null); // Clear graphs state before navigating home
        navigate("/");
    }

    function handleNextClick() {
        if(currentIndex < slideContainer.length - 1) {
            setCurrentIndex(currentIndex + 1)
        }
        else {
            setCurrentIndex(slideContainer.length - 1)
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

    if(! isLoaded) {
        return <LoadingPage/>
    }

    return (
        <div className="graph-page h-screen bg-black flex justify-center items-center flex-col ">

            <div className='flex justify-start items-start w-full  bg-green-300'>
                <div className='return-button-holder  w-20 h-20 ml-10 flex justify-center items-end bg-blue-200'>
                    <button  onClick={handleHomeClick} className='return-button '>
                    <FontAwesomeIcon icon={faHouse} className='bg-blue-200 h-10'/>
                    </button>
                </div>
            </div>

            

            <div className=" flex-grow graph-container h-21/24 w-3/6 bg-white flex justify-center items-center">

                <div className="slide-container w-full h-full bg-red-400 flex flex-col justify-center items-center relative">

                    <div className="left-button-container  h-12 w-12 flex justify-center items-center absolute -left-7">
                        <button className="bg-blue-400 h-10 w-10 rounded-full"
                        onClick={handlePrevClick}>
                            <FontAwesomeIcon icon={faArrowLeft} className='bg-blue-400 h-5'/>
                        </button>
                    </div>
                    <div className="slide-content flex-grow flex justify-center items-center">
                        <React.Fragment key={currentIndex}>
                            {slideContainer[currentIndex]}
                        </React.Fragment>
                    </div>

                    <div className="right-button-container  h-12 w-12 flex justify-center items-center absolute -right-7">
                        <button className="bg-blue-400 h-10 w-10 rounded-full" onClick={handleNextClick}>
                            <FontAwesomeIcon icon={faArrowRight} className='bg-blue-400 h-5'/>
                        </button>
                    </div>


                    




                </div>

            </div>

        </div>

    )

}

export default GraphPage