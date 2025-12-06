import {useRef, useEffect, useCallback} from 'react';
import './BossGridView.css';
import { useResponsiveGrid } from './hooks/useResponsiveGrid.js';

function BossCard({stage, onClick}){
    const cleanName = stage.name.replace(/^Vs\.\s+/i, '');

    return(
        <div
            className="boss-card"
            onClick={()=> onClick(stage)}
            title={stage.name}
        >
            <div className="boss-image-wrapper">
                <img 
                    src={stage.image_url ? `${stage.image_url}.png`: '/boss-placeholder.png'}
                    alt={stage.name}
                    loading="lazy"
                    onError={(e)=> {e.target.src='/boss-placeholder.png'}}
                />
            </div>
            <div className="boss-info">
                <span className="boss-name">{cleanName}</span>
            </div>
        </div>
    );
}

function BossGridView({stages, onPageSizeChange, onBossClick}){
    const gridRef = useRef(null);
    
    const calculatedSize = useResponsiveGrid(gridRef, {
        cardWidth: 240,
        cardHeight: 70,
        gap: 16,
        minRows: 1
    });

    useEffect(()=>{
        if (calculatedSize>0) onPageSizeChange(calculatedSize);
    }, [calculatedSize, onPageSizeChange]);

    return(
        <div className="boss-grid-view" ref={gridRef}>
            {stages && stages.map(stage => (
                <BossCard key={stage.id} stage={stage} onClick={onBossClick} />
            ))}
        </div>
    );
}

export default BossGridView;