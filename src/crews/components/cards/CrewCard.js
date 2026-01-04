import InteractiveChar from '../../../components/common/InteractiveChar';
import { useFavorites, useCollection } from '../../../context/CollectionContext';
import { ArrowIcon, CommentIcon } from '../../../components/Icons';
import { useShareLink} from '../../../hooks/useShareLink';

const StarIcon = ({filled}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {filled ? (
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill="var(--color-gold)" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        ):(
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        )}
    </svg>
);


/**
 * CREW MEMBER SLOT (Internal Helper)
 * ----------------------------------
 * Renders a single character slot containing a Main Unit and an optional Support Unit.
 * Handles visual cues for:
 * - Missing units (Greyed Out)
 * - Optional Supports (Exclamation mark)
 * - Role Badges (Captain/Friend Captain)
 */
function MemberSlot({main, support, role, exportMode}) {
    const {isOwned} = useCollection();
   
    const mainId = main?.character_id;
    const supportId = support?.character_id;
    const rawMainNotes = main?.notes;
 

    const isEmpty = !main;
    const isMainOwned = isOwned(mainId) || exportMode;
    const mainLevel = (rawMainNotes && rawMainNotes !== 'optional') ? rawMainNotes: null;

    const isSupportOwned = isOwned(supportId) || exportMode;
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
                    crossOrigin = "anonymous"
                    loading="eager"
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
                    crossOrigin="anonymous"
                    loading="eager"
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

/**
 * CREW CARD COMPONENT
 * -------------------
 * The primary display unit for a strategy.
 * Visualizes the 6-member team + support and provides action buttons.
 * @param {object} crew - The full crew data object. 
 * @param {boolean} exportMode - If true, hides interactive buttons (used for generating images)
 */
function CrewCard({crew, onReport, exportMode = false}) {
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
    const {isFavorite, toggleFavorite} = useFavorites();
    const favorited = isFavorite(crew.id);
    const {shareLink} = useShareLink();

    const handleShare = (e) => {
        e.preventDefault();
        e.stopPropagation();
        shareLink(crew.id);
    };

    
    return(
        <div className="crew-card">
            {!exportMode &&(
            <div className="card-actions">
                <button 
                    className="action-btn report-btn"
                    onClick={(e) => {
                        e.preventDefault();
                        if(onReport) onReport(crew);
                    }}
                    title="Report an issue/Leave a note"
                >
                    <CommentIcon/>
                </button>

                <button
                    className="action-btn share-btn"
                    onClick={handleShare}
                    title="Share this crew"
                >
                    <ArrowIcon/>
                </button>

                <button 
                    className={`action-btn favorite-btn ${favorited ? 'active' : ''}`}
                    onClick={(e)=> {
                        e.preventDefault();
                        toggleFavorite(crew.id);
                    }}
                    title={favorited ? "Remove from favorites": "Add to favorites"}
            >
                <StarIcon filled={favorited}/>
            </button>

           
        </div>
            )}

            <h4>{exportMode ? (crew.title || crew.crew_title): '\u00A0'}</h4>
            <div className="crew-members-grid">
                <MemberSlot main={friendCaptain} role="FC" exportMode={exportMode}/>
                <MemberSlot main={captain} support={supportCaptain} role="Captain" exportMode={exportMode}/>
                <MemberSlot main={crewmate4} support={support4} exportMode={exportMode} />
                <MemberSlot main={crewmate1} support={support1} exportMode={exportMode} /> 
                <MemberSlot main={crewmate3} support={support3} exportMode={exportMode} />
                <MemberSlot main={crewmate2} support={support2} exportMode={exportMode} /> 
            </div>

        </div>
    );

}

export default CrewCard;