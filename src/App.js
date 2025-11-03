import './App.css';
import Header from './Header.js';
import CrewsView from './CrewsView';
import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

function App() {
  const [stage, setStage] = useState('');
  const [level, setLevel] = useState(''); 

  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');


  const findCrews = async(pageNumber)=> {
    if(!stage || !level){
      setError("Please enter the stage and the level");
      return;
    }
    setError(null);

    try{
    const response = await axios.get(`${API_URL}/crews`, {
      params:{
        stage: stage,
        level: level,
        page: pageNumber
      }
    });
    setResults(response.data);
    setCurrentPage(pageNumber);
    setPageInput(String(pageNumber));
} catch(err){
    setError(err.response ? err.response.data.error: 'An unexpected error occurued');
}

  }
  

  return (
    <div className="app-container"> 
    
      <Header />

      <div className="main-content">
        {isLoading && <p>Loading crews...</p>}
        {error && <p className="error-message">{error}</p>}
        {!isLoading && !error && results && (
          <CrewsView crews={results} />
        )}

        

        <div className="footer">

        </div>
      </div>
    
    
    </div>
  );
 
}

export default App;
