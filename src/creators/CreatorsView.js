import React, {useRef, useMemo} from 'react';
import './CreatorsView.css';
import { useTablePageSize } from './useTablePageSize';

function CreatorsView({creators, onPageSizeChange, currentPage, pageSize}){
    const containerRef = useRef(null);
    const tableHeaderRef = useRef(null);
    const titleRef = useRef(null);

    const exclusionRefs = useMemo(()=> [titleRef, tableHeaderRef], []);

    useTablePageSize(containerRef, exclusionRefs, {
        onPageSizeChange,
        mobileHeight: 55,
        desktopHeight: 75,
        mobileBuffer: 60, 
        desktopBuffer: 100  
    });


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
                                    {creator.social_url ? (
                                    <a 
                                        href={creator.social_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="captain-link"
                                    >
                                        <span className="captain-name">{creator.name}</span>
                                        <span className="external-icon"></span>
                                    </a>
                                    ): (
                                        <div className="captain-link" style={{cursor: 'default'}}>
                                            <span className="captain-name">{creator.name}</span>
                                        </div>
                                    
                                    )}
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