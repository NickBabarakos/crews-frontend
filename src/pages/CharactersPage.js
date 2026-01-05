import { useNavigate } from "react-router-dom";
import CharactersView from "../characters/CharactersView";
import Toolbar from "../components/Toolbar";
import Footer from "../components/layout/Footer";

//Hooks 
import { useCharacterInitialization } from "../characters/hooks/useCharacterInitialization";
import { useCharactersPageData } from "../characters/hooks/useCharactersPageData";
import { useCharactersToolbarLogic } from "../characters/hooks/useCharactersToolbarLogic";


const CharactersPage = ()=>{
    const navigate = useNavigate();

    //1. Initialization & URL Sync Hook
    const{
      category, handleCategoryChange,
      subCategory, handleSubCategoryChange,
      isPlus, handleIsPlusChange,
      searchTerm, handleSearchChange,
      currentPage, setCurrentPage,
      pageSize, setPageSize 

    } = useCharacterInitialization();

    //2. Data Fetching & Calculation Hook
    const{
      characters,
      totalCount,
      hasMore,
      isLoading,
      error,
      ownedCount
    } =useCharactersPageData({
      category,
      subCategory,
      isPlus,
      searchTerm,
      currentPage,
      pageSize 
    });

    //3. UI Logic Hook for Toolbar
    const toolbarLogic = useCharactersToolbarLogic(category, isPlus);

    //Handlers για το Footer/Pagination
   const handlePageChange = (direction) => {
    const newPage = direction === 'next' ? currentPage + 1 : currentPage -1;
    if(newPage > 0){
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth'});
    }
  };


  return(
    <>
        <Toolbar 
            viewMode="characters"
            //State Props
            characterCategory={category}
            subCategory = {subCategory}
            isPlus={isPlus}
            searchTerm={searchTerm}
            totalCount={totalCount}
            ownedCount={ownedCount}


            //Handlers
            onCategoryChange={handleCategoryChange}
            onSubCategoryChange={handleSubCategoryChange}
            onIsPlusChange={handleIsPlusChange}
            onSearchChange={handleSearchChange}
            onAdminTrigger={()=> navigate('/admin')}

            //UI Logic Object
            logic={toolbarLogic}
        />

        {error && <p className="error-message">{error.message}</p>}

        {!isLoading && !error && (
            <CharactersView
                characters={characters}
                onPageSizeChange={setPageSize}
            />
        )}

        <Footer 
            currentPage={currentPage}
            hasMore={hasMore}
            onPageChange={handlePageChange}
            hasSearched={true}
        />
    </>
  );
};

export default CharactersPage;