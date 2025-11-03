function CrewsView({crews}) {
    if( !crews || crews.length === 0){
        return <div className="crews-view"> <p>No crews found. Please select a stage and level.</p></div>
    }

    return(
        <div className="crews-view">
            {crews.map(crew=>(
                <div key={crew.id} className="crew-card">
                    {}
                </div>
            ))}
        </div>
    );
}

export default CrewsView;