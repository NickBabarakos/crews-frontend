/**
 * =================================
 * VIEW CONFIGURATION MAP (SCHEMA)
 * =================================
 * 
 * Defines the behavior of the CrewPage for each Game Mode.
 * Acts as the "brain" for rendering Filters (dropdowns) and mapping context data.
 * 
 * STRUCTURE:
 * - Keys: View Identifiers (used in URL/Router, e.g. 'grandVoyage')
 * - Values: Configuration Objects
 *      @property {string} mode - The Backend API identifier for this mode
 *      @property {function} contextMapper - Transforms API response data into UI-friendly format
 *      @property {Array} dropdowns - Defines the Filter UI filters (Static or Dependent)
 */

const viewConfig = {
    grandVoyage: {
        mode: 'grand_voyage',
        contextMapper: (data) => ({
            stage: data.stage_name,
            level: (data.level && !String(data.level).startsWith('Level'))
                ? `Level ${data.level}`
                : data.level
        }),
        dropdowns: [
            {
                id: 'stage',
                placeholder: 'Select Stage',
                options: [
                    'vs Local Sea Monster', 'vs Iron-Mace Alvida', 'vs Axe-Hand Morgan', 'vs Buggy the Clown',
                    'vs (O.T)Monkey D. Luffy', 'vs Captain Kuro', 'vs Don Krieg', 'vs Hawk Eyes Mihawk', 
                    'vs Roronoa Zoro', 'vs Arlong', 'vs (A.P.)Monkey D. Luffy', 'vs (INT)Smoker', 'vs (L)Monkey D. Luffy',
                    'vs Miss Wednesday', 'vs Mr.5', 'vs Mr.3', 'vs Wapol', 'vs (DEX)Smoker', 'vs Miss Doublefinger'
                ]
            }, 
            {
                id: 'level',
                placeholder: 'Level',
                options: ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5']
            }
        ]
    }, 

    garpsChallenge: {
        mode: 'garp_challenge',
        contextMapper: (data) => ({
            challengeType: data.stage_name,
            challengeDetail: data.level
        }),
        dropdowns: [
            {
                id: 'challengeType',
                placeholder: 'Select Challenge',
                options: [
                    'Numbered Challenges', 'Heavenly Demon', 'Revolutionary Army', 'Whitebeard', 'Eneru', 'Navy', 'Hody', 'Worst Generation'
                ]
            },
            {
                id: 'challengeDetail',
                placeholder: 'Select Detail',
                dependentOn: 'challengeType',
                optionsMap: {
                    'Numbered Challenges': [
                        "Garp's Challenge 10", "Garp's Challenge 11", "Garp's Challenge 12", "Garp's Challenge 13",
                        "Garp's Challenge 14", "Garp's Challenge 15" 
                    ], 
                    'Heavenly Demon': [
                        'Heavenly Demon 1', 'Heavenly Demon (STR)', 'Heavenly Demon (DEX)', 'Heavenly Demon (QCK)',
                        'Heavenly Demon (INT)', 'Heavenly Demon (PSY)', 'Heavenly Demon 2'
                    ], 
                    'Revolutionary Army': [
                        'Revolutionary Army 1', 'Revolutionary Army (STR)', 'Revolutionary Army (DEX)', 'Revolutionary Army (QCK)',
                        'Revolutionary Army (INT)', 'Revolutionary Army (PSY)', 'Revolutionary Army 2'
                    ],
                    'Whitebeard': [
                        'Whitebeard', 'Whitebeard (STR)', 'Whitebeard (DEX)', 'Whitebeard (QCK)', 'Whitebeard (INT)', 'Whitebeard (PSY)'
                    ],
                    'Eneru': ['Eneru', 'Eneru (STR)', 'Eneru (DEX)', 'Eneru (QCK)', 'Eneru (INT)', 'Eneru (PSY)'],
                    'Navy': ['Navy', 'Navy (STR)', 'Navy (DEX)' , 'Navy (QCK)', 'Navy (INT)', 'Navy (PSY)'],
                    'Hody': ['Hody', 'Hody (STR)', 'Hody (DEX)' , 'Hody (QCK)', 'Hody (INT)', 'Hody (PSY)'],
                    'Worst Generation': [
                        'Worst Generation', 'Worst Generation (STR)', 'Worst Generation (DEX)', 'Worst Generation (QCK)',
                        'Worst Generation (INT)', 'Worst Generation (PSY)'
                    ]

                }
            }
        ]
    }, 

    forestOfTraining: {
        mode:'forest_of_training',
        contextMapper: (data) => ({forest: data.stage_name}),
        dropdowns: [
            {
                id: 'forest',
                placeholder: 'Select Forest',
                options: [
                    'Hawk', 'Flame Fist', 'Kami', 'Sun', 'Beard', 'Pheasant', 'Snake', 'Red Hair',
                    'Heavenly Demon', 'ROOM', 'Monkey', 'Darkness', 'Gang', 'Mama', 'Straw', 'Magnetic'
                ]
            }
        ]
    },
    coliseum: {
        mode: 'coliseum',
        contextMapper: (data) => ({level: data.level}),
        dropdowns: [
            {
                id: 'level',
                placeholder: 'Category',
                options: ['Clash!! (Hard)', 'Coliseum Chaos', 'Event', 'Arena']
            }
        ]
    },
    pirateKingAdventures: {
        mode: 'pirate_king_adventures',
        contextMapper: (data) => ({bosses: data.stage_name, level: data.level}),
        dropdowns: [
            {
                id: 'bosses',
                placeholder: 'Bosses',
                options: [
                    'vs. Dorry & Broggy (Hex)', 'vs. Pudding (Hex)', 'vs. Kid (Boss)'
                ]
            },
            {
                id: 'level',
                placeholder: 'Level',
                options: [ 'Level 80-99', 'Level 100-149', 'Level 150+']
            }
        ]
    },
    treasureMap: {
        mode: 'treasure_map',
        contextMapper: (data) => ({boss: data.stage_name}),
        dropdowns: [
            {
                id: 'boss',
                placeholder: 'Select Boss',
                options: ['Placeholder (Boss)', 'vs. Kid (Intrusion)']
            }
        ]
    }, 

    kizunaClash: {
        mode: 'kizuna_clash',
        contextMapper: (data) => ({ boss: data.stage_name}),
        dropdowns: [
            {
                id: 'boss',
                placeholder: 'Select Boss',
                options: ['Boss(DEX)', 'Boss(INT)', 'Super Boss(STR)', 'Super Boss(INT)'] 
            }
        ]
    }
};

export default viewConfig;


/**
 * =======================================
 * DATA STRUCTURE DOCUMENTATION (SCHEMA)
 * =======================================
 * 
 * This object serves as "Blueprint" for dynamic UI generation.
 * CrewsPage.js consumes this data to render filters and configure API requests.
 * 
 * DATA HIREARCHY:
 * -----------------------------------------
 * 1. ROOT LEVEL (Map/Dictionary):
 *    -Keys: View Identifiers (e.g 'grandVoyage', 'garpsChallenge')
 *    -Values: Configuration Objects.
 * 
 * 2. CONFIF LEVEL (Properties):
 *    - mode (String): The identifier key sent to the Backend API.
 *    - dropdowns (Array<Object>): An array defining the order and type of UI filters
 * 
 * 3. DROPDOWN DEFINITION (Level 3):
 * Each object within the `dropdowns` array fall into one of two categories:
 * 
 * TYPE A: Static Dropdown
 * ------------------------------------
 * - id(String): The parameter name used in the API call (query param)
 * - placeholder(String): Label text for the UI.
 * - options (Array<String>): A static list of available choices
 * 
 * TYPE B: Dependent Dropdown (Cascading):
 * ---------------------------------------
 * - id (String): The parameter name used in the API call. 
 * - placeholder (String): Label text for the UI.
 * - dependentOn: The 'id' of the parent filter this dropdown reiles on.
 * - optionsMap (Object): A Key-Value Map where:
 *      > Key: The selected value of the parent dropdown.
 *      > Value: Array<String> containing the available choices for that specific parent value. 
 */