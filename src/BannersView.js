import {useRef, useEffect} from 'react';
import './BannersView.css';
import { useResponsiveGrid } from './hooks/useResponsiveGrid';

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

    const calculatedSize = useResponsiveGrid(gridRef, {
        cardWidth: 320,
        cardHeight: 250,
        gap: 24,
        minRows: 2
    });

    useEffect(()=> {
        if(calculatedSize>0) onPageSizeChange(calculatedSize);
    }, [calculatedSize, onPageSizeChange]);

    return(
        <div className="banners-view" ref={gridRef}>
            {banners && banners.map(banner => (
                <BannerCard key={banner.id} banner={banner} onClick={onBannerClick} />
            ))}
        </div>
    );
}
export default BannersView;