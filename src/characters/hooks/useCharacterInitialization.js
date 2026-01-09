import {useState, useEffect, useCallback} from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCollection } from '../../context/CollectionContext';
import toast from 'react-hot-toast';

export const useCharacterInitialization = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const {fetchOtherBox} = useCollection();

    //Αρχικοποίηση state από URL params (αν υπαρχουν)
    const [category, setCategory] = useState(searchParams.get('cat') || 'all');
    const [subCategory, setSubCategory] = useState(searchParams.get('sub') || null);
    const [isPlus, setIsPlus] = useState(searchParams.get('plus') === 'true');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(60);
    
    //---FEATURE: View Box Deep Linking---
    useEffect(()=>{
        const viewBoxKey = searchParams.get('viewBox');

        if(viewBoxKey){
            const loadBox = async()=>{
                const success = await fetchOtherBox(viewBoxKey);
                if(success){
                    toast.success('Loaded User Box via Link');
                } else {
                    toast.error('Invalid Box Link');
                }

                //Καθαριζουμε το URL απο το viewBox param για να μην ξανατρέξει
                const newParams = new URLSearchParams(searchParams);
                newParams.delete('viewBox');
                setSearchParams(newParams, {replace: true});
            };
            loadBox();
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); //Τρέχει μονο μια φορα στο mount

    //---URL Sync Helpers
    const updateUrl = useCallback((updates) => {
        const newParams = new URLSearchParams(searchParams);

        //Διαγράφουμε το viewBox αν υπάρχει τυχαία
        newParams.delete('viewBox');

        Object.entries(updates).forEach(([key, value]) => {
            if(value === null || value === false){
                newParams.delete(key);
            } else{
                newParams.set(key, value);
            }
        });
        setSearchParams(newParams, {replace: true});
    }, [searchParams, setSearchParams]);

    useEffect(()=> {
        const params = new URLSearchParams(searchParams);

        if([...params.keys()].length === 0){
            updateUrl({
                cat: category,
                sub: subCategory,
                plus: isPlus
            });
        }
    }, [updateUrl, searchParams, category, subCategory, isPlus]);

    const handleCategoryChange = useCallback((newCategory) => {
        setCategory(newCategory);
        setIsPlus(false);
        setSubCategory(null);
        setCurrentPage(1);

        updateUrl({
            cat: newCategory,
            sub: null,
            plus: false 
        });
    }, [updateUrl]);

    const handleSubCategoryChange = useCallback((newSub) => {
        setSubCategory(newSub);
        setCurrentPage(1);
        updateUrl({sub: newSub});
    }, [updateUrl]);

    const handleIsPlusChange = useCallback((val) => {
        setIsPlus(val);
        setCurrentPage(1);
        updateUrl({plus: val});
    }, [updateUrl]);

    const handleSearchChange = (term) =>{
        setSearchTerm(term);
        setCurrentPage(1);
    };

    return{
        category, handleCategoryChange,
        subCategory, handleSubCategoryChange,
        isPlus, handleIsPlusChange,
        searchTerm, handleSearchChange,
        currentPage, setCurrentPage,
        pageSize, setPageSize
    };
};