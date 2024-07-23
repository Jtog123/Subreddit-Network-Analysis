
//import './App.css';
import './index.css';
import FrontPage from './FrontPage';
import { useRef, useState, useEffect } from 'react';
import LoadingPage from './LoadingPage';
import GraphPage from './GraphPage';

const axios = require('axios')

function App() {

  const [loading, setLoading] = useState(false)
  const [graphs, setGraphs] = useState(null)



  return (
    <div className="App ">
      {!loading && !graphs && <FrontPage
                      loading={loading}
                      setLoading={setLoading}
                      setGraphs={setGraphs}
                    /> }

      {loading && <LoadingPage/>}
      {graphs && <GraphPage
                    graphs={graphs}
                  />
        //<div>
          //<img src = {`http://localhost:5000/${graphs.bar_graph}`} alt="Bar Graph"/>
          //<img src = {`http://localhost:5000/${graphs.heatmap}`} alt="heatmap"/>
          //<img src = {`http://localhost:5000/${graphs.network_graph}`} alt="network graph"/>
        //</div>
      }

    </div>
  );
}

export default App;
