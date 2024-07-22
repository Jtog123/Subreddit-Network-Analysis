
//import './App.css';
import './index.css';
import FrontPage from './FrontPage';
import { useRef, useState, useEffect } from 'react';
import LoadingPage from './LoadingPage';

function App() {

  const [loading, setLoading] = useState(false)

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
