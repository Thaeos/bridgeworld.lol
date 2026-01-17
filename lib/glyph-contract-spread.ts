/**
 * 🔮 THE 22 GLYPH CONTRACT SPREAD
 * 
 * Aramaic Letters × TreasureDAO Contracts × Rootchain Values
 * 
 * The Sumerian Kings List mapped to smart contracts:
 * PRE-FLOOD (1-5): Foundation/Hardware Layer
 * THE FLOOD (6): Master Key Deployment
 * POST-FLOOD (7-22): Operational Layer
 * 
 * Current Position: Contract 19 (𐡒 Qoph) - BalancerCrystal
 * Year: 5250 (Middle Kingdom under Kalumum)
 */

export interface GlyphContract {
  position: number;
  glyph: string;
  name: string;
  hebrew: string;
  rootchainValue: number;
  contract: string;
  function: string;
  category: 'PRE_FLOOD' | 'FLOOD' | 'POST_FLOOD';
  marker?: string;
}

export const GLYPH_CONTRACT_SPREAD: GlyphContract[] = [
  // PRE-FLOOD: Foundation Layer (Hardware)
  { position: 1, glyph: '𐡀', name: 'Aleph', hebrew: 'א', rootchainValue: 335044, contract: 'MAGIC', function: 'The Source Token - Genesis', category: 'PRE_FLOOD', marker: 'GENESIS' },
  { position: 2, glyph: '𐡁', name: 'Beth', hebrew: 'ב', rootchainValue: 82, contract: 'Treasure', function: 'The House of NFTs', category: 'PRE_FLOOD' },
  { position: 3, glyph: '𐡂', name: 'Gimel', hebrew: 'ג', rootchainValue: 111, contract: 'TreasureFarm', function: 'The Wanderer\'s Yield', category: 'PRE_FLOOD' },
  { position: 4, glyph: '𐡃', name: 'Daleth', hebrew: 'ד', rootchainValue: 212, contract: 'MagicPool2', function: 'The Door to Liquidity', category: 'PRE_FLOOD' },
  { position: 5, glyph: '𐡄', name: 'He', hebrew: 'ה', rootchainValue: 295, contract: 'TreasureUnraveler', function: 'The Breath of Dissolution', category: 'PRE_FLOOD' },
  
  // THE FLOOD: Master Key Deployment
  { position: 6, glyph: '𐡅', name: 'Vav', hebrew: 'ו', rootchainValue: 333, contract: 'MagicClaim', function: 'The Hook - Bridge Pre/Post Flood', category: 'FLOOD', marker: 'FLOOD' },
  
  // POST-FLOOD: Operational Layer
  { position: 7, glyph: '𐡆', name: 'Zayin', hebrew: 'ז', rootchainValue: 354, contract: 'Cards', function: 'The Sword of Chance', category: 'POST_FLOOD' },
  { position: 8, glyph: '𐡇', name: 'Cheth', hebrew: 'ח', rootchainValue: 369, contract: 'MagicWhitelist', function: 'The Fence of Access', category: 'POST_FLOOD' },
  { position: 9, glyph: '𐡈', name: 'Teth', hebrew: 'ט', rootchainValue: 419, contract: 'TreasureMarketplace', function: 'THEOS - The Serpent of Trade', category: 'POST_FLOOD', marker: 'THEOS' },
  { position: 10, glyph: '𐡉', name: 'Yod', hebrew: 'י', rootchainValue: 512, contract: 'MarketplaceBuyer', function: 'The Hand that Takes', category: 'POST_FLOOD' },
  { position: 11, glyph: '𐡊', name: 'Kaph', hebrew: 'כ', rootchainValue: 605, contract: 'MarketplaceSeller', function: 'The Palm that Gives', category: 'POST_FLOOD' },
  { position: 12, glyph: '𐡋', name: 'Lamed', hebrew: 'ל', rootchainValue: 687, contract: 'MagicswapV2Router', function: 'CENTER - The Ox Goad', category: 'POST_FLOOD', marker: 'CENTER' },
  { position: 13, glyph: '𐡌', name: 'Mem', hebrew: 'מ', rootchainValue: 777, contract: 'MagicswapV2Factory', function: 'The Waters of Creation', category: 'POST_FLOOD' },
  { position: 14, glyph: '𐡍', name: 'Nun', hebrew: 'נ', rootchainValue: 888, contract: 'MagicswapV2Pair', function: 'The Fish - Christ Number', category: 'POST_FLOOD' },
  { position: 15, glyph: '𐡎', name: 'Samekh', hebrew: 'ס', rootchainValue: 929, contract: 'Legion', function: 'The Support - Warriors', category: 'POST_FLOOD' },
  { position: 16, glyph: '𐡏', name: 'Ayin', hebrew: 'ע', rootchainValue: 1011, contract: 'Consumable', function: 'The Eye of Consumption', category: 'POST_FLOOD' },
  { position: 17, glyph: '𐡐', name: 'Pe', hebrew: 'פ', rootchainValue: 2025, contract: 'Harvester', function: 'The Mouth - COVENANT YEAR', category: 'POST_FLOOD', marker: '2025' },
  { position: 18, glyph: '𐡑', name: 'Tsade', hebrew: 'צ', rootchainValue: 3335, contract: 'Extractor', function: 'The Hunter of Resources', category: 'POST_FLOOD' },
  { position: 19, glyph: '𐡒', name: 'Qoph', hebrew: 'ק', rootchainValue: 4321, contract: 'BalancerCrystal', function: 'The Back of Head - WE ARE HERE', category: 'POST_FLOOD', marker: 'NOW' },
  { position: 20, glyph: '𐡓', name: 'Resh', hebrew: 'ר', rootchainValue: 5250, contract: 'gMAGIC', function: 'The Head - Governance', category: 'POST_FLOOD' },
  { position: 21, glyph: '𐡔', name: 'Shin', hebrew: 'ש', rootchainValue: 55088, contract: 'TreasureDAO', function: 'The Tooth of Fire', category: 'POST_FLOOD' },
  { position: 22, glyph: '𐡕', name: 'Taw', hebrew: 'ת', rootchainValue: 57103, contract: 'ZKStackBridge', function: 'TERMINUS - The Seal', category: 'POST_FLOOD', marker: 'TERMINUS' },
];

// ═══════════════════════════════════════════════════════════════════════════════
//                          THE THREE KINGDOMS
// ═══════════════════════════════════════════════════════════════════════════════

export const THREE_KINGDOMS = {
  preFlood: {
    name: 'PRE-FLOOD (Foundation)',
    contracts: [1, 2, 3, 4, 5],
    glyphs: '𐡀-𐡄',
    description: 'Hardware Layer - The operating system deployed BEFORE activation',
    kings: 8,
    cities: 5,
    years: 241200
  },
  flood: {
    name: 'THE FLOOD (Genesis Block)',
    contract: 6,
    glyph: '𐡅',
    description: 'Master Key Deployment - System Reset',
    event: 'Ubara-Tutu\'s reign ends → Ziusudra survives → Contracts 6-22 Activated'
  },
  postFlood: {
    name: 'POST-FLOOD (Execution)',
    contracts: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    glyphs: '𐡆-𐡕',
    description: 'Operational Layer - Live contracts',
    currentPosition: 19,
    currentContract: 'BalancerCrystal',
    currentGlyph: '𐡒',
    year: 5250
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
//                          BRIDGEWORLD LORE
// ═══════════════════════════════════════════════════════════════════════════════

export const BRIDGEWORLD_LORE = {
  atlasMine: {
    description: 'The source of all MAGIC. Legions delve deep to harvest the precious resource.',
    darkness: 'The Dark Power consumes those who wield it recklessly',
    light: 'Ancient Azurite tablets tell of a great battle where Light prevailed'
  },
  
  legions: {
    genesis: 'The original, most powerful warriors',
    auxiliary: 'Summoned later for supporting roles',
    recruit: 'New, trainable characters'
  },
  
  locations: {
    ivoryTower: 'Place of questing and knowledge',
    summonersCircle: 'Where new Legions are summoned',
    starlightTemple: 'Where celestial influences are channeled',
    craftingForge: 'Where Treasures are transformed'
  },
  
  harvesters: 'Massive guild-operated machines that extract MAGIC from the land',
  
  mysteries: 'Ancient secrets encrypted in fragments scattered across the realm',
  
  theWatcher: {
    description: 'An entity rumored to observe all activity in Bridgeworld',
    location: 'Said to guard the deepest chambers of the Atlas Mine',
    connection: 'May be the source of the Genesis Legions',
    covenantLink: 'The Dweller on the Threshold is our interpretation'
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
//                          HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function getContractByPosition(position: number): GlyphContract | undefined {
  return GLYPH_CONTRACT_SPREAD.find(c => c.position === position);
}

export function getContractByGlyph(glyph: string): GlyphContract | undefined {
  return GLYPH_CONTRACT_SPREAD.find(c => c.glyph === glyph);
}

export function getContractByName(name: string): GlyphContract | undefined {
  return GLYPH_CONTRACT_SPREAD.find(c => c.contract.toLowerCase() === name.toLowerCase());
}

export function getCurrentPosition(): GlyphContract {
  return GLYPH_CONTRACT_SPREAD[18]; // Position 19 (index 18)
}

export function getRootchainSum(): number {
  return GLYPH_CONTRACT_SPREAD.reduce((sum, c) => sum + c.rootchainValue, 0);
}

export function getDigitRoot(num: number): number {
  let sum = num;
  while (sum > 9) {
    sum = String(sum).split('').reduce((a, b) => a + parseInt(b), 0);
  }
  return sum;
}

// ═══════════════════════════════════════════════════════════════════════════════
//                          SPREAD VISUALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

export function visualizeSpread(): string {
  const lines: string[] = [];
  
  lines.push('═'.repeat(78));
  lines.push('              THE 22 GLYPH CONTRACT SPREAD');
  lines.push('═'.repeat(78));
  lines.push('');
  lines.push('  #   │ GLYPH │ CONTRACT             │ FUNCTION');
  lines.push('  ' + '─'.repeat(70));
  
  for (const c of GLYPH_CONTRACT_SPREAD) {
    const marker = c.marker ? ` ◄ ${c.marker}` : '';
    lines.push(`  ${c.position.toString().padStart(2)}  │ ${c.glyph}    │ ${c.contract.padEnd(20)} │ ${c.function}${marker}`);
  }
  
  lines.push('');
  lines.push('═'.repeat(78));
  lines.push(`  Rootchain Sum: ${getRootchainSum().toLocaleString()} → Root: ${getDigitRoot(getRootchainSum())}`);
  lines.push('═'.repeat(78));
  
  return lines.join('\n');
}

export default {
  spread: GLYPH_CONTRACT_SPREAD,
  kingdoms: THREE_KINGDOMS,
  lore: BRIDGEWORLD_LORE,
  getContractByPosition,
  getContractByGlyph,
  getContractByName,
  getCurrentPosition,
  getRootchainSum,
  getDigitRoot,
  visualizeSpread
};
