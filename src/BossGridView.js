import {useRef, useEffect, useCallback} from 'react';
import './BossGridView.css';

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
    const resizeTimeoutRef = useRef(null);

    const calculatePageSize = useCallback(()=> {
        if(!gridRef.current) return;
        const containerWidth = gridRef.current.clientWidth;
        const containerHeight = gridRef.current.clientHeight;
        const cardMinWidth = 240;
        const cardHeight = 70;
        const gap =16;
        const padding= 48;

        if(containerWidth <= 0 || containerHeight <= 0) return;
        const columns = Math.floor((containerWidth + gap)/(cardMinWidth + gap));
        const availableHeight = containerHeight - padding;
        const rows = Math.floor((availableHeight + gap)/(cardHeight + gap));
        const newSize = Math.max(1,columns)*Math.max(1,rows);
        if(newSize>0) onPageSizeChange(newSize);
    }, [onPageSizeChange]);

    useEffect(()=> {
        calculatePageSize();
        const observer = new ResizeObserver(()=>{
            clearTimeout(resizeTimeoutRef.current);
            resizeTimeoutRef.current = setTimeout(()=> {calculatePageSize(); }, 100);
        });
        if(gridRef.current) observer.observe(gridRef.current);
        return ()=> { observer.disconnect(); clearTimeout(resizeTimeoutRef.current);};
    }, [calculatePageSize]);

    return(
        <div className="boss-grid-view" ref={gridRef}>
            {stages && stages.map(stage => (
                <BossCard key={stage.id} stage={stage} onClick={onBossClick} />
            ))}
        </div>
    );
}

export default BossGridView;