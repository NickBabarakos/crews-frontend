import { useState } from "react";
import { useCharacters } from "../hooks/useCharacters";
import CharactersView from "../characters/CharactersView";
import Toolbar from "../components/Toolbar";
import Footer from '../components/layout/Footer';
import { ALL_LEGEND_TYPES, ALL_RR_TYPES, RR_MAPPING } from "../utils/constants";
import { useSearchParams, useNavigate } from "react-router-dom";

const CharactersPage = ()=>{
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(60);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('all');
    const [subCategory, setSubCategory] = useState(null);
    const [isPlus, setIsPlus] = useState(false);

    const clearUrlParams = () => {
      const newParams = new URLSearchParams(searchParams);

        if(newParams.has('crew')){
            newParams.delete('crew');
            setSearchParams(newParams);
        }
    };

    let characterSearchType = '';
      if(category === 'all'){
        characterSearchType = 'ALL';
      } else if (isPlus){
        characterSearchType = category === 'legends' ? '6+ Legend' : '5+ Rare Recruit';
      } else{
        if(category === 'legends'){
         characterSearchType = (!subCategory || subCategory === 'All Legends' || subCategory === 'null') ? ALL_LEGEND_TYPES.join(',') : subCategory;
        } else if (category === 'rareRecruits'){
          characterSearchType = (!subCategory || subCategory === 'All Rare Recruits') ? ALL_RR_TYPES.join(',') : (RR_MAPPING[subCategory] || subCategory);
        }
      }
    
      const{ data, isLoading, error} = useCharacters({
        type: characterSearchType, search: searchTerm, page: currentPage, limit: pageSize
      });

    const handleCategoryChange = (newCategory) => {
        setCategory(newCategory);
        setIsPlus(false);
        if(newCategory === 'all'){
            setSubCategory(null);
            setCurrentPage(1);
        } else{
            const defaultSub = newCategory === 'legends' ? 'All Legends' : 'All Rare Recruits';
            setSubCategory(defaultSub);
            setIsPlus(false);
            setCurrentPage(1);
        }
    };

   const handlePageChange = (direction) => {
    clearUrlParams();
    const newPage = direction === 'next' ? currentPage + 1 : currentPage -1;
    if(newPage > 0){
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth'});
    }
  };

  const handlePageSizeChange = (newPageSize) => {
    if(newPageSize !== pageSize){
      setPageSize(newPageSize);
      setCurrentPage(1);
    }

  };

  return(
    <>
        <Toolbar 
            viewMode="characters"
            characterCategory={category}
            onCategoryChange={handleCategoryChange}
            subCategory = {subCategory}
            onSubCategoryChange={(sub)=> {setSubCategory(sub); setCurrentPage(1);}}
            isPlus={isPlus}
            onIsPlusChange={(val)=> {setIsPlus(val); setCurrentPage(1);}}
            searchTerm={searchTerm}
            onSearchChange={(term)=> {setSearchTerm(term); setCurrentPage(1);}}
            totalCount={data?.totalCount || 0}
            onAdminTrigger={()=> navigate('/admin')}
        />

        {error && <p className="error-message">{error.message}</p>}

        {!isLoading && !error && (
            <CharactersView
                characters={data?.characters || []}
                onPageSizeChange={handlePageSizeChange}
            />
        )}

        <Footer 
            currentPage={currentPage}
            hasMore={data?.hasMore || false}
            onPageChange={handlePageChange}
            hasSearched={true}
        />
    </>
  );
};

export default CharactersPage;