import './App.css';

function Sidebar({onViewChange}){
    return(
        <div className="sidebar">
            <button className="sidebar-button character-button" onClick={()=>onViewChange('characters')}>Characters </button>
            <button className="sidebar-button grand-voyage-button" onClick={()=>onViewChange('grandVoyage')}>Grand Voyage</button>
            <button className="sidebar-button Garp's Challenge!">Garp's Challenge!</button>
            <button className="sidebar-button Forest of Training">Forest of Training</button>
            <button className="sidebar-button Clash/Coliseum">Clash/Coliseum</button>
            <button className="sidebar-button Pirate King Adventures">Pirate King Adventures</button>
            <button className="sidebar-button Treasure Map">Treasure Map</button>
            <button className="sidebar-button Kizuna Clash">Kizuna Clash</button>
        </div>
    );
}

export default Sidebar;