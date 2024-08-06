import {React} from 'react'
import { useRef, useState, useEffect } from 'react';
//const axios = require('axios')
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from './icons';

function FloatingElement({ className }) {
    const animationDuration = useRef(30 + Math.random() * 20);
    const animationDelay = useRef(Math.random() * -30);
  
    return (
      <div 
        className={`absolute rounded-full floating-element ${className}`} 
        style={{
                animationDuration: `${animationDuration.current}s`,
                animationDelay: `${animationDelay.current}s`
          //animationDuration: `float ${animationDuration}s infinite linear`,
          //animationDelay: `${animationDelay}s`
        }}
      />
    );
}






function FrontPage( {loading, setLoading, setGraphs} ) {

    const [inputText, setInputText] = useState('')
    const [sampleSize, setSampleSize] = useState('1')
    /*
    useEffect(() => {
        if (loading) {
            async function sendInput() {
                try {
                    let result =  await axios.post('http://localhost:5000/test', {inputText})
                    console.log(result)
                } catch (err) {
                    console.error(err)
                }
            }
            sendInput()
        }
    }, [loading , inputText])
    */

    useEffect(() => {
        setGraphs(null)
    }, [setGraphs])

    async function sendInput() {
        try {
            let result = await axios.post('http://localhost:5000//text-and-sample-input', {inputText, sampleSize})
            setGraphs(result.data)
            setLoading(false)
            console.log(result)
        } catch (err) {
            console.error("Here is your error good sir ", err)
            setLoading(false)
        }
        
    }

    function handleSubmit(e) {
        e.preventDefault();
        setInputText('')
        console.log(sampleSize);
        setLoading(true)
        sendInput()

    }

    return (
        <div className="relative flex justify-center bg-black">

            <FloatingElement className="w-20 h-20 bg-pink-500 opacity-20 top-1/4 left-1/4 blur-sm" />
            <FloatingElement className="w-32 h-32 bg-orange-500 opacity-20 top-3/4 right-1/3 blur-sm" />
            <FloatingElement className="w-24 h-24 bg-purple-500 opacity-20 bottom-1/4 left-1/3 blur-sm" />
            <FloatingElement className="w-16 h-16 bg-blue-500 opacity-20 top-1/2 right-1/4 blur-sm" />

            <div className="content-container bg-black min-h-screen w-3/4">
                <div className="header-container  h-1/6 flex justify-center items-center">
                <header className='text-6xl bg-black w-full text-center text-white  '>Reddit Overlap Analysis</header>
            </div>

            <div className="input-container h-1/8 w-full flex justify-center items-center ">
                
                    <div className="ghost-and-input relative w-4/6  ">
                        <div className="absolute inset-0 w-full bg-gradient-to-r from-pink-500 to bg-orange-500 rounded-lg blur-lg z-0"></div>

                        <form action="" onSubmit={handleSubmit}>
                            <div className="relative z-10">
                                <span className='absolute inset-y-0 left-0 flex items-center pl-4 text-2xl text-white z-10'>r/</span>
                                <input className='rounded-2xl w-full h-12 text-2xl pl-10 pr-14 text-white z-10 bg-black '
                                    type="text"
                                    placeholder=''
                                    required
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    
                                />
                            </div>
                            <span className='absolute inset-y-0 right-0 flex items-center pr-3'>
                                <button 
                                    className='rounded-full h-10 w-10 bg-blue-500 z-10'
                                    type='submit'
                                > 
                                <FontAwesomeIcon icon={faArrowUp} className=' h-5'/>
                                </button>
                                
                            </span>

                        </form>

                    </div>    

            </div>

            <div className="sample-size-container h-1/12 w-full flex justify-center items-center space-x-4">
            <span className="text-white">Sample size</span>
                <label htmlFor="" className="inline-flex items-center ">
                    <input 
                        type='radio' 
                        name='options' 
                        value='1' 
                        className="form-radio h-4 w-4 text-blue-600"
                        checked = {sampleSize === '1'}
                        onChange={(e) => setSampleSize(e.target.value)}
                    />
                    <span className="ml-2 text-white">1</span>
                </label>
                <label htmlFor="" className="inline-flex items-center ">
                    <input 
                        type='radio' 
                        name='options' 
                        value='10' 
                        className="form-radio h-4 w-4 text-blue-600"
                        checked = {sampleSize === '10'}
                        onChange={(e) => setSampleSize(e.target.value)}
                    />
                    <span className="ml-2 text-white">10</span>
                </label>
                <label htmlFor="" className="inline-flex items-center ">
                    <input 
                        type='radio' 
                        name='options' 
                        value='100' 
                        className="form-radio h-4 w-4 text-blue-600"
                        checked={sampleSize === '100'}
                        onChange={(e) => setSampleSize(e.target.value)}
                    />
                    <span className="ml-2 text-white">100</span>
                </label>
                <label htmlFor="" className="inline-flex items-center ">
                    <input 
                        type='radio' 
                        name='options' 
                        value='1000' 
                        className="form-radio h-4 w-4 text-blue-600"
                        checked={sampleSize === '1000'}
                        onChange={(e) => setSampleSize(e.target.value)}
                    />
                    <span className="ml-2 text-white">1000</span>
                </label>

            </div>
          </div>
        </div>
      );
}

export default FrontPage