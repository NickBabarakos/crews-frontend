import React from "react";
import DashboardCard from "./DashboardCard";
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
                    <div
                        key={unit.id}
                        className="unit-icon-wrapper"
                        style={{width: '100%', aspectRatio: '1/1', cursor: 'pointer', position: 'relative'}}
                        onClick={()=> unit.info_url && window.open(unit.info_url, '_blank')}
                        onContextMenu={(e)=> {
                            e.preventDefault();
                            unit.info_url && window.open(unit.info_url, '_blank');
                        }}
                    >
                        <img 
                            src={getImageUrl(`${unit.image_url}.png`)}
                            alt={unit.name}
                            loading="lazy"
                            style={{width: '100%', height: '100%', pointerEvents: 'none', display: 'block'}}
                        />
                    </div>
                ))}
            </div>

        </DashboardCard>
    );

};

export default NewArrivalsWidger;