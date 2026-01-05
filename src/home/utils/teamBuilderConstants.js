export const CREW_LAYOUT = [
    { mainId: 'Friend Captain', label: 'Friend Captain', hasSupport: false},
    { mainId: 'Captain', label: 'Captain', hasSupport: true, supportId: 'Support Captain'},
    { mainId: 'Crewmate4', label: 'Crewmate 4', hasSupport: true, supportId: 'Support4'},
    { mainId: 'Crewmate1', label: 'Crewmate 1', hasSupport: true, supportId: 'Support1'},
    { mainId: 'Crewmate3', label: 'Crewmate 3', hasSupport: true, supportId: 'Support3'},
    { mainId: 'Crewmate2', label: 'Crewmate 2', hasSupport: true, supportId: 'Support2'}
];


export const INITIAL_SLOT_STATE = {
    'Friend Captain': null,
    'Captain': null,
    'Support Captain': null,
    'Crewmate1': null, 'Support1': null,
    'Crewmate2': null, 'Support2': null,
    'Crewmate3': null, 'Support3': null,
    'Crewmate4': null, 'Support4': null
};