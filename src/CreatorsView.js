import React, {useRef, useEffect, useCallback} from 'react';
import './CreatorsView.css';

function CreatorsView({creators, onPageSizeChange, currentPage, pageSize}){
    const containerRef = useRef(null);
    const tableHeaderRef = useRef(null);
    const titleRef = useRef(null);
    const resizeTimeoutRef = useRef(null);

    const calculatePageSize = useCallback(()=> {
        if(!containerRef.current) return;
        const isMobile = window.innerWidth <= 768;
        const containerHeight = containerRef.current.clientHeight;

        const titleHeight = titleRef.current ? titleRef.current.offsetHeight + (isMobile ? 15:50):150;
        const tableHeaderHeight = tableHeaderRef.current? tableHeaderRef.current.offsetHeight : 60;
        const paddingBuffer = isMobile ? 10: 40;

        const availableHeight = containerHeight - titleHeight - tableHeaderHeight - paddingBuffer;
        const estimatedRowHeight = isMobile ? 55:  75;

        if (availableHeight <= 0 ) return;

        const rowThatFit = Math.floor(availableHeight/estimatedRowHeight);
        const newSize = Math.max(3,rowThatFit);
        onPageSizeChange(newSize);
    }, [onPageSizeChange]);

    useEffect(()=>{
        calculatePageSize();
        
        const observer = new ResizeObserver(()=> {
            clearTimeout(resizeTimeoutRef.current);
            resizeTimeoutRef.current = setTimeout(()=> {
                calculatePageSize();
            }, 100);
        });

        if(containerRef.current) { observer.observe(containerRef.current);}

        return ()=> {
            observer.disconnect();
            clearTimeout(resizeTimeoutRef.current);
        };

}, [calculatePageSize]);

    if(!creators) return null;

    const startRank = (currentPage-1)*pageSize;

    return(
        <div className="creators-view-container" ref={containerRef}>
            <div className="wanted-header" ref={titleRef}>
                <h2 className="marine-subtitle">MARINE HEADQUARTERS DATABASE</h2>
                <h1 className="wanted-title">MOST WANTED FLEET CAPTAINS</h1>
                <div className="header-decoration-line"></div>
            </div>

            <div className="table-wrapper">
                <table className="creators-table">
                    <thead ref={tableHeaderRef}>
                        <tr>
                            <th className="rank-col">#</th>
                            <th className="captain-col">CAPTAIN</th>
                            <th className="bounty-col">CREWS IN NEW WORLD</th>
                        </tr>
                    </thead>
                    <tbody>
                        {creators.map((creator, index) => (
                            <tr key={creator.id} className="creator-row">
                                <td className="rank-col">
                                    <span className={`rank-badge rank-${startRank + index + 1}`}>
                                        {startRank + index +1}
                                    </span>
                                </td>
                                <td className="captain-col">
                                    <a 
                                        href={creator.social_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="captain-link"
                                    >
                                        <span className="captain-name">{creator.name}</span>
                                        <span className="external-icon"></span>
                                    </a>
                                </td>
                                <td className="bounty-col bounty-col-cell">
                                    <div className="bounty-container">
                                        <span className="bounty-value">{creator.crew_count}</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CreatorsView;