import './App.css';
import Header from './Header.js';
import CrewsView from './CrewsView';
import Footer from './Footer.js';
import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/stages';

function App() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [lastSearch, setLastSearch] = useState(null);


  const findCrews = async({stage, level, page =1})=> {
    if(!stage || !level){
      setError("Please enter the stage and the level");
      return;
    }
    setError(null);
    setIsLoading(true);
    setLastSearch({stage, level});

    try{
    const response = await axios.get(API_URL, {params:{ stage, level, page}});
    setResults(response.data.crews);
    setHasMore(response.data.hasMore);
    setCurrentPage(page);
} catch(err){
  console.error("API Call Failed:", err);
    setError(err.response ? err.response.data.error: 'An unexpected error occurued');
} finally {
  setIsLoading(false);
}
};

  const handlePageChange = (direction) => {
    const newPage = direction === 'next' ? currentPage + 1 : currentPage -1;
    if (newPage >0 && lastSearch) {
      findCrews({...lastSearch, page: newPage});
    }
  };
  

  return (
    <div className="app-container"> 
    
      <Header onSearch={findCrews} />

      <div className="main-content">
        {isLoading && <p>Loading crews...</p>}
        {error && <p className="error-message">{error}</p>}
        {!isLoading && !error && <CrewsView crews={results} />}
      </div>

        

        <Footer
          currentPage={currentPage}
          hasMore={hasMore}
          onPageChange={handlePageChange}
          hasSearched={results !== null}
        />

      </div>
  );
 
}

export default App;
