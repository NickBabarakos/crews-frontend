import React from "react";
import DashboardCard from "./DashboardCard";
import InteractiveChar from "../../../components/common/InteractiveChar";
import { StarIcon } from "../../../components/Icons";
import { getImageUrl } from "../../../utils/imageUtils";



const NewArrivalsWidger = ({units = []}) =>{
    return(
        <DashboardCard 
            title="New Arrivals"
            icon={<StarIcon/>}
            scrollable={false}
        >
            <div className="units-grid">
                {units.map(unit => (
                    <InteractiveChar
                        key={unit.id}
                        id={unit.id}
                        type={unit.type}
                        className="unit-icon-wrapper"
                        style={{width: '100%', aspectRatio: '1/1'}}
                    >
                        <img src={getImageUrl(`${unit.image_url}.png`)} alt={unit.name} loading="lazy" />
                    </InteractiveChar>
                ))}
            </div>

        </DashboardCard>
    );

};

export default NewArrivalsWidger;