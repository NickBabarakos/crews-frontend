import {useRef, useEffect, useCallback} from 'react';
import './BannersView.css';

function BannerCard({banner, onClick}){
    const formatDate = (dateStr)=> {
        if(!dateStr) return '-';
        const date = new Date(dateStr);
        if(isNaN(date.getTime())) return 'Invalid Date';

        return date.toLocaleString(undefined, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    return (
        <div className="banner-card" onClick={()=> onClick(banner.id)}>
            <div className="banner-image-container">
                <img src={banner.image_url} alt={banner.title} loading="lazy" />
            </div>
            <div className="banner-info">
                <h3 className="banner-title">{banner.title}</h3>
                <div className="banner-dates">
                    <div className="date-box start">
                        <span className="date-label">Start</span>
                        <span className="date-value">{formatDate(banner.start_date)}</span>
                    </div>
                    <div className="date-box end">
                        <span className="date-label">End</span>
                        <span className="date-value">{formatDate(banner.end_date)}</span>
                    </div>
                </div>
            </div>
        </div>

    );
}

function BannersView({banners, onPageSizeChange, onBannerClick}){
    const gridRef = useRef(null);
    const resizeTimeoutRef = useRef(null);

    const calculatePageSize = useCallback(()=>{
        if(!gridRef.current) return;
        const containerWidth = gridRef.current.clientWidth;
        const containerHeight = gridRef.current.clientHeight;

        const cardWidth = 320;
        const cardHeight = 250;
        const gap = 24;

        if(containerWidth <= 0 || containerHeight <=0) return;

        const columns = Math.floor((containerWidth + gap) / (cardWidth+gap));
        const rows = Math.floor((containerHeight + gap)/(cardHeight+gap));
        const newSize = Math.max(1,columns)*Math.max(2,rows);

        if(newSize>0) onPageSizeChange(newSize);
    }, [onPageSizeChange]);

    useEffect(()=> {
        calculatePageSize();
        const observer = new ResizeObserver(()=> {
            clearTimeout(resizeTimeoutRef.current);
            resizeTimeoutRef.current = setTimeout(calculatePageSize, 100);
        });
        if(gridRef.current) observer.observe(gridRef.current);
        return ()=> { observer.disconnect(); clearTimeout(resizeTimeoutRef.current);};
    }, [calculatePageSize]);

    return(
        <div className="banners-view" ref={gridRef}>
            {banners && banners.map(banner => (
                <BannerCard key={banner.id} banner={banner} onClick={onBannerClick} />
            ))}
        </div>
    );
}
export default BannersView;