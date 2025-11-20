import './App.css';

function Sidebar({onViewChange, currentView}){
    return(
        <div className="sidebar">
            <button 
                className={`sidebar-button character-button ${currentView === 'characters' ? 'active' : ''}`}
                onClick={()=>onViewChange('characters')}>Characters 
            </button>
            <button 
                className={`sidebar-button grand-voyage-button ${currentView === 'grandVoyage' ? 'active' : ''}`}
                onClick={()=>onViewChange('grandVoyage')}>Grand Voyage
            </button>
            <button     
                className={`sidebar-button garps-challenge-button ${currentView === 'garpsChallenge' ? 'active' : ''}`} 
                onClick={()=> onViewChange('garpsChallenge')}>Garp's Challenge!
            </button>
            <button 
                className={`sidebar-button forest-of-training-button ${currentView === 'forestOfTraining' ? 'active' : ''}`}
                onClick={()=>onViewChange('forestOfTraining') }>Forest of Training
            </button>
            <button 
                className={`sidebar-button clash-button ${currentView === 'clash' ? 'active' : ''}`}
                onClick={()=> onViewChange('clash')}>Clash
            </button>
            <button 
                className={`sidebar-button coliseum-button ${currentView === 'coliseum' ? 'active' : ''}`} 
                onClick={()=> onViewChange('coliseum')}>Coliseum
            </button>
            <button 
                className={`sidebar-button pka-button ${currentView === 'pirateKingAdventures' ? 'active' : ''}`} 
                onClick={()=>onViewChange('pirateKingAdventures')}>Pirate King Adventures
            </button>
            <button 
                className={`sidebar-button treasure-map-button ${currentView === 'treasureMap' ? 'active' : ''}`}
                onClick={()=> onViewChange('treasureMap')}>Treasure Map
            </button>
            <button 
                className={`sidebar-button kizuna-clash-button ${currentView === 'kizunaClash' ? 'active' : ''}`}
                onClick={()=> onViewChange('kizunaClash')}>Kizuna Clash
            </button>
        </div>
    );
}

export default Sidebar;