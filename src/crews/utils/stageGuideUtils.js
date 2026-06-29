
import { getImageUrl } from "../../utils/imageUtils";

const GIMMICK_FILES = {
    //Buffs
    'atk_up' : 'gimmicks/atk-up.png',
    'base_atk_up' : 'gimmicks/base-atk-up.png',
    'bypass_damage_reducing_effects' : 'bypass-damage-reducing-effects.png',
    'color_affinity' : 'gimmicks/color-affinity.png',
    'end_of_turn_healing': 'gimmicks/end-of-turn-healing.png',
    'slot_effect': 'gimmicks/slot.png',
    'special_charge': 'gimmicks/special-charge.png',
    'status_atk_up_burn' : 'gimmicks/status-atk-up-burn.png',
    'status_atk_up_def_down' : 'gimmicks/status-atk-up-def-down.png',
    'status_atk_up_delay' : 'gimmicks/status-atk-up-delay.png',
    'status_atk_up_increase_dmg' : 'gimmicks/status-atk-up-increase-dmg.png',
    'status_atk_up_poison' : 'gimmicks/status-atk-up-poison.png',
    'stock_damage_healing' : 'gimmicks/stock-damage-healing.png',
    'weakness_fighter' : 'gimmicks/fighter-weakness.png',
    'weakness_slasher' : 'gimmicks/slasher-weakness.png',
    'weakness_striker' : 'gimmicks/striker-weakness.png',
    'weakness_shooter' : 'gimmicks/shooter-weakness.png',
    'weakness_free_spirit' : 'gimmicks/free-spirit-weakness.png',
    'weakness_driven' : 'gimmicks/driven-weakness.png',
    'weakness_cerebral' : 'gimmicks/cerebral-weakness.png',
    'weakness_powerhouse' : 'gimmicks/powerhouse-weakness.png',

    //Gimmicks
    'atk_down': 'gimmicks/atk-down.png',
    'barrier_hit': 'gimmicks/combo-barrier-hit.png',
    'barrier_perfect': 'gimmicks/combo-barrier-perfect.png',
    'barrier_great': 'gimmicks/combo-barrier-great.png',
    'barrier_good': 'gimmicks/combo-barrier-good.png',
    'barrier_rainbow': 'gimmicks/combo-barrier-rainbow.png',
    'barrier_wano' : 'gimmicks/combo-barrier-wano.png',
    'barrier_bomb': 'gimmicks/combo-barrier-bomb.png',
    'barrier_rcv' : 'gimmicks/combo-barrier-rcv.png',
    'barrier_tnd' : 'gimmicks/combo-barrier-tnd.png',
    'barrier_str' : 'gimmicks/combo-barrier-str.png',
    'barrier_dex' : 'gimmicks/combo-barrier-dex.png',
    'barrier_qck' : 'gimmicks/combo-barrier-qck.png',
    'barrier_int' : 'gimmicks/combo-barrier-int.png',
    'barrier_psy' : 'gimmicks/combo-barrier-psy.png',
    'barrier_g'   : 'gimmicks/combo-barrier-g.png',
    'blind': 'gimmicks/blind.png',
    'blow_away' : 'gimmicks/blow-away.png',
    'burn': 'gimmicks/burn.png',
    'captain_swap': 'gimmicks/captain-change.png',
    'chain_atk_down': 'gimmicks/chain-atk-down.png',
    'chain_boundary': 'gimmicks/chain-boundry-atk-down.png',
    'chain_damage_down': 'gimmicks/chain-damage-down.png',
    'chain_growth_down': 'gimmicks/chain-growth-down.png',
    'chain_upper_limit': 'gimmicks/chain-upper-limit.png',
    'damage_limit': 'gimmicks/damage_limit.png',
    'damage_nullification': 'gimmicks/damage-nullification.png',
    'def_up': 'gimmicks/increased-defense.png',
    'enemy_territory': 'gimmicks/enemy-territory.png',
    'end_of_turn_damage': 'gimmicks/end-of-turn-damage.png',
    'enrage': 'gimmicks/enrage.png',
    'harder_tap_timing': 'gimmicks/harder-tap-timing.png',
    'heal_to_damage': 'gimmicks/heal-to-damage.png',
    'hunger': 'gimmicks/hunger.png',
    'intimidation': 'gimmicks/intimidation.png',
    'limited_taps': 'gimmicks/limited-taps.png',
    'lock_target': 'gimmicks/lock-target.png',
    'no_healing': 'gimmicks/no-healing.png',
    'no_color_affinity': 'gimmicks/no-affinity.png',
    'nullify_potential_abilities': 'gimmicks/nullify-potential-abilities.png',
    'pain': 'gimmicks/pain.png',
    'percentage_reduction': 'gimmicks/percentage-reduction.png',
    'poison': 'gimmicks/poison.png',
    'rcv_to_damage': 'gimmicks/rcv-to-damage.png',
    'resilience': 'gimmicks/resilience.png',
    'silence':'gimmicks/silence.png',
    'slot_damage_reduction': 'gimmicks/slot-damage-reduction.png',
    'special_bind': 'gimmicks/special-bind.png',
    'special_limit': 'gimmicks/special-limit.png',
    'special_reverse': 'gimmicks/special-reverse.png',
    'super_burn': 'gimmicks/super-burn.png',
    'stun' : 'gimmicks/stun.png',
    'threshold': 'gimmicks/threshold.png',
    'toxic': 'gimmicks/toxic.png',

    //Immunities
    'immunity': 'gimmicks/immunity.png',
    'immunity_defeat': 'gimmicks/immunity-instant-defeat.png',
    'immunity_def_down': 'gimmicks/immunity-increased-defense-down.png',
    'immunity_delay': 'gimmicks/immunity-delay.png',
    'immunity_poison': 'gimmicks/immunity-poison.png',
    'immunity_progressive_poison': 'gimmicks/immunity-toxic.png',
    'immunity_status': 'gimmicks/immunity-status-effects.png',
    'immunity_venom': 'gimmicks/immunity-strong-poison.png',
    'nnad': 'gimmicks/NNAD.png',
    'percentage_damage_resistance': 'gimmicks/percentage-damage-resistance.png',

    //Enemy Debuff icons
    'increased_damage_taken': 'gimmicks/increased-damage-taken.png',

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