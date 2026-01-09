import {useRef, useEffect} from 'react';
import './BannersView.css';
import { useResponsiveGrid } from '../hooks/useResponsiveGrid';
import { useEventTimer } from '../hooks/useEventTimer';
import { ClockIcon } from '../components/Icons';

function BannerCard({banner, onClick}){
    const {status, countdown, progress} = useEventTimer(banner.start_date, banner.end_date);

    const formatDisplayDate = (dateStr) => {
        if(!dateStr) return '';
        const date = new Date(dateStr.includes('Z') ? dateStr : `${dateStr} PST`);
        return date.toLocaleString('en-GB', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    let timerText = '';
    if(status === 'active'){
        timerText = `Ends: ${formatDisplayDate(banner.end_date)} (${countdown})`;
    } else if(status === 'upcoming'){
        timerText = `Starts: ${formatDisplayDate(banner.start_date)} (${countdown})`;
    } else{
        timerText = 'Ended'
    }

    return (
        <div className={`banner-card ${status}`} onClick={()=> onClick(banner.id)}>
            <div className="banner-image-container">
                <img src={banner.image_url} alt={banner.title} loading="lazy" />

                {status === 'active' && (
                    <div className="banner-progress-overlay" style={{
                        position: 'absolute',
                        bottom: 0, left: 0, height: '4px',
                        backgroundColor: 'var(--color-brand-500)',
                        width: `${100-progress}%`,
                        zIndex: 10,
                        transition: 'width 1s linear'
                    }} />
                )}
            </div>
            <div className="banner-info">
                <h3 className="banner-title">{banner.title}</h3>
                <div className={`timer-badge ${status}`} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.85rem',
                    color: status === 'active' ? 'var(--color-success)' : 'var(--text-muted)',
                    fontWeight: 600,
                    whiteSpace: 'nowrap'
                }}>
                   <ClockIcon/>
                    <span>{timerText}</span>
                </div>
            </div>
        </div>

    );
}

function BannersView({banners, onPageSizeChange, onBannerClick}){
    const gridRef = useRef(null);

    const calculatedSize = useResponsiveGrid(gridRef, {
        cardWidth: 320,
        cardHeight: 260,
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