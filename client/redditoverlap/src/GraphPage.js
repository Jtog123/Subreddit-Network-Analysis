import React, { useEffect, useState } from 'react';
import LoadingPage from './LoadingPage';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faHouse } from './icons';


function GraphPage( {graphs ,setGraphs, clearGraphs} ) {

    const[currentIndex, setCurrentIndex] = useState(0);
    const[isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        if (graphs && graphs.bar_graph && graphs.heatmap && graphs.network_graph) {
            

            const images = [
                graphs.bar_graph,  // Use relative paths if images are served from the static folder
                graphs.heatmap,
                graphs.network_graph
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
    
    const slideContainer = isLoaded
    ? [
        //<img key={graphs.bar_graph} className='w-full h-full' src={`http://localhost:5000/${graphs.bar_graph}`} alt="Bar Graph" />,
        //<img key={graphs.heatmap} className='w-full h-full' src={`http://localhost:5000/${graphs.heatmap}`} alt="Heatmap" />,
        //<img key={graphs.network_graph} className='w-full h-full' src={`http://localhost:5000/${graphs.network_graph}`} alt="Network Graph" />
        <img key={graphs.bar_graph} className='w-full h-full' src={graphs.bar_graph} alt="Bar Graph" />,
        <img key={graphs.heatmap} className='w-full h-full' src={graphs.heatmap} alt="Heatmap" />,
        <img key={graphs.network_graph} className='w-full h-full' src={graphs.network_graph} alt="Network Graph" />
    ]
    : [];
    
 
    /*
    const divContainer = 
    [
        <div className='bg-purple-400 w-full h-full flex justify-center items-center'> slide 1</div>,
        <div className='bg-purple-600 w-full h-full flex justify-center items-center'> slide 2</div>,
        <div className='bg-purple-800 w-full h-full flex justify-center items-center'> slide 3</div>

    ]
        */
    
    function handleHomeClick() {
        //setGraphs(null); // Clear graphs state before navigating home
        clearGraphs();
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

            <div className='flex justify-start items-start w-full  '>
                <div className='return-button-holder  w-20 h-20 ml-10 flex justify-center items-end '>
                    <button  onClick={handleHomeClick} className='return-button '>
                    <FontAwesomeIcon icon={faHouse} className='text-white h-10'/>
                    </button>
                </div>
            </div>

            

            <div className=" flex-grow graph-container h-21/24 w-3/6 bg-white flex justify-center items-center">

                <div className="slide-container w-full h-full  flex flex-col justify-center items-center relative">

                    <div className="left-button-container  h-12 w-12 flex justify-center items-center absolute -left-7 ">
                        <button className=" h-10 w-10 rounded-full bg-blue-500"
                        onClick={handlePrevClick}>
                            <FontAwesomeIcon icon={faArrowLeft} className=' h-5'/>
                        </button>
                    </div>
                    <div className="slide-content flex-grow flex justify-center items-center">
                        <React.Fragment key={currentIndex}>
                            {slideContainer[currentIndex]}
                        </React.Fragment>
                    </div>

                    <div className="right-button-container  h-12 w-12 flex justify-center items-center absolute -right-7">
                        <button className="bg-blue-500 h-10 w-10 rounded-full" onClick={handleNextClick}>
                            <FontAwesomeIcon icon={faArrowRight} className=' h-5'/>
                        </button>
                    </div>


                    




                </div>

            </div>

        </div>

    )

}

export default GraphPage