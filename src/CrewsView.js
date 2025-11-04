import CrewCard from './CrewCard';
import PlaceholderCard from './Placeholder.js';

const TOTAL_SLOTS = 4;

function CrewsView({crews}) {
        return (
            <div className="crews-view">
                {[...Array(TOTAL_SLOTS)].map((_, index) => {
                    const crewData = crews? crews[index] : null;

                    if (crewData){
                        return(
                            <div key={crewData.id} className="crew-container">
                                <CrewCard crew={crewData} />
                                <a href={crewData.video_url} target="_blank" rel="noopener noreferrer" className='video-button'>
                                    Playthrough
                                </a>
                            </div>
                        );
                    }
                    else {
                        return (
                            <div key={`placeholder-${index}`} className="crew-container">
                                <PlaceholderCard />
                                <div className="video-button disabled"> Playthrough </div>
                            </div>
                        );
                    }
                })}
                </div>
        );
}


export default CrewsView;