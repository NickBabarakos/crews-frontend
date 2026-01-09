import { useMemo } from "react";

/**
 * CONFIG HYDRATOR
 * ---------------
 * Takes the static ViewConfig and injects 'Live' data (Event Names) into it.
 * 
 * @param {object} config - The static config from ViewConfig. 
 * @param {object} eventNames  - Dictionary of { id: "Name" } fetched from API.
 */

export const useDynamicConfig = (config, eventNames ) =>{
    return useMemo(()=> {
        //Αν δεν υπάρχει config ή eventNames, επιστρέφουμε το αρχικο
        if(!config || Object.keys(eventNames).length === 0) return config;

            //Διατηρουμε deep copy των dropdowns για να μην πειραξουμε το original config
            const newConfig = {...config, dropdowns: config.dropdowns.map(d=> ({...d}))};

            //1. Logic για PKA
            if(config.mode === 'pirate_king_adventures'){
                const bossFilter = newConfig.dropdowns.find(d => d.id === 'bosses');
                if(bossFilter){
                    const dynamicOptions = [];
                    if(eventNames[281]) dynamicOptions.push(eventNames[281]);
                    if(eventNames[284]) dynamicOptions.push(eventNames[284]);
                    if(eventNames[287]) dynamicOptions.push(eventNames[287]);

                    if(dynamicOptions.length >0) bossFilter.options = dynamicOptions;
                }
            }
            
            //2. Logic για TM
            if(config.mode === 'treasure_map'){
                const tmFilter = newConfig.dropdowns.find(d=> d.id === 'boss');
                if(tmFilter ) {
                    const dynamicOptions = [];
                    if(eventNames[290]) dynamicOptions.push(eventNames[290]);
                    if(eventNames[291]) dynamicOptions.push(eventNames[291]);

                    if(dynamicOptions.length>0) tmFilter.options = dynamicOptions;
                }
            }

            //3. Logic για Kizuna
            if(config.mode === 'kizuna_clash'){
                const kizunaFilter = newConfig.dropdowns.find(d => d.id === 'boss');
                if(kizunaFilter) {
                    const options = [eventNames[292], eventNames[293]];
                    if(eventNames[294] && eventNames[294].toLowerCase() !== 'no'){
                        options.push(eventNames[294], eventNames[295]);
                    }
                    kizunaFilter.options = options;
                }
            }
    
            return newConfig;
        }, [config, eventNames]);
};