import { useState } from 'react';
import './Sidebar.css';
import DataTransferModal from './DataTransferModal';

function Sidebar({onViewChange, currentView, isOpen, onClose}){
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

    const navItems= [
        {key:'characters', label: 'Characters', className: 'characters-button', iconPath: "M17 21v-2a4 4 0 0 0-4-4H5a4 0 0 0-4 4v2"},
        {key: 'banners', label: 'Banners', className:'banners-button', iconPath:'M4 6h16M4 12h16M4 18h16'},
        {key:'grandVoyage', label: 'Grand Voyage', className: 'grand-voyage-button', iconPath: "M22 12h-4l-3 9L9 3l-3 9H2"}, 
        {key:'garpsChallenge', label: "Garp's Challenge", className: 'garps-challenge-button', iconPath: "M13 2L3 14h9l-1 8 10-12h-9l1-8z"}, 
        {key:'forestOfTraining', label: 'Forest of Training', className: 'forest-of-training-button', iconPath: "M10 22a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h0a2 2 0 0 1 2 3v2a2 2 0 0 1-2 2z M14 15a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h02 2 0 0 1 2 3va2 2 0 0 1-2 2z"}, 
        {key:'coliseum', label: 'Coliseum', className:'coliseum-button', iconPath: "M2 12.16V12a10 10 0 0 1 10-10h0a10 10 0 0 1 10 10v.16"}, 
        {key:'pirateKingAdventures', label: 'Pirate King Adventures', className:'pka-button', iconPath: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"}, 
        {key:'treasureMap', label: 'Treasure Map', className:'treasure-map-button', iconPath: "M1 6v16h16"}, 
        {key:'kizunaClash', label: 'Kizuna Clash', className:'kizuna-clash-button', iconPath: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"},  
    ];

    const icons = {
        youtubers: "M395.2 457.9c-22.2 1.3-44.5 2-66.6 4.2-29.9 3-59.8 6.7-89.6 11.1-18.4 2.7-36.6 7.1-54.7 11.4-5.8 1.4-9 2.5-13.1-2.2-9.9-10.8-20.6-20.8-31.3-30.8-24.6-23.1-49.7-45.7-74-69.2-17-16.4-32.9-34-44.8-54.7-3.5-6-6.6-12.3-8.9-18.9-3.5-9.8.4-15.9 10.8-16.5 7.2-.5 14.7-.1 21.7 1.5 21.2 4.8 42.3 10.6 63.5 15.6 13.1 3.1 26.5 2.9 39.6-.1 13.1-2.9 24.1-10.2 34.1-19.1 18.5-16.1 31.3-36.3 42.1-57.9 7.3-14.6 14.3-29.2 21.9-43.6 7.6-14.5 16.7-38.9 26.3-52.8 10.7-12.1 22.7-22.6 37.3-30.3 19.6-10.5 40.4-16.6 62.2-18.5 18-1.6 36.2-1 54.3-.3 29 1 56.2 8.7 80.8 24 13.4 8.3 25 19 33.6 32.2 10.4 16 19.9 32.5 29.2 49.2 5.8 10.5 9.8 21.9 15.7 32.3 9.5 16.6 18.7 33.4 30.1 48.6 13.3 17.7 30.6 31.5 52.9 36.8 11.8 2.8 23.9 1.6 35.6-.8 16.3-3.4 32.3-7.7 48.4-11.8 11.6-3 23.1-6.4 35.3-5.4 5.2.4 10.7.9 13.7 5.7 1.4 2.3 1.8 6.2.9 8.8-4.6 14.8-13 27.7-22.3 39.9-15.1 19.7-32.5 37.4-50.6 54.4-16.4 15.3-33.5 29.9-50 45.3-13.6 12.8-26.6 26.1-39.7 39.4-2.6 2.7-5.1 2.2-8.2 1.6-28.9-5.6-57.6-12.2-86.7-16.3-32-4.5-64.4-6.8-96.6-9.7-9.9-.9-19.9-.8-29.9-1.1-10.6-.1-19.9-.3-28.7-1z",
        discord: "M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5 .26-2.93 .71-4.27 1.33c-.01 0-.02 .01-.03 .02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02 .01 .04 .03 .05c1.8 1.32 3.53 2.12 5.2 2.65c.03 .01 .06 0 .07-.02c.4-.55 .76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08 .01-.11c.11-.08 .22-.17 .33-.25c.02-.02 .05-.02 .07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01 .05-.01 .07 .01c.11 .09 .22 .17 .33 .26c.04 .03 .04 .09 .01 .11c-.52 .31-1.07 .56-1.64 .78c-.04 .01-.05 .06-.04 .09c.32 .61 .68 1.19 1.07 1.74c.03 .01 .06 .02 .09 .01c1.72-.53 3.48-1.33 5.2-2.65c.02-.01 .03-.03 .03-.05c.44-4.52-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9 .96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9 .96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z",
        transfer: "M17 1l4 4-4 4 M3 11V9a4 4 0 0 1 4-4h14 M7 23l-4-4 4-4 M21 13v2a4 4 0 0 1-4 4H3"

    };


    return(
        <>
        <DataTransferModal 
            isOpen={isTransferModalOpen}
            onClose={()=> setIsTransferModalOpen(false)}
        />

        <div 
            className={`sidebar-backdrop ${isOpen ? 'open' : ''}`}
            onClick={onClose}></div>
     
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>

            <div className="sidebar-mobile-header">
                <span className="sidebar-logo">Menu</span>
                <button className="sidebar-close-btn" onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            <div className="sidebar-nav">
                {navItems.map(item => (
                    <button 
                        key={item.key}
                        className={`sidebar-button ${item.className} ${currentView === item.key ? 'active' : ''}`}
                        onClick={()=> currentView !== item.key && onViewChange(item.key)}
                    >
                        <span className="sidebar-accent"></span>
                        <span>{item.label}</span>
                    </button>
                ))}
            </div>

        <div className="sidebar-footer">
            <div className="footer-separator"></div>
            <div className="footer-links">
                <button 
                    className={`footer-btn youtube ${currentView === 'creators' ? 'active' : ''}`}
                    aria-label = "Creators"
                    onClick={()=> currentView !== 'creators' && onViewChange('creators')}
                    >
                    <svg viewBox="0 0 825 538" width="20" height="20" fill="currentColor">
                        <path d={icons.youtubers}/>
                    </svg>
                    <span className="tooltip">Creators</span>
                </button>

                <button className="footer-btn discord" aria-label="Discord">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d={icons.discord}/>
                    </svg>
                    <span className="tooltip">Discord</span>
                </button>

                <button className="footer-btn transfer" aria-label="Sync Data" onClick={()=> setIsTransferModalOpen(true)}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d={icons.transfer}/>
                    </svg>
                    <span className="tooltip">Sync Data</span>
                </button>
            </div>
        </div>
    </div>
   </>
    );
}

export default Sidebar;