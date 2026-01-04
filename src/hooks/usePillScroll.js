import {useState, useRef, useLayoutEffect } from 'react';

export const usePillScroll = (config, crewFilterValues, isPillsOnly) => {
    const [scrollStates, setScrollStates] = useState({});
    const pillsRefs = useRef({});

    const checkScroll = (element, filterId) => {
        if(!element) return;
        const {scrollLeft, scrollWidth, clientWidth} = element;

        let newState = 'start';
        if(scrollLeft > 0 && scrollLeft + clientWidth < scrollWidth -1){
            newState= 'middle';
        } else if (scrollLeft + clientWidth >= scrollWidth -1 && scrollLeft > 0){
            newState = 'end';
        } else if (scrollLeft === 0 && scrollWidth > clientWidth) {
            newState = 'start';
        } else {
            newState = 'none'
        }

        setScrollStates(prev => {
            if (prev[filterId] === newState) return prev;
            return {...prev, [filterId]: newState};
        });
    };

    const handleWheel = (e) => {
        if(e.currentTarget){
            e.currentTarget.scrollBy({
                left: e.deltaY,
                behavior: 'smooth'
            });
        }   
    };

    useLayoutEffect(()=>{
        Object.keys(pillsRefs.current).forEach((key) => {
            const el = pillsRefs.current[key];
            if(el) checkScroll(el,key);
        });
    }, [config, crewFilterValues, isPillsOnly]);


    return{
        scrollStates,
        pillsRefs,
        checkScroll,
        handleWheel
    };

};