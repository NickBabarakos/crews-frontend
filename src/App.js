import './App.css';
import { CollectionProvider } from './CollectionContext';
import Header from './Header.js';
import CrewsView from './CrewsView';
import CharactersView from './CharactersView.js';
import BossGridView from './BossGridView.js';
import CreatorsView from './CreatorsView.js';
import BannersView from './BannersView.js';
import BannerModal from './BannerModal.js';
import Sidebar from './Sidebar.js';
import Footer from './Footer.js';
import viewConfig from './ViewConfig.js';
import Toolbar from './Toolbar.js';
import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import StageGuideModal from './StageGuideModal.js';


const API_STAGES_URL = 'http://localhost:3000/api/stages/search';
const API_CHARACTERS_URL = 'http://localhost:3000/api/characters';


const ALL_LEGEND_TYPES = [
  'Super Sugo-Fest Only', 'Anniversary', 'Pirate Rumble Sugo-Fest Only', 'Treasure Sugo-Fest Only', 
  'Pirate Alliance Kizuna Clash Sugo-Fest Only', 'Exchange Only', 'Sugo Rare'
];
const ALL_RR_TYPES = [
  'Rare Recruit', 'Treasure Map Rare Recruit', 'Treasure Map Limited Character', 'Kizuna Clash Limited Character',
  'Rumble Rare Recruit', 'Support Character'
];

const RR_MAPPING = {
  'Treasure Map Rare Recruits': 'Treasure Map Rare Recruit',
  'Treasure Map Limited Characters': 'Treasure Map Limited Character',
  'Kizuna Clash Limited Characters': 'Kizuna Clash Limited Character',
  'Rumble Rare Recruits': 'Rumble Rare Recruit',
  'Support Characters': 'Support Character',
  'Other Rare Recruits': 'Rare Recruit'
};


const crewBasedViews = ['grandVoyage', 'garpsChallenge', 'forestOfTraining', 'coliseum', 'pirateKingAdventures', 'treasureMap', 'kizunaClash'];

function App() {
  const [results, setResults] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [categoryTotalCount, setCategoryTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [lastSearch, setLastSearch] = useState(null);
  const [viewMode, setViewMode] = useState('grandVoyage');
  const [characterCategory, setCharacterCategory] = useState('legends');
  const [subCategory, setSubCategory] = useState('All Legends');
  const [isPlus, setIsPlus]= useState(false);
  const [characterPageSize, setCharacterPageSize] = useState(60);
  const [crewFilters, setCrewFilters] = useState({});
  const [crewPageSize, setCrewPageSize] = useState(4);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [guideData, setGuideData] = useState(null);
  const [guideLoading, setGuideLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyOwned, setShowOnlyOwned] = useState(false);
  const [selectedBoss, setSelectedBoss] = useState(null);
  const [bossesList, setBossesList] = useState(null);
  const [creatorPageSize, setCreatorPageSize] = useState(10);
  const [bannerPageSize, setBannerPageSize] = useState(6);
  const [selectedBannerId, setSelectedBannerId] = useState(null);
  const mainContentRef = useRef(null);


  const handleOpenGuide = async () => {
    setIsGuideOpen(true);
    setGuideLoading(true);

    const config = viewConfig[viewMode];
    if(!crewFilters || Object.keys(crewFilters).length === 0){
      setGuideLoading(false);
      return;
    }

    let params = {
      mode: config.mode,
      ...crewFilters
    };

    if (viewMode === 'coliseum' && selectedBoss){ params.stage = selectedBoss.name;}

    try {
      const response = await axios.get('http://localhost:3000/api/stage-info', {
        params: params
      });
      setGuideData(response.data.guide);
    } catch(err){
      console.error("Failed to fetch guide", err);
      setGuideData(null);
    } finally {
      setGuideLoading(false);
    }
  };

  const findBanners = useCallback(async (page=1, limit=bannerPageSize) => {
    setIsLoading(true);
    setError(null);
    setLastSearch({mode: 'banners', limit});

    try{
      const response = await axios.get('http://localhost:3000/api/banners', {
        params: {page, limit}
      });
      setResults(response.data.banners);
      setHasMore(response.data.hasMore);
      setTotalCount(response.data.totalCount);
      setCurrentPage(page);
    } catch (err){
      console.error("Failed to fetch banners", err);
      setError("Failed to load banners");
    } finally {
      setIsLoading(false);
    }
  }, [bannerPageSize]);

  const handleBannerClick = async (bannerId) => {
    setSelectedBannerId(bannerId);
    setIsGuideOpen(true);
    setGuideLoading(true);

    try{
      const response = await axios.get(`http://localhost:3000/api/banners/${bannerId}`);
      setGuideData(response.data.guide);
    } catch (err){
      console.error("Failed to fetch banner details", err);
      setGuideData(null);
    } finally {
      setGuideLoading(false);
    }
  }

  const handleBannerPageSizeChange = (newSize) => {
    if(newSize !== bannerPageSize){
      setBannerPageSize(newSize);
      if(viewMode === 'banners') findBanners(1, newSize);
    }
  };


  useEffect(()=> {
    const calculateCrewPageSize = () => {
      if(mainContentRef.current){
        const containerWidth = mainContentRef.current.offsetWidth;
        const cardWidth = 300;
        const gap = 40;
        const newSize = Math.floor((containerWidth-40)/(cardWidth + gap));

        setCrewPageSize(currentSize => {
          const finalSize = Math.max(1, newSize);
          if (finalSize !== currentSize) {
            return finalSize;
          }
          return currentSize;
        });
      }
    };
    calculateCrewPageSize();
    window.addEventListener('resize',calculateCrewPageSize);

    return() => window.removeEventListener('resize', calculateCrewPageSize);
  }, [viewMode]); 

  const findBosses = useCallback(async (filters, page=1, limit= characterPageSize) => {
    setIsLoading(true);
    setLastSearch({mode: 'coliseum_boss_list', filters, limit});

    try{
      const response = await axios.get('http://localhost:3000/api/stages/list', {
        params: {
          mode: 'coliseum',
          level: filters.level,
          page,
          limit
        }
      });
      setBossesList(Array.isArray(response.data.stages)? response.data.stages : []);
      setHasMore(response.data.hasMore);
      setTotalCount(response.data.totalCount);
      setCategoryTotalCount(response.data.totalCount);
      setCurrentPage(page);
    } catch(err){
      console.error("Failed to fetch bosses", err);
      setError("failed to load bosses");
    } finally {
      setIsLoading(false);
    }
  }, [characterPageSize]);

  const findCrews = useCallback(async(filters, page =1, limit=crewPageSize, onlyOwned = showOnlyOwned)=> {
    const config = viewConfig[viewMode];
    if(!config) { setError('invalid view mode configuration'); return;}

    const allFiltersPresent = config.dropdowns.every(d=> filters[d.id])
      if(!allFiltersPresent){
        return;
      }

    setError(null);
    setIsLoading(true);
    setLastSearch({mode: viewMode, filters, limit});

    let postData = {
      mode: config.mode, 
      ...filters
    };

    if(onlyOwned){
      try{
        const savedCollection = localStorage.getItem('optc-collection');
        if (savedCollection){
          const parsed = JSON.parse(savedCollection);
          postData.ownedIds = Object.keys(parsed).map(Number);
        } else {
          postData.ownedIds = [];
        }
      } catch(e) {
        console.error("Error reading collection", e);
        postData.ownedIds = [];
      }
    }

    try{
      const response = await axios.post(API_STAGES_URL, postData, {
        params: {page, limit}
      });

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
  } ,[viewMode, crewPageSize, showOnlyOwned]);
  
  useEffect(() => {
    if (Object.keys(crewFilters).length > 0){
      if(viewMode === 'coliseum'){
        if(selectedBoss){
          findCrews({mode: 'coliseum', stage: selectedBoss.name, level: crewFilters.level}, 1, crewPageSize, showOnlyOwned);
        } else {
          findBosses(crewFilters, 1, characterPageSize);
        }
      } else{
        findCrews(crewFilters, 1, crewPageSize, showOnlyOwned);
      }
    }
  }, [crewFilters, findBosses, findCrews, selectedBoss,showOnlyOwned, viewMode, characterPageSize, crewPageSize]);

  const findCharacters = useCallback(async ({
    cat = characterCategory,
    sub = subCategory,
    plus = isPlus,
    search = searchTerm,
    page = 1,
    limit = characterPageSize
  }) => {
    let searchType= '';
    if(plus){ 
        if(cat === 'legends'){
          searchType = '6+ Legend';
        } else {
          searchType = '5+ Rare Recruit'
        }
    } else {
      if(cat === 'legends'){
        if(sub === 'All Legends'){
          searchType = ALL_LEGEND_TYPES.join(',');
        } else {
          searchType = sub;
        }
      }

      else if (cat === 'rareRecruits'){
        if(sub === 'All Rare Recruits'){
          searchType = ALL_RR_TYPES.join(',');
        } else{
          searchType = RR_MAPPING[sub] || sub;
        }
        }
      }
    
      if(!searchType) return;

      setIsLoading(true);
      setError(null);
      setLastSearch({cat, sub, plus, search, limit});

      try{
        const response = await axios.get(API_CHARACTERS_URL, {
          params: {type: searchType, search, page, limit}
        });
        setResults(Array.isArray(response.data.characters) ? response.data.characters: []);
        setHasMore(response.data.hasMore);
        setTotalCount(response.data.totalCount);
        if(search === '') { setCategoryTotalCount(response.data.totalCount);}
        setCurrentPage(page);
      } catch (err){
        console.error("API CALL Failed:", err);
        setError(err.response ? err.response.data.error : 'An unexpected error occured');
      }finally {
        setIsLoading(false);
      }
    
  },[characterPageSize, characterCategory, subCategory, isPlus, searchTerm]);

  const handleCategoryChange = (newCategory) => {
    setCharacterCategory(newCategory);
    const defaultSub = newCategory === 'legends' ? 'All Legends' : 'All Rare Recruits';
    setSubCategory(defaultSub);
    setIsPlus(false);
    findCharacters({
      cat: newCategory,
      sub:defaultSub,
      plus: false,
      page: 1
    });
  };

  const handleSubCategoryChange = (newSub) => {
    setSubCategory(newSub);
    findCharacters({sub: newSub, page:1});
  };

  const handlePlusChange = (newVal) => {
    setIsPlus(newVal);
    findCharacters({plus: newVal, page:1});
  };

  const findCreators = useCallback(async (page=1, limit=creatorPageSize)=> {
    setIsLoading(true);
    setError(null);
    setLastSearch({mode:'creators',limit});

    try{
      const response = await axios.get('http://localhost:3000/api/creators/leaderboard', {
        params: {page, limit}
      });
      setResults(response.data.creators);
      setHasMore(response.data.hasMore);
      setTotalCount(response.data.totalCount);
      setCurrentPage(page);
    } catch(err){
      console.error("Failed to fetch creators", err);
      setError("Failed to load Bounty List");
    } finally{
      setIsLoading(false);
    }
  }, [creatorPageSize]);

  const handleCreatorPageSizeChange = (newSize) => {
    if(newSize !== creatorPageSize){
      setCreatorPageSize(newSize);
      if(viewMode === 'creators'){
        findCreators(1,newSize);
      }
    }
  }

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    
    findCharacters({ 
      cat: characterCategory,
      sub: subCategory,
      search: term,
      page: 1
    });
  };

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
        }
      }
    }
  }, [viewMode]);

  const handleBossClick = (stage) => {
    setSelectedBoss(stage);;
  }

  const handleBackToBosses = () => {
    setResults(null);
    setSelectedBoss(null);
    setCurrentPage(1);
  };

  const handlePageChange = (direction) => {
    const newPage = direction === 'next' ? currentPage + 1 : currentPage -1;
    if (newPage >0 && lastSearch) {
      if(lastSearch.mode === 'coliseum_boss_list'){
        findBosses(lastSearch.filters, newPage, lastSearch.limit);
      } else if (lastSearch.mode === 'creators'){
        findCreators(newPage, lastSearch.limit);
      } else if (lastSearch.mode === 'banners'){
        findBanners(newPage, lastSearch.limit);
      } else if (crewBasedViews.includes(lastSearch.mode) || (lastSearch.mode === 'coliseum' && selectedBoss)){
        findCrews(lastSearch.filters, newPage, lastSearch.limit);
      } else{
        findCharacters({...lastSearch, page: newPage});
      }
    }
  };

  const handlePageSizeChange = (newPageSize) => {
    if(newPageSize === characterPageSize) return;

    setCharacterPageSize(newPageSize);

    if(lastSearch){
      if(lastSearch.mode === 'coliseum_boss_list'){
        findBosses(lastSearch.filters, 1, newPageSize);
      } else if (lastSearch.mode === 'banners'){
        findBanners(1, newPageSize);
      } else if (lastSearch.mode === 'creators'){
        findCreators(1, newPageSize);
      } else if (crewBasedViews.includes(lastSearch.mode)){
        findCrews(lastSearch.filters, 1, crewPageSize);
      } else{
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
    setCategoryTotalCount(0);
    setLastSearch(null);
    setCrewFilters({});
    setSelectedBoss(null);
    setBossesList(null);
    if(newView === 'coliseum') { setCrewFilters({level: 'Clash!! (Hard)'});} else {setCrewFilters({});}
    setCharacterCategory('legends');
    setSubCategory('All Legends');
    setIsPlus(false);
    setSearchTerm('');
    setShowOnlyOwned(false);
    if(newView === 'creators') { findCreators(1, creatorPageSize);}
    if(newView === 'banners') { findBanners(1, bannerPageSize);}
  };

  return (
    <CollectionProvider>
      <div className="App">

   
    <div className="app-container"> 
    
      <Header/>

      <div className = "content-wrapper">

        <Sidebar onViewChange={handleViewChange} currentView={viewMode}/>
        <div ref={mainContentRef} className={`main-content view-mode-${viewMode}`}>
          <Toolbar 
            viewMode={viewMode}
            config={viewConfig[viewMode]}
            crewFilterValues = {crewFilters}
            onCrewFiltersChange={handleCrewFiltersChange}
            characterCategory={characterCategory}
            onCategoryChange={handleCategoryChange}
            subCategory={subCategory}
            onSubCategoryChange={handleSubCategoryChange}
            isPlus={isPlus}
            onIsPlusChange={handlePlusChange}
            totalCount={categoryTotalCount}
            onOpenGuide={handleOpenGuide}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            showOnlyOwned = {showOnlyOwned}
            onToggleOwned = {()=> setShowOnlyOwned(!showOnlyOwned)}
            showActions={(viewMode !== 'coliseum' && viewMode !== 'creators') || (viewMode === 'coliseum' && selectedBoss)}
            disabled={viewMode === 'coliseum' && selectedBoss !== null}

          />

          {isLoading && <p></p>}
          {error && <p className="error-message">{error}</p>}
          {!isLoading && !error && (
           <>
           {viewMode === 'coliseum' && !selectedBoss && (
            <BossGridView 
              stages={bossesList}
              onPageSizeChange = {handlePageSizeChange}
              onBossClick = {handleBossClick}
            />

           )}

           {viewMode === 'coliseum' && selectedBoss && (
            <div style={{padding: '10px 40px', display: 'flex', alignItems: 'center', gap:'10px'}}>
              <button 
                onClick={handleBackToBosses}
                className="pill-button active"
                style={{display:'flex', alignItems:'center', gap: '5px', padding: '6px 12px', fontSize:'13px'}}
              >
                <span> Back</span>
              </button>
              <h3 style={{margin:0, color: '#a78bfa', fontSize: '18px'}}> {selectedBoss.name}</h3>
            </div>
           )}
           {((crewBasedViews.includes(viewMode) && viewMode !== 'coliseum') || (viewMode === 'coliseum' && selectedBoss)) && (
            <CrewsView crews={results} crewPageSize={crewPageSize} />
           )}

           {viewMode === 'creators' && (
            <CreatorsView
              creators={results}
              onPageSizeChange={handleCreatorPageSizeChange}
              currentPage={currentPage}
              pageSize={creatorPageSize}
              />
           )}

           {viewMode === 'banners' && (
            <BannersView 
              banners={results}
              onPageSizeChange={handleBannerPageSizeChange}
              onBannerClick={handleBannerClick}
            />
           )}

           {viewMode === 'characters' &&
            <CharactersView
              characters = {results}
              onPageSizeChange = {handlePageSizeChange}
            />
           }
           </>
          )}

          {viewMode === 'banners' ? (
            <BannerModal 
              isOpen={isGuideOpen}
              onClose={()=> setIsGuideOpen(false)}
              data={guideData}
              loading={guideLoading}
            />
          ): (
            <StageGuideModal
            isOpen={isGuideOpen}
            onClose={()=> setIsGuideOpen(false)}
            guideData = {guideData}
            loading = {guideLoading}
          />
          )}

          

          <Footer
          currentPage={currentPage}
          hasMore={hasMore}
          onPageChange={handlePageChange}
          hasSearched={results !== null}
        />
        </div>
      </div>

    </div>
         </div>
     </CollectionProvider>
  );
 
}

export default App;
