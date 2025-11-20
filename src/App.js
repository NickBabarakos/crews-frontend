import './App.css';
import Header from './Header.js';
import CrewsView from './CrewsView';
import CharactersView from './CharactersView.js';
import Sidebar from './Sidebar.js';
import Footer from './Footer.js';
import viewConfig from './ViewConfig.js';
import Toolbar from './Toolbar.js';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';


const API_STAGES_URL = 'http://localhost:3000/api/stages';
const API_CHARACTERS_URL = 'http://localhost:3000/api/characters';


const ALL_LEGEND_TYPES = [
  'Super Sugo-Fest Only', 'Anniversary', 'Pirate Rumble Sugo-Fest Only', 'Treasure Sugo-Fest Only', 
  'Pirate Alliance Kizuna Clash Sugo-Fest Only', 'Exchange Only', 'Sugo Rare'
];

const crewBasedViews = ['grandVoyage', 'garpsChallenge', 'forestOfTraining', 'pirateKingAdventures', 'treasureMap', 'kizunaClash'];

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
  const [characterPageSize, setCharacterPageSize] = useState(60);
  const [crewFilters, setCrewFilters] = useState({});

  const findCrews = useCallback(async(filters, page =1)=> {
    const config = viewConfig[viewMode];
    if(!config) { setError('invalid view mode configuration'); return;}

    const allFiltersPresent = config.dropdowns.every(d=> filters[d.id])
      if(!allFiltersPresent){
        return;
      }

    setError(null);
    setIsLoading(true);
    setLastSearch({mode: viewMode, filters});

    try{
      const response = await axios.get(API_STAGES_URL, {params: {mode: config.mode, ...filters, page}});
      setResults(Array.isArray(response.data.crews) ? response.data.crews: []);
      setHasMore(response.data.hasMore);
      setTotalCount(0);
      setCurrentPage(page);
    } catch (err) {
      console.error("API Call Failed:", err);
      setResults([]);
      setError(err.response ? err.response.data.error : 'An unexpected error occured');
    } finally {
      setIsLoading(false);
    }
  } ,[viewMode]);

  const findCharacters = useCallback(async ({type, page=1, limit = characterPageSize}) => {
    if(!type) {
      setError("Please select a character type");
      return;
    }
    setError(null);
    setIsLoading(true);
    setLastSearch({type, limit});

    try{

      const response = await axios.get(API_CHARACTERS_URL, {params: {type, page, limit}});
      setResults(Array.isArray(response.data.characters) ? response.data.characters: []);
      setHasMore(response.data.hasMore);
      setTotalCount(response.data.totalCount);
      setCurrentPage(page);
    } catch(err){
      console.error("API Call Failed:", err);
      setError(err.response ? err.response.data.error: 'An unexpected error occurred');
    }finally {
      setIsLoading(false);
    }
  },[characterPageSize]);

   const handleCrewFiltersChange = useCallback((newFilter) => {
    const config = viewConfig[viewMode];
    if(!config || !config.dropdowns) return;

    setCrewFilters(currentFilters => {
      const updatedFilters ={...currentFilters, ...newFilter };
      const changedFilterKey = Object.keys(newFilter)[0];
      const firstFilterId = config.dropdowns[0]?.id;

      if(config.dropdowns.length > 1 && changedFilterKey === firstFilterId){
        const secondFilter = config.dropdowns[1];
        let secondFilterOptions;

        if(secondFilter.dependentOn){
          const parentSelection = updatedFilters[firstFilterId];
          secondFilterOptions = parentSelection ? secondFilter.optionsMap[parentSelection] || [] : [];
        } else {
          secondFilterOptions = secondFilter.options || [];
        }

        if(secondFilterOptions.length >0 ){
          updatedFilters[secondFilter.id] = secondFilterOptions[0];
        }
    }
    return updatedFilters;
  });
  }, [viewMode]);

  useEffect(()=> {
    if(viewMode === 'characters' && results === null) {
      findCharacters({type: ALL_LEGEND_TYPES.join(',')});
    }
  }, [viewMode, results, findCharacters]);

  useEffect(()=> {
    if(crewBasedViews.includes(viewMode)){
      const config = viewConfig[viewMode];
      if(config && Array.isArray(config.dropdowns) && config.dropdowns.length >0){
        const firstFilter = config.dropdowns[0];
        if(firstFilter && Array.isArray(firstFilter.options) && firstFilter.options.length >0){
          const firstOption = firstFilter.options[0];
          const initialFilters = { [firstFilter.id]: firstOption};

          if(config.dropdowns.length >1) {
            const secondFilter = config.dropdowns[1];
            let secondFilterOptions;

            if(secondFilter.dependentOn){
              secondFilterOptions = secondFilter.optionsMap[firstOption] || [];
            } else {
              secondFilterOptions = secondFilter.options || [];
            }
            if (secondFilterOptions.length > 0){
              initialFilters[secondFilter.id] = secondFilterOptions[0];
            }
          }
          setCrewFilters(initialFilters);
          findCrews(initialFilters);
        }
      }
    }
  }, [viewMode, findCrews]);

  useEffect(() => {
    if(Object.keys(crewFilters).length>0 && results !== null){
      findCrews(crewFilters);
    }
    }, [crewFilters, findCrews]);
 

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
      const{mode, filters, type, limit} = lastSearch;
      if(crewBasedViews.includes(mode)){
        findCrews(filters, newPage);
      }else{
        findCharacters({type, limit, page: newPage});
      }
    }
  };

  const handlePageSizeChange = (newPageSize) => {
    if(newPageSize !== characterPageSize){
      setCharacterPageSize(newPageSize);
      if(lastSearch){
        findCharacters({...lastSearch, limit:newPageSize, page:1});
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
    setLastSearch(null);
    setCrewFilters({});
  };

  return (
    <div className="app-container"> 
    
      <Header/>

      <div className = "content-wrapper">

        <Sidebar onViewChange={handleViewChange} currentView={viewMode}/>
        <div className={`main-content view-mode-${viewMode}`}>
          <Toolbar 
            viewMode={viewMode}
            config={viewConfig[viewMode]}
            crewFilterValues = {crewFilters}
            onCrewFiltersChange={handleCrewFiltersChange}
            characterCategory={characterCategory}
            onCharacterCategoryChange={handleCharacterCategoryChange}
            totalCount={totalCount}
            legendSubCategory={legendSubCategory}
            onLegendSubCategoryChange={handleLegendSubCategoryChange}
          />

          {isLoading && <p></p>}
          {error && <p className="error-message">{error}</p>}
          {!isLoading && !error && (
            <>
              {crewBasedViews.includes(viewMode) && <CrewsView crews={results} />}
              {viewMode === 'characters' && 
              <CharactersView 
                characters = {results}
                onPageSizeChange = {handlePageSizeChange}
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
