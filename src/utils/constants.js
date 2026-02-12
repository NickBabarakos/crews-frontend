/**
 * APP CONSTANTS & CONFIGURATION
 * -----------------------------
 * Acts as the "Source of Truth" for character categorizations.
 * 
 * Purpose:
 * 1. Maps UI dropdown labels to Database values.
 * 2. Defines arrays for Bulk Filtering (e.g. "All Legends").
 * 3. Ensures consistency accross Toolbar, Context and Hooks.
 */
export const ALL_LEGEND_TYPES = [
  'Super Sugo-Fest Only', 'Anniversary', 'Pirate Rumble Sugo-Fest Only', 'Treasure Sugo-Fest Only', 
  'Pirate Alliance Kizuna Clash Sugo-Fest Only', 'Exchange Only', 'Sugo Rare'
];
export const ALL_RR_TYPES = [
  'Rare Recruit', 'Treasure Map Rare Recruit', 'Treasure Map Limited Character', 'Kizuna Clash Limited Character',
  'Rumble Rare Recruit', 'Support Character'
];

export const RR_MAPPING = {
  'Treasure Map Rare Recruits': 'Treasure Map Rare Recruit',
  'Treasure Map Limited Characters': 'Treasure Map Limited Character',
  'Kizuna Clash Limited Characters': 'Kizuna Clash Limited Character',
  'Rumble Rare Recruits': 'Rumble Rare Recruit',
  'Support Characters': 'Support Character',
  'Other Rare Recruits': 'Rare Recruit'
};

export const LEGEND_OPTIONS = [
    'All Legends', 'Super Sugo-Fest Only', 'Anniversary', 'Pirate Rumble Sugo-Fest Only', 'Treasure Sugo-Fest Only', 
    'Pirate Alliance Kizuna Clash Sugo-Fest Only', 'Exchange Only', 'Sugo Rare'
];

export const RR_OPTIONS = [
    'All Rare Recruits', 'Treasure Map Rare Recruits', 'Treasure Map Limited Characters', 'Kizuna Clash Limited Characters',
    'Rumble Rare Recruits', 'Support Characters', 'Other Rare Recruits'
];