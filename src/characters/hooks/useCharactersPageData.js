import {useState, useEffect, useMemo } from 'react';
import { useCharacters } from '../../hooks/useCharacters';
import { useCollection } from '../../context/CollectionContext';
import { ALL_LEGEND_TYPES, ALL_RR_TYPES, RR_MAPPING } from '../../utils/constants';

export const useCharactersPageData = ({
    category,
    subCategory,
    isPlus,
    searchTerm,
    currentPage,
    pageSize
}) => {
    const {getOwnedCountByCategory, myKeys} = useCollection();
    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

    //---Debounce Logic---
    useEffect(()=> {
        const timer = setTimeout(()=> {
            setDebouncedSearch(searchTerm);
        }, 400); //400ms καθυστερηση
        return ()=> clearTimeout(timer);
    }, [searchTerm]);

    //---Character Type Calculation Logic---
    const characterSearchType = useMemo(()=>{
        if(category === 'all'){
            return 'ALL';
        } else if (isPlus){
            return category === 'legends' ? '6+ Legend' : '5+ Rare Recruit';
        }else{
            if(category === 'legends'){
                return (!subCategory || subCategory === 'All Legends' || subCategory === 'null')
                    ? ALL_LEGEND_TYPES.join(',')
                    : subCategory;
        } else if (category === 'rareRecruits'){
                return (!subCategory || subCategory === 'All Rare Recruits')
                    ? ALL_RR_TYPES.join(',')
                    : (RR_MAPPING[subCategory] || subCategory);
        }
      }
      return 'ALL';
    }, [category, subCategory, isPlus]);

    //---API Call---
    const {data, isLoading, error} = useCharacters({
        type: characterSearchType,
        search: debouncedSearch,
        page: currentPage,
        limit: pageSize,
        userKey: myKeys?.secretKey
    });

    //---Owned Count Calculation---
    //Υπολογισμος ποσους χαρακτηρες εχει ο χαρακτηρας απο την τρέχουσα κατηγορια
    const ownedCount = useMemo(()=> {
        return getOwnedCountByCategory(category, subCategory, isPlus);
    }, [category, subCategory, isPlus, getOwnedCountByCategory]);

    const displayOwnedCount = debouncedSearch ? (data?.ownedCount || 0) : ownedCount;

    return{
        characters: data?.characters || [],
        totalCount: data?.totalCount || 0,
        hasMore: data?.hasMore || false,
        isLoading,
        error,
        ownedCount: displayOwnedCount
    };
};