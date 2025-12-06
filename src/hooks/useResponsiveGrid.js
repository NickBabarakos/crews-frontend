import {useState, useEffect, useCallback, useRef} from 'react';

export const useResponsiveGrid = (containerRef, {
    cardWidth, 
    cardHeight,
    gap=0,
    minRows=1,
    maxRows,
    shouldKeepSquare=false,
    widthBuffer = 15,
    heightBuffer= 10
 }) => {
    const [pageSize, setPageSize] = useState(0);
    const timeoutRef = useRef(null);

    const calculate = useCallback(()=> {
        const element = containerRef.current;
        if(!element) return;

        const style = window.getComputedStyle(element);
        const paddingX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
        const paddingY = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);

        const availableWidth = (element.clientWidth - paddingX)-widthBuffer;
        const availableHeight = (element.clientHeight - paddingY)-heightBuffer;

        if(availableWidth <= 0 || availableHeight <= 0) return;

        const columns = Math.floor((availableWidth+gap)/(cardWidth+gap));
        const safeCols = Math.max(1,columns);

        let rowHeight;

        if(shouldKeepSquare){
            const actualCardWidth = (availableWidth-(columns-1)*gap)/safeCols;
            rowHeight= Math.floor(actualCardWidth);
        } else {
            rowHeight = cardHeight;
        }
        const rows = Math.floor((availableHeight + gap)/(rowHeight+gap));

        let safeRows = Math.max(minRows, rows);
        if(maxRows) {
            safeRows = Math.min(safeRows,maxRows);
        }
        const newSize = safeCols*safeRows;

        setPageSize(prev => prev === newSize ? prev: newSize);
    }, [cardWidth, cardHeight, gap, minRows, maxRows, shouldKeepSquare, containerRef])

    useEffect(()=> {
        calculate();
        const observer = new ResizeObserver(()=>{
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(calculate,200);
        });

        if(containerRef.current){ observer.observe(containerRef.current);}

        return()=> {
            observer.disconnect();
            clearTimeout(timeoutRef.current);
        };
    }, [calculate, containerRef]);

    return pageSize;

 }