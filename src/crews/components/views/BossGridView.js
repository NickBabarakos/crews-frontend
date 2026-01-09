import {useRef, useLayoutEffect} from 'react';
import './BossGridView.css';

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
    
    useLayoutEffect(()=> {
        if(!gridRef.current) return;

        const calculateSize = (entries) =>{
            const entry = entries[0];
            if(!entry) return;

            const {width, height} = entry.contentRect;

            if(width<=0 || height <= 0) return;

            const CARD_MIN_WIDTH=240;
            const CARD_HEIGHT = 70;
            const GAP = 16;

            const columns = Math.floor((width + GAP)/(CARD_MIN_WIDTH + GAP));

            const rows = Math.floor((height+GAP)/(CARD_HEIGHT + GAP));

            const safeCols = Math.max(1,columns);
            const safeRows = Math.max(1,rows);

            const newPageSize = safeCols * safeRows;
            onPageSizeChange(prev => (prev !== newPageSize ? newPageSize : prev));
        };

        const observer = new ResizeObserver(calculateSize);
        observer.observe(gridRef.current);
    }, [onPageSizeChange]);


    return(
        <div className="boss-grid-view" ref={gridRef}>
            {stages && stages.map(stage => (
                <BossCard key={stage.id} stage={stage} onClick={onBossClick} />
            ))}
        </div>
    );
}

export default BossGridView;