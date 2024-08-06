
//import './App.css';
import './index.css';
import FrontPage from './FrontPage';
import { useRef, useState, useEffect } from 'react';
import {BrowserRouter as Router, Route, Routes, Redirect, useNavigate} from 'react-router-dom'
import LoadingPage from './LoadingPage';
import GraphPage from './GraphPage';

const axios = require('axios')

function App() {

  const [loading, setLoading] = useState(false)
  const [graphs, setGraphs] = useState(null)
  //const navigate = useNavigate()

  useEffect(() => {
    console.log("Graphs state updated:", graphs);
  }, [graphs]);

  
  const clearGraphs = () => {
    setGraphs(null);
  }
  
  // This component handles navigation based on state
  function NavigationHandler() {
    const navigate = useNavigate();

    useEffect(() => {
      if (loading) {
        navigate('/loading');
      } else if (graphs) {
        navigate('/graphs');
      } else {
        navigate('/');
      }
    }, [loading, graphs, navigate]);

    return null; // This component doesn't render anything
  }


return (
    <Router>
      <div className="App">
        <NavigationHandler />
        <Routes>
          <Route
            path='/'
            element={!loading && !graphs && <FrontPage setLoading={setLoading} setGraphs={setGraphs} />}
          />
          <Route
            path='/loading'
            element={loading && <LoadingPage size={250} thickness={20}  speed={1.5} />}
          />
          <Route
            path='/graphs'
            element={graphs && <GraphPage graphs={graphs} setGraphs={setGraphs} clearGraphs={clearGraphs} />}
          />
        </Routes>
      </div>
    </Router>  
  );
}



export default App;
