
import atkDownIcon from '../../assets/gimmicks/atk-down.png';
import enrageIcon from '../../assets/gimmicks/enrage.png';
import nnadIcon from '../../assets/gimmicks/NNAD.png';
import chainGrowthDownIcon from '../../assets/gimmicks/chain-growth-down.png';
import defUpIcon from '../../assets/gimmicks/increased-defense.png';
import resilienceIcon from '../../assets/gimmicks/resilience.png';
import immunityDefeatIcon from '../../assets/gimmicks/immunity-instant-defeat.png';
import immunityStatusIcon from '../../assets/gimmicks/immunity-status-effects.png';
import immunityPoisonIcon from '../../assets/gimmicks/immunity-poison.png';
import immunityDelayIcon from '../../assets/gimmicks/immunity-delay.png';
import intimidationIcon from '../../assets/gimmicks/intimidation.png';
import burnIcon from '../../assets/gimmicks/burn.png';
import specialLimitIcon from '../../assets/gimmicks/special-limit.png';
import immunityIcon from '../../assets/gimmicks/immunity.png';
import painIcon from '../../assets/gimmicks/pain.png';
import thresholdIcon from '../../assets/gimmicks/threshold.png';
import percentageDamageResistanceIcon from '../../assets/gimmicks/percentage-damage-resistance.png';
import endOfTurnDamageIcon from '../../assets/gimmicks/end-of-turn-damage.png';
import lockTargetIcon from '../../assets/gimmicks/lock-target.png';
import delayImmunityIcon from '../../assets/gimmicks/immunity-delay.png';
import percentageReductionIcon from '../../assets/gimmicks/percentage-reduction.png';
import hungerIcon from '../../assets/gimmicks/hunger.png';
import limitedTapsIcon from '../../assets/gimmicks/limited-taps.png';
import chainAtkDownIcon from '../../assets/gimmicks/chain-atk-down.png';
import damageNullificationIcon from '../../assets/gimmicks/damage-nullification.png';
import slotDamageReductionIcon from '../../assets/gimmicks/slot-damage-reduction.png';
import chainBoundaryAtkDownIcon from '../../assets/gimmicks/chain-boundry-atk-down.png';
import poisonIcon from '../../assets/gimmicks/poison.png';
import toxicIcon from '../../assets/gimmicks/toxic.png';
import increasedDamageTakenIcon from '../../assets/gimmicks/increased-damage-taken.png';
import specialChargeIcon from '../../assets/gimmicks/special-charge.png';
import specialReverseIcon from '../../assets/gimmicks/special-reverse.png';
import specialBindIcon from '../../assets/gimmicks/special-bind.png';
import noHealingIcon from '../../assets/gimmicks/no-healing.png';
import hitBarrierIcon from '../../assets/gimmicks/combo-barrier-hit.png';
import perfectBarrierIcon from '../../assets/gimmicks/combo-barrier-perfect.png';
import greatBarrierIcon from '../../assets/gimmicks/combo-barrier-great.png';
import goodBarrierIcon from '../../assets/gimmicks/combo-barrier-good.png';
import harderTapTimingIcon from '../../assets/gimmicks/harder-tap-timing.png';

export const ICON_MAP ={
    'atk_down': atkDownIcon,
    'enrage': enrageIcon,
    'nnad' : nnadIcon,
    'chain_growth_down': chainGrowthDownIcon,
    'def_up': defUpIcon,
    'resilience' : resilienceIcon,
    'immunity_defeat': immunityDefeatIcon,
    'immunity_status': immunityStatusIcon,
    'immunity_poison': immunityPoisonIcon,
    'immunity_delay': immunityDelayIcon,
    'intimidation': intimidationIcon,
    'burn': burnIcon,
    'special_limit': specialLimitIcon,
    'immunity':immunityIcon,
    'pain': painIcon,
    'threshold': thresholdIcon,
    'percentage_damage_resistance' : percentageDamageResistanceIcon,
    'end_of_turn_damage': endOfTurnDamageIcon,
    'lock_target': lockTargetIcon,
    'delay_immunity': delayImmunityIcon,
    'percentage_reduction' : percentageReductionIcon,
    'hunger': hungerIcon,
    'limited_taps': limitedTapsIcon,
    'chain_atk_down': chainAtkDownIcon,
    'damage_nullification': damageNullificationIcon,
    'slot_damage': slotDamageReductionIcon,
    'chain_boundary': chainBoundaryAtkDownIcon,
    'poison': poisonIcon,
    'toxic': toxicIcon,
    'increased_damage_taken': increasedDamageTakenIcon,
    'special_charge' : specialChargeIcon,
    'special_reverse': specialReverseIcon,
    'special_bind' : specialBindIcon,
    'no_healing': noHealingIcon,
    'hit_barrier': hitBarrierIcon,
    'perfect_barrier': perfectBarrierIcon,
    'great_barrier': greatBarrierIcon,
    'good_barrier': goodBarrierIcon,
    'harder_tap_timing': harderTapTimingIcon,
    'default': null
};

export const GROUP_CONFIG = {
    interruption: {title: 'Interruption', className: 'interruption'},
    defeated: {title: 'On Defeat', className: 'defeated'},
    starting: {title: 'Starting State', className: 'starting'},
    preemptive: {title: 'Preemptive', className: 'preemptive'},
    group: {title: 'Group', className: 'group'}
};

export const getIcon = (key) => ICON_MAP[key] || ICON_MAP['default'];
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