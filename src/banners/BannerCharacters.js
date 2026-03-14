import InteractiveChar from "../components/common/InteractiveChar";
import {useCollection} from '../context/CollectionContext';
import { getImageUrl } from '../utils/imageUtils';
import '../characters/CharactersView.css';

function BannerCharacters({data}) {
        const {isOwned} = useCollection();


    return(
        <div className="banner-categories-list">
            {data.categories && data.categories.map((cat, idx) => (
                <div key={idx} className="category-section">
                    <div className="category-header">
                        <h4>{cat.name}</h4>
                        {cat.chance && <span className="cat-chance">{cat.chance}</span>}
                    </div>
                <div className="category-grid">
                    {cat.characters && cat.characters.map(char=> (
                        <InteractiveChar
                            key={char.id}
                            id={char.id}
                            type={char.type}
                            url={char.info_url}
                            className={`character-card small ${isOwned(char.id) ? '' : 'missing'}`}
                            title={char.name}
                        >
                            <img src={getImageUrl(`${char.image_url}.png`)} alt={char.name} loading="lazy"/>
                        </InteractiveChar>
                    ))}
                </div>
            </div>
            ))}
        </div>
    );

}

export default BannerCharacters;