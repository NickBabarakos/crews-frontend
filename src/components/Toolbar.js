import './Toolbar.css';
import CharactersToolbar from '../characters/CharactersToolbar';
import CrewsToolbar from '../crews/components/listing/CrewsToolbar';

const crewBasedViews = ['grandVoyage', 'garpsChallenge', 'forestOfTraining', 'coliseum', 'pirateKingAdventures', 'treasureMap', 'kizunaClash'];

function Toolbar(props){
    return(
        <div className="toolbar">
            {props.viewMode === 'characters' && <CharactersToolbar {...props} />}
            {crewBasedViews.includes(props.viewMode) && <CrewsToolbar {...props} />}
        </div>
    );
}

export default Toolbar;