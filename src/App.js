import './App.css';
import Header from './Header.js';
import CrewsView from './CrewsView';
import CharactersView from './CharactersView.js';
import Sidebar from './Sidebar.js';
import Footer from './Footer.js';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_STAGES_URL = 'http://localhost:3000/api/stages';
const API_CHARACTERS_URL = 'http://localhost:3000/api/characters';

const ALL_LEGEND_TYPES = [
  'Super Sugo-Fest Only', 'Anniversary', 'Pirate Rumble Sugo-Fest Only', 'Treasure Sugo-Fest Only', 
  'Pirate Alliance Kizuna Clash Sugo-Fest Only', 'Exchange Only', 'Sugo Rare'
];

function App() {
  const [results, setResults] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [lastSearch, setLastSearch] = useState(null);
  const [viewMode, setViewMode] = useState('grandVoyage');
  const [characterCategory, setCharacterCategory] = useState('legends');
  const [legendSubCategory, setLegendSubCategory] = useState('all');

  useEffect(()=> {
    if(viewMode === 'characters' && results === null) {
      findCharacters({type: ALL_LEGEND_TYPES.join(',')});
    }
  }, [viewMode, results]);

  const findCrews = async({stage, level, page =1})=> {
    if(!stage || !level){
      setError("Please enter the stage and the level");
      return;
    }

    setError(null);
    setIsLoading(true);
    setLastSearch({stage, level});

    try{
      const response = await axios.get(API_STAGES_URL, {params:{ stage, level, page}});
      setResults(response.data.crews);
      setHasMore(response.data.hasMore);
      setTotalCount(0);
      setCurrentPage(page);
    } catch(err){
      console.error("API Call Failed:", err);
      setError(err.response ? err.response.data.error: 'An unexpected error occurued');
    } finally {
      setIsLoading(false);
    }
  };

  const findCharacters = async ({type, page=1}) => {
    if(!type) {
      setError("Please select a character type");
      return;
    }
    setError(null);
    setIsLoading(true);
    setLastSearch({type});

    try{
      const response = await axios.get(API_CHARACTERS_URL, {params: {type, page}});
      setResults(response.data.characters);
      setHasMore(response.data.hasMore);
      setTotalCount(response.data.totalCount);
      setCurrentPage(page);
    } catch(err){
      console.error("API Call Failed:", err);
      setError(err.response ? err.response.data.error: 'An unexpected error occurred');
    }finally {
      setIsLoading(false);
    }
  };

  const handleCharacterCategoryChange = (newCategory) => {
    setCharacterCategory(newCategory);
    let searchType = '';
    if (newCategory === 'legends'){
      setLegendSubCategory('all');
      searchType = ALL_LEGEND_TYPES.join(',');
    } else if (newCategory === 'plusLegends'){
      searchType = '6+ Legend';
    } else if (newCategory === 'rareRecruits'){
      searchType = 'Rare Recruit';
    }
    findCharacters({ type: searchType });
  };

  const handleLegendSubCategoryChange = (newSubCategory) => {
    setLegendSubCategory(newSubCategory);
    let searchType = '';
    if (newSubCategory === 'all'){
      searchType = ALL_LEGEND_TYPES.join(',');
    } else {
      searchType = newSubCategory;
    }
    findCharacters( {type: searchType});
  }

  const handlePageChange = (direction) => {
    const newPage = direction === 'next' ? currentPage + 1 : currentPage -1;
    if (newPage >0 && lastSearch) {
      if(viewMode === `grandVoyage`){
        findCrews({...lastSearch, page: newPage});
      }else if(viewMode === `characters`){
        findCharacters({...lastSearch, page: newPage});
      }
    }
  };
  
  const handleViewChange = (newView) => {
    setViewMode(newView);
    setResults(null);
    setError(null);
    setCurrentPage(1);
    setHasMore(false);
    setTotalCount(0);
  };

  return (
    <div className="app-container"> 
    
      <Header 
        viewMode = {viewMode}
        onSearch = {findCrews}
        characterCategory = {characterCategory}
        onCharacterCategoryChange = {handleCharacterCategoryChange}
      />

      <div className = "content-wrapper">

        <Sidebar onViewChange={handleViewChange}/>
        <div className={`main-content view-mode-${viewMode}`}>
          {isLoading && <p></p>}
          {error && <p className="error-message">{error}</p>}
          {!isLoading && !error && (
            <>
              {viewMode === 'grandVoyage' && <CrewsView crews={results} />}
              {viewMode === 'characters' && 
              <CharactersView 
                characters = {results}
                totalCount= {totalCount}
                characterCategory={characterCategory}
                legendSubCategory={legendSubCategory}
                onLegendSubCategoryChange = {handleLegendSubCategoryChange}
              />}
            </>
          )}
        </div>
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
