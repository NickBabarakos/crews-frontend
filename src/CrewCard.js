function MemberSlot({main, support}) {
    const characterLinkClass = `character-link ${main ? 'has-image': ''}`;
    const supportLinkClass = `support-link ${support ? 'has-image' : ''}`;

    return(
        <div className="member-slot">
            <a href={main?.info_url} target="_blank" rel="noopener noreferrer" className={characterLinkClass}>
                {main && <img src={`${main.image_url}.png`} alt={main.name} className="character-image "/>}
            </a>

            {main?.position !== 'Friend Captain' && (
                <a href={support?.info_url} target="_blank" rel="noopener noreferrer" className={supportLinkClass}>
                {support && <img src={`${support.image_url}.png`} alt={support.name} className="support-image" />}
                </a>
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
                <MemberSlot main={friendCaptain}/>
                <MemberSlot main={captain} support={supportCaptain} />
                <MemberSlot main={crewmate4} support={support4} />
                <MemberSlot main={crewmate1} support={support1} /> 
                <MemberSlot main={crewmate3} support={support3} />
                <MemberSlot main={crewmate2} support={support2} /> 
            </div>
        </div>
    );

}

export default CrewCard;