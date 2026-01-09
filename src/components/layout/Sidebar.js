import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';
import DataTransferModal from '../modals/DataTransferModal';
import { CloseIcon, YouTubeIcon, DiscordIcon, TransferIcon } from '../Icons';

function Sidebar({isOpen, onClose}){
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const currentView = location.pathname.split('/')[1] || 'home';

    const handleNavigation = (path) => {
        navigate(`/${path}`);
        onClose();
    }

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
                    <CloseIcon/>
                </button>
            </div>

            <div className="sidebar-nav">
                {navItems.map(item => (
                    <button 
                        key={item.key}
                        className={`sidebar-button ${item.className} ${currentView === item.key ? 'active' : ''}`}
                        onClick={()=> handleNavigation(item.key)}
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
                    onClick={()=> navigate('/creators')}
                    >
                        <YouTubeIcon/>
                    <span className="tooltip">Creators</span>
                </button>

                <button className="footer-btn discord" aria-label="Discord">
                    <DiscordIcon/>
                    <span className="tooltip">Discord</span>
                </button>

                <button className="footer-btn transfer" aria-label="Sync Data" onClick={()=> setIsTransferModalOpen(true)}>
                    <TransferIcon/>
                    <span className="tooltip">Sync Data</span>
                </button>
            </div>
        </div>
    </div>
   </>
    );
}

export default Sidebar;


