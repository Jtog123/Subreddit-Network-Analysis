
//import './App.css';
import './index.css';
import FrontPage from './FrontPage';
import { useRef, useState, useEffect } from 'react';
import LoadingPage from './LoadingPage';
const axios = require('axios')

function App() {

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function getResponse () {
        try {
            let result =  await axios.get('http://localhost:5000/test')
            console.log(result)
        } catch (err) {
            console.error(err)
        }
    }
    getResponse()
  }, [loading])

  return (
    <div className="App ">
      {!loading && <FrontPage
                      setLoading={setLoading}
                    /> }

      {loading && <LoadingPage/>}

    </div>
  );
}

export default App;
