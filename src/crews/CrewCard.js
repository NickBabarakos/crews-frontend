import {useCollection} from '../CollectionContext';
import InteractiveChar from '../InteractiveChar';
import { useFavorites } from '../CollectionContext';
import {toast} from 'react-hot-toast';

const StarIcon = ({filled}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {filled ? (
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill="#fbbf24" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        ):(
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        )}
    </svg>
);

const ArrowIcon = () => (
       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.61109 12.4L10.8183 18.5355C11.0462 19.6939 12.6026 19.9244 13.1565 18.8818L19.0211 7.84263C19.248 7.41555 19.2006 6.94354 18.9737 6.58417M9.61109 12.4L5.22642 8.15534C4.41653 7.37131 4.97155 6 6.09877 6H17.9135C18.3758 6 18.7568 6.24061 18.9737 6.58417M9.61109 12.4L18.9737 6.58417M19.0555 6.53333L18.9737 6.58417" 
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const CommentIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
);

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

function CrewCard({crew, onReport}) {
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

    const handleShare = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('crew', crew.id);
        const linkToCopy = currentUrl.toString();

        if(navigator.clipboard && navigator.clipboard.writeText){
            navigator.clipboard.writeText(linkToCopy)
                .then(()=> toast.success("Crew link copied to clipboard!"))
                .catch(()=> toast.error("Failed to copy link"));
        } else{
            try{
                const textArea = document.createElement("textarea");
                textArea.value=linkToCopy;

                textArea.style.position ="fixed";
                textArea.style.left="-9999px";
                textArea.style.top="0px";

                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);

                if(successful){
                    toast.success("Crew link copied to clipboard");
                } else {
                    toast.error("Failed to copy link manually");
                }
            } catch(err){
                console.error('Faillback copy failed', err);
                toast.error("Browser blocked copy action");
            }
        }
    };

    return(
        <div className="crew-card">
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