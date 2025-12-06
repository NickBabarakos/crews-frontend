import React from 'react';

import atkDownIcon from './assets/gimmicks/atk-down.png';
import nnadIcon from './assets/gimmicks/NNAD.png';
import chainGrowthIcon from './assets/gimmicks/chain-growth-down.png';
import defUpIcon from './assets/gimmicks/increased-defense.png';
import resilienceIcon from './assets/gimmicks/resilience.png';
import immunityDefeatIcon from './assets/gimmicks/immunity-instant-defeat.png';
import immunityStatusIcon from './assets/gimmicks/immunity-status-effects.png';
import burnIcon from './assets/gimmicks/burn.png';
import specialLimitIcon from './assets/gimmicks/special-limit.png';
import immunityIcon from './assets/gimmicks/immunity.png';
import painIcon from './assets/gimmicks/pain.png';
import thresholdIcon from './assets/gimmicks/threshold.png';
import percentageDamageResistanceIcon from './assets/gimmicks/percentage-damage-resistance.png';
import endOfTurnDamageIcon from './assets/gimmicks/end-of-turn-damage.png';
import lockTargetIcon from './assets/gimmicks/lock-target.png';
import delayImmunitIcon from './assets/gimmicks/delay-immunity.png';
import percentageReductionIcon from './assets/gimmicks/percentage-reduction.png';
import hungerIcon from './assets/gimmicks/hunger.png';
import limitedTapsIcon from './assets/gimmicks/limited-taps.png';
import chainAtkDownIcon from './assets/gimmicks/chain-atk-down.png';


const formatText = (template, params = [], turns) =>{
    let text = template;
    if(params && params.length > 0){
        params.forEach((param, index) => {
            text = text.replace(`{$${index+1}}`,param);
        });
    }
    if(turns) {
        text = text.replace('{turns}', turns);
    }
    return text;
};

const defaultIcon = null;

export const GIMMICK_DICT = {
    'atk_down': {
        template: "ATK {$1}% Down: {turns} turn(s)",
        icon: atkDownIcon,
        color: "bg-red-900"
    },
    'non_normal_attacks_damage': {
        template: "Non-Normal Attacks deal 1 damage: {turns} turn(s) ",
        icon: nnadIcon,
        color: "bg-purple-900"
    },
    'chain_growth_down': {
        template: "Chain Multiplier Growth Rate x{$1}: {turns} turn(s)",
        icon: chainGrowthIcon,
        color: "bg-red-900"
    },
    'chain_atk_down': {
        template: 'If chain multiplier is {$1} or less. {$2} ATK Down: {turns} turn(s)',
        icon: chainAtkDownIcon,
        color: "bg-red-900"
    },
    'increased_defense': {
        template: 'DEF x{$1}: {turns} turn(s)',
        icon: defUpIcon,
        color: "bg-red-900"
    }, 
    'resilience': {
        template: "Resilience: {turns} turn(s)",
        icon: resilienceIcon,
        color: "bg-red-900"
    },
    'immunity_instant_defeat': {
        template: "Immune to instant defeat Specials: {turns} turn(s)",
        icon: immunityDefeatIcon,
        color: "bg-purple-900"
    },
    'immunity_status_effects': {
        template: "Status Effect Immunity ({$1}): {turns} turn(s)",
        icon: immunityStatusIcon,
        color: "bg-purple-900"
    },
    'immunity_full': {
        template: "Immunity: {turns} turn(s)",
        icon: immunityIcon,
        color: "bg-purple-900"
    },
    'pain': {
        template: "{$1} damage after every action besides normal taps: {turns} turn(s)",
        icon: painIcon,
        color: "bg-red-900"
    },
    'burn': {
        template: "Burn ({$1} damage): {turns} turn(s)",
        icon: burnIcon,
        color: "bg-red-900"
    },
    'special_limit': {
        template: "Special Use Limit ({$1} time(s)): {turns} turn(s)",
        icon: specialLimitIcon,
        color: "bg-red-900"
    },
    'threshold': {
        template: "Threshold (over {$1}, {$2}% reduction): {turns} turn(s)",
        icon: thresholdIcon,
        color: "bg-red-900"
    },
    'percentage_damage_resistance': {
        template: 'Percentage damage resistance {$1}',
        icon: percentageDamageResistanceIcon,
        color: "bg-purple-900"
    },
    'end_of_turn_damage': {
        template: "{$1} damage at end of turn: {turns} turn(s)",
        icon: endOfTurnDamageIcon,
        color: "bg-red-900"
    },
    'lock_target': {
        template: "Lock Target: {turns} turn(s)",
        icon: lockTargetIcon,
        color: "bg-red-900"
    },
    'delay_immunity': {
        template: "Delay Immunity: {turns} turn(s)",
        icon: delayImmunitIcon,
        color: "bg-purple-900"
    },
    'percentage_reduction': {
        template: "Reduce damage taken {$1}%: {turns} turn(s)",
        icon: percentageReductionIcon,
        color: "bg-red-900"
    },
    'hunger':{
        template: 'Until using {$1} slots, Reduce current HP by {$2} each turn. ATK {$3} Down',
        icon: hungerIcon,
        color: "bg-red-900"
    },
    'limited_tap':{
        template: 'Limited Taps {$1} time(s): {turns} turn(s)',
        icon: limitedTapsIcon,
        color: "bg-red-900"
    },
    'reduce_special_charge': {
        template: "{$1}: Reduce Special Charge by {turns} turns",
        icon: null,
        color: "bg-green-900"
    },
    'retreat': {
        template: "Retreat",
        icon: null,
        color: "bg-gray-800"
    },
    'slot_change': {
        template: "{$1} slots to {$2} slots{$3}",
        icon: null,
        color: "bg-red-900"
    },
    'special_reverse':{
        template: "Special Reverse {$1}: {turns} turn(s)",
        icon: null,
        color: "bg-red-900"
    },
    'special_bind' :{
        template: "Special Bind {$1}: {turns} turn(s)",
        icon: null,
        color: "bg-red-900"
    },
    'bind': {
        template: "Bind {$1}: {turns} turn(s)",
        icon: null,
        color: "bg-red-900"
    },
    'unlimited_times': {
        template: "Unlimited number of times",
        icon: null,
        color: "bg-transparent"
    },
    'type_change': {
        template: "Change type to {$1}",
        icon: null,
        color: "bg-gray-800"
    },
    'random_slot': {
        template: "Change to a Random Slot",
        icon: null,
        color: "bg-red-900"
    },
    'lock_slots': {
        template: "Lock Slots: {turns} turn(s)",
        icon: null,
        color: "bg-red-900"
    }, 
    'weakness_class': {
        template: "Weakness Class: {$1}",
        icon: null,
        color: "bg-green-900"
    },
    'slot_bind': {
        template: "Slot Bind: {turns} turn(s)",
        icon: null,
        color: "bg-red-900"
    },
    'slot_barrier': {
        template: "Slot Barrier ({$1} Slots {$2} time(s)): {turns} turn(s)",
        icon: null,
        color: "bg-red-900"
    },
    'tap_barrier': {
        template: "Tap Timing Barrier({$1} {$2} time(s)): {turns} turn(s)",
        icon: null,
        color: "bg-red-900"
    },
    'despair': {
        template: "Despair {$1}: {turns} turn(s)",
        icon: null,
        color: "bg-red-900"
    },
    'unfavorable_slots':{
        template: "{$1} Slots Unfavorable Slots: {turns} turn(s)",
        icon: null,
        color: "bg-red-900"
    },
    'remove_beneficial_effects':{
        template: "Remove Beneficial Effects",
        icon: null,
        color: "bg-purple-900"
    }, 
    'remove_beneficial_accumulated':{
        template: "Remove Beneficial Effects/Accumulated Values",
        icon: null,
        color: "bg-purple-900"
    },
    'full_hp_recovery':{
        template: "Full HP Recovery",
        icon: null,
        color: "bg-purple-900"
    },
    'paralysis': {
        template: "Paralysis{$2}: {turns} turn(s)",
        icon: null,
        color: "bg-red-900"
    }

};

export const resolveGimmick = (row) => {
    const entry = GIMMICK_DICT[row.id];

    if(!entry) return {
        text: row.id.replace(/_/g, ''),
        icon: defaultIcon,
        color: 'bg-gray-800'
    };

    let text = formatText(entry.template, row.params, row.turns);

    if(row.target && text.includes('{target}')) {
        text= text.replace('{target}', row.target);
    } else if (row.target) {
        text += ` (${row.target})`;
    }

    if(row.condition) {
        text += `(${row.condition})`;
    }

    const iconElement = entry.icon ? (
        <img src={entry.icon} alt={row.id} className="gimmick-img" /> 
    ): defaultIcon;

    return {
        text,
        icon: iconElement,
        color: entry.color
    }
};
