import {useRef, useEffect} from 'react';
import './BossGridView.css';
import { useResponsiveGrid } from '../../../hooks/useResponsiveGrid';

/**
 * BOSS SELECTION GRID (Coliseum Mode Only)
 * ---------------------------------------
 * Displayed specifically when in 'Coliseum' mode and NO stage is selected yet.
 * Renders a grid of Boss Banners/Portraits instead of Crew Cards.
 * 
 * Interaction: Clicking a boss sets the 'selectedBoss' state in the parent Page,
 * which then triggers the fetch Crews for thet specific boss.
 */
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