
import { getImageUrl } from "../../utils/imageUtils";

const GIMMICK_FILES = {
    'atk_down': 'gimmicks/atk-down.png',
    'enrage': 'gimmicks/enrage.png',
    'nnad': 'gimmicks/NNAD.png',
    'chain_growth_down': 'gimmicks/chain-growth-down.png',
    'def_up': 'gimmicks/increased-defense.png',
    'resilience': 'gimmicks/resilience.png',
    'immunity_defeat': 'gimmicks/immunity-instant-defeat.png',
    'immunity_status': 'gimmicks/immunity-status-effects.png',
    'immunity_poison': 'gimmicks/immunity-poison.png',
    'immunity_delay': 'gimmicks/immunity-delay.png',
    'intimidation': 'gimmicks/intimidation.png',
    'burn': 'gimmicks/burn.png',
    'super_burn': 'gimmicks/super-burn.png',
    'special_limit': 'gimmicks/special-limit.png',
    'immunity': 'gimmicks/immunity.png',
    'pain': 'gimmicks/pain.png',
    'threshold': 'gimmicks/threshold.png',
    'percentage_damage_resistance': 'gimmicks/percentage-damage-resistance.png',
    'end_of_turn_damage': 'gimmicks/end-of-turn-damage.png',
    'lock_target': 'gimmicks/lock-target.png',
    'delay_immunity': 'gimmicks/immunity-delay.png',
    'percentage_reduction': 'gimmicks/percentage-reduction.png',
    'hunger': 'gimmicks/hunger.png',
    'limited_taps': 'gimmicks/limited-taps.png',
    'chain_atk_down': 'gimmicks/chain-atk-down.png',
    'damage_nullification': 'gimmicks/damage-nullification.png',
    'slot_damage': 'gimmicks/slot-damage-reduction.png',
    'chain_boundary': 'gimmicks/chain-boundry-atk-down.png',
    'chain_damage_down': 'gimmicks/chain-damage-down.png',
    'poison': 'gimmicks/poison.png',
    'toxic': 'gimmicks/toxic.png',
    'increased_damage_taken': 'gimmicks/increased-damage-taken.png',
    'special_charge': 'gimmicks/special-charge.png',
    'special_reverse': 'gimmicks/special-reverse.png',
    'special_bind': 'gimmicks/special-bind.png',
    'no_healing': 'gimmicks/no-healing.png',
    'heal_to_damage': 'gimmicks/heal-to-damage.png',
    'rcv_to_damage': 'gimmicks/rcv-to-damage.png',
    'hit_barrier': 'gimmicks/combo-barrier-hit.png',
    'perfect_barrier': 'gimmicks/combo-barrier-perfect.png',
    'great_barrier': 'gimmicks/combo-barrier-great.png',
    'good_barrier': 'gimmicks/combo-barrier-good.png',
    'harder_tap_timing': 'gimmicks/harder-tap-timing.png',
    'chain_upper_limit': 'gimmicks/chain-upper-limit.png',
    'rainbow_barrier': 'gimmicks/combo-barrier-rainbow.png',
    'wano_barrier' : 'gimmicks/combo-barrier-wano.png',
    'nullify_potential_abilities': 'gimmicks/nullify-potential-abilities.png',
    'silence':'gimmicks/silence.png',
    'enemy_territory': 'gimmicks/enemy-territory.png',
    'default': null
};

export const getIcon = (key) => {
    const filePath = GIMMICK_FILES[key];
    return filePath ? getImageUrl(filePath) : null;
};


export const GROUP_CONFIG = {
    interruption: {title: 'Interruption', className: 'interruption'},
    defeated: {title: 'On Defeat', className: 'defeated'},
    starting: {title: 'Starting State', className: 'starting'},
    preemptive: {title: 'Preemptive', className: 'preemptive'},
    group: {title: 'Group', className: 'group'}
};

export const getGroupConfig =(type) => GROUP_CONFIG[type];

export const DYNAMIC_STAGE_IDS = [281, 284, 287, 290, 291, 292, 293, 294, 295];

export const isDynamicStage = (stageId) => DYNAMIC_STAGE_IDS.includes(Number(stageId));

export const getFormattedStageName = (stageId, baseName) => {
    const id = Number(stageId);
    let finalName = baseName;

    if([281, 284].includes(id)) finalName += " (HEX)";
    else if([290,287].includes(id)) finalName += " (Boss)";
    else if (id === 291) finalName += " (Intrusion)";

    return finalName;
};