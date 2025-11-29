import CrewCard from './CrewCard';
import PlaceholderCard from './Placeholder.js';
import './CrewsView.css';

const PlayIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="https:/www.w3.org/2000/svg" style={{marginRight: '8px'}}>
        <path d="M8 5V19L19 12L8 5Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)


function CrewsView({crews, crewPageSize}) {
    if (crews && crews.length === 0){
        return(
            <div className = "no-crews-message">
                <div className="empty-state-card">
                    <img src="/crews-not-found.png" className="luffy-empty-state-image"/>
                    <h2> Uncharted Waters Ahead!</h2>
                    <p>
                        It seems you're the first pirate to explore this area. If you've conquered this challenge, help us map the way! Join our Discord server to share your crew and guide your fellow adventurers.
                    </p>
            </div>
            </div>
        );
    }
        return (
            <div className="crews-view">
                {[...Array(crewPageSize)].map((_, index) => {
                    const crewData = crews? crews[index] : null;

                    if (crewData){
                        return(
                            <div key={crewData.id} className="crew-container">
                                <div className="card-wrapper">
                                    <CrewCard crew={crewData} />
                                    <a href={crewData.video_url} target="_blank" rel="noopener noreferrer" className='video-button'>
                                    Watch Video
                                </a>
                            </div>
                        </div>
                        );
                    }
                    else {
                        return (
                            <div key={`placeholder-${index}`} className="crew-container">
                                <div className="card-wrapper placeholder-wrapper">
                                    <PlaceholderCard />
                                <div className="video-button disabled"> &nbsp; </div>
                                </div>
                            </div>
                        );
                    }
                })}
                </div>
        );
}


export default CrewsView;