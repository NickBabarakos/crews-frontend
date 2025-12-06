import {useCollection} from './CollectionContext';
import InteractiveChar from './InteractiveChar';

function MemberSlot({main, support, role}) {
    const {isOwned, toggleChar} = useCollection();
   
    const mainId = main?.character_id;
    const supportId = support?.character_id;
    const rawMainNotes = main?.notes;
 

    const isEmpty = !main;
    const isMainOwned = isOwned(mainId);
    const mainLevel = (rawMainNotes && rawMainNotes !== 'optional') ? rawMainNotes: null;

    const isSupportOwned = isOwned(supportId);
    const isSupportOptional = support?.notes === 'optional';
    


    return(
        <div className={`member-slot ${isEmpty ? 'empty' : ''} ${role ? 'role-slot' : ''}`}>
            {role && !isEmpty && (
                <span className={`role-badge ${role === 'FC' ? 'fc-badge' : 'c-badge'}`}>
                    {role === 'FC' ? 'FRIEND' : 'CAPTAIN'}
                </span>
            )}
        {main && (
            <InteractiveChar
                id={main.character_id}
                type={main.type}
                url={main.info_url}
                className={`character-link ${main ? 'has-image': ''}`}
            >
                <img 
                    src={`${main.image_url}.png`} 
                    alt={main.name} 
                    title={main.name} 
                    className={`character-image ${isMainOwned ? '': 'missing'}`}
                />  
            </InteractiveChar>
        )}

        {main && mainLevel && (
            <div className="level-badge">LV.{mainLevel}</div>
        )}

        {support && (
            <InteractiveChar
                id={support.character_id}
                type={support.type}
                url={support.info_url}
                className="support-link has-image"
            >
                <img 
                    src={`${support.image_url}.png`} 
                    alt={support.name} 
                    className={`support-image ${isSupportOwned ? '' : 'missing'}`}
                />

                {support && isSupportOptional && (
                    <div className="optional-indicator">
                        !
                        <span className="tooltip-text">
                        Stat booster. Not required for the gimmicks of the stage.
                        </span>
                    </div>
                )}
            </InteractiveChar>
        )}
    </div>
    );
}

function CrewCard({crew}) {
    const captain = crew.members.find(m=>m.position === 'Captain');
    const crewmate1 = crew.members.find(m => m.position === 'Crewmate1');
    const crewmate2 = crew.members.find(m => m.position === 'Crewmate2');
    const crewmate3 = crew.members.find(m => m.position === 'Crewmate3');
    const crewmate4 = crew.members.find(m => m.position === 'Crewmate4');
    const friendCaptain = crew.members.find(m => m.position === 'Friend Captain');

    const supportCaptain = crew.members.find(m=>m.position === 'Support Captain');
    const support1 = crew.members.find(m => m.position === 'Support1');
    const support2 = crew.members.find(m => m.position === 'Support2');
    const support3 = crew.members.find(m => m.position === 'Support3');
    const support4 = crew.members.find(m => m.position === 'Support4');

    return(
        <div className="crew-card">
            <h4>&nbsp;</h4>
            <div className="crew-members-grid">
                <MemberSlot main={friendCaptain} role="FC"/>
                <MemberSlot main={captain} support={supportCaptain} role="Captain" />
                <MemberSlot main={crewmate4} support={support4} />
                <MemberSlot main={crewmate1} support={support1} /> 
                <MemberSlot main={crewmate3} support={support3} />
                <MemberSlot main={crewmate2} support={support2} /> 
            </div>
        </div>
    );

}

export default CrewCard;