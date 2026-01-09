import {useState, useLayoutEffect, useCallback, useRef} from 'react';

export const useTablePageSize = (containerRef, exclusionRefs = [], options = {}) => {
    const {
        mobileHeight = 55,
        desktopHeight = 75,
        mobileBreakpoint = 768,
        mobileBuffer = 10,
        desktopBuffer = 40,
        onPageSizeChange
    } = options; 

    const [pageSize, setPageSize] = useState(0);
    const timeoutRef = useRef(null);

    const calculate = useCallback(()=> {
        const container = containerRef.current;
        if(!container) return;

        const isMobile = window.innerWidth <= mobileBreakpoint;
        const containerHeight = container.clientHeight;

        //Υπολογισμος υψους των στοιχειων που πρέπει να αφαιρεθουν (Headers, Titles)
        const exclusionsHeight = exclusionRefs.reduce((acc, ref) => {
            return acc + (ref.current ? ref.current.offsetHeight : 0);
        }, 0);

        //Πρόσθετα buffers (margins/paddings που δεν πιάνονται στο offsetHeight)
        const buffer = isMobile ? mobileBuffer : desktopBuffer;
        
        const availableHeight = containerHeight - exclusionsHeight - buffer;
        const rowHeight = isMobile? mobileHeight : desktopHeight;

        if(availableHeight <=0 ) return;

        const rowsThatFit = Math.floor(availableHeight/rowHeight);
        const newSize = Math.max(3, rowsThatFit); //Ελάχιστο 3 γραμμες

        setPageSize(prevSize => {
            if(prevSize !== newSize) {
                //Καλουμε το callback μόνο αν αλλάζει η τιμή
                if(typeof onPageSizeChange === 'function'){
                    onPageSizeChange(newSize);
                }
                return newSize;
            }
            return prevSize; 
        });
    }, [containerRef, exclusionRefs, mobileHeight, desktopHeight, mobileBreakpoint, mobileBuffer, desktopBuffer, onPageSizeChange]);

    useLayoutEffect(()=> {
        calculate();

        const observer = new ResizeObserver(()=>{
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(calculate, 100);
        });

        if(containerRef.current){
            observer.observe(containerRef.current);
        }

        return () => {
            observer.disconnect();
            clearTimeout(timeoutRef.current);
        };
    }, [calculate, containerRef]);

    return pageSize;
};