const viewConfig = {
    grandVoyage: {
        mode: 'grand_voyage',
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
                placeholeder: 'Level',
                options: [ 'Level 80-99', 'Level 100-149', 'Level 150+']
            }
        ]
    },
    treasureMap: {
        mode: 'treasure_map',
        dropdowns: [
            {
                id: 'boss',
                placeholder: 'Select Boss',
                options: ['vs. Big Mum(Boss)', 'vs. Kid(Intrusion)']
            }
        ]
    }, 

    kizunaClash: {
        mode: 'kizuna_clash',
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