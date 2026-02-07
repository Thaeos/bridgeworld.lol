/**
 * CID Hash Activation System
 * 
 * Activates Diamond contract through IPFS CID hashes
 * When wallet connects with matching address, the Diamond procs
 * 
 * Flow:
 * 1. Brave wallet connects → detect public address
 * 2. Address triggers Diamond activation check
 * 3. CID hashes are verified via IPFS gateway
 * 4. Diamond facets activate on matched chains:
 *    - Ruby (978657)
 *    - Arbitrum (42161)
 *    - Polygon (137)
 *    - Base (8453)
 */

import { type Address, type Hash, keccak256, toHex, encodePacked } from 'viem';

// Imperial Aramaic Glyphs for human-readable CID mapping
export const GLYPHS = {
  ALEPH: '𐡀',     // First node
  HE: '𐡄',       // Second node
  YODH: '𐡉',     // Third node
  EL_369: '𐡔𐡎𐡈', // Fourth node - EL→369
  THEOS: '𐡕𐡉𐡃', // Fifth node - Completion
} as const;

// CID to Glyph mapping (remember glyphs instead of 46-char CIDs)
export interface CIDMapping {
  cid: string;
  glyph: string;
  chain: number;
  facetName: string;
  selectors: `0x${string}`[];
}

// Placeholder CID mappings (populated from IPFS)
export const CID_REGISTRY: CIDMapping[] = [
  {
    cid: '', // QmRuby... - to be populated
    glyph: GLYPHS.ALEPH,
    chain: 978657, // Treasure Ruby
    facetName: 'TreasureRubyFacet',
    selectors: ['0x9e43e0d0'],
  },
  {
    cid: '', // QmArb... - to be populated
    glyph: GLYPHS.HE,
    chain: 42161, // Arbitrum
    facetName: 'ArbitrumBridgeFacet',
    selectors: ['0x47e7ef24'],
  },
  {
    cid: '', // QmPoly... - to be populated
    glyph: GLYPHS.YODH,
    chain: 137, // Polygon
    facetName: 'PolygonBridgeFacet',
    selectors: ['0x69328dec'],
  },
  {
    cid: '', // QmBase... - to be populated
    glyph: GLYPHS.EL_369,
    chain: 8453, // Base/Coinbase
    facetName: 'BaseBridgeFacet',
    selectors: ['0x7d8d9f36'],
  },
];

// Diamond activation state
export interface ActivationState {
  activated: boolean;
  timestamp: string;
  wallet: Address;
  chains: {
    chainId: number;
    glyph: string;
    cidVerified: boolean;
    facetActive: boolean;
  }[];
  completionGlyph: string;
}

/**
 * Generate activation hash from wallet address
 * Used to verify wallet is authorized for Diamond activation
 */
export function generateActivationHash(address: Address): Hash {
  return keccak256(
    encodePacked(
      ['address', 'string', 'string'],
      [address, 'DIAMOND_ACTIVATION', GLYPHS.THEOS]
    )
  );
}

/**
 * Verify CID against IPFS gateway
 */
export async function verifyCID(
  cid: string,
  ipfsGateway: string
): Promise<boolean> {
  if (!cid || cid.length === 0) return false;
  
  try {
    const response = await fetch(`${ipfsGateway}/ipfs/${cid}`, {
      method: 'HEAD',
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Create activation state for wallet
 */
export function createActivationState(wallet: Address): ActivationState {
  return {
    activated: false,
    timestamp: new Date().toISOString(),
    wallet,
    chains: CID_REGISTRY.map(reg => ({
      chainId: reg.chain,
      glyph: reg.glyph,
      cidVerified: false,
      facetActive: false,
    })),
    completionGlyph: GLYPHS.THEOS,
  };
}

/**
 * Activate Diamond through CID hash verification
 */
export async function activateThroughCIDs(
  wallet: Address,
  ipfsGateway: string
): Promise<ActivationState> {
  const state = createActivationState(wallet);
  
  console.log(`[CID Activation] Starting for wallet: ${wallet}`);
  console.log(`[CID Activation] Verifying ${CID_REGISTRY.length} CID hashes...`);
  
  // Verify each CID
  for (let i = 0; i < CID_REGISTRY.length; i++) {
    const reg = CID_REGISTRY[i];
    
    if (reg.cid) {
      const verified = await verifyCID(reg.cid, ipfsGateway);
      state.chains[i].cidVerified = verified;
      
      console.log(`  ${reg.glyph} Chain ${reg.chain}: ${verified ? '✓' : '○'}`);
    } else {
      console.log(`  ${reg.glyph} Chain ${reg.chain}: No CID registered`);
    }
  }
  
  // Check if all verified
  const allVerified = state.chains.every(c => c.cidVerified);
  
  if (allVerified) {
    state.activated = true;
    console.log(`[CID Activation] ${GLYPHS.THEOS} Diamond ACTIVATED!`);
  } else {
    console.log(`[CID Activation] Partial activation (some CIDs missing)`);
  }
  
  return state;
}

/**
 * Get glyph for chain
 */
export function getGlyphForChain(chainId: number): string {
  const reg = CID_REGISTRY.find(r => r.chain === chainId);
  return reg?.glyph || '○';
}

/**
 * Get all glyphs as string (for display)
 */
export function getGlyphString(): string {
  return Object.values(GLYPHS).join(' ');
}

/**
 * Diamond activation event
 * Emitted when wallet triggers Diamond proc
 */
export interface DiamondActivationEvent {
  type: 'diamond:activation';
  wallet: Address;
  activationHash: Hash;
  glyphs: string[];
  timestamp: string;
}

/**
 * Emit Diamond activation event
 */
export function emitActivationEvent(wallet: Address): void {
  if (typeof window === 'undefined') return;
  
  const event: DiamondActivationEvent = {
    type: 'diamond:activation',
    wallet,
    activationHash: generateActivationHash(wallet),
    glyphs: Object.values(GLYPHS),
    timestamp: new Date().toISOString(),
  };
  
  window.dispatchEvent(new CustomEvent('diamond:activation', {
    detail: event,
  }));
  
  console.log(`[Diamond] Activation event emitted:`, event);
}

/**
 * Listen for Diamond activation events
 */
export function onActivationEvent(
  callback: (event: DiamondActivationEvent) => void
): () => void {
  if (typeof window === 'undefined') return () => {};
  
  const handler = (e: CustomEvent<DiamondActivationEvent>) => {
    callback(e.detail);
  };
  
  window.addEventListener('diamond:activation', handler as EventListener);
  
  return () => {
    window.removeEventListener('diamond:activation', handler as EventListener);
  };
}

export default {
  GLYPHS,
  CID_REGISTRY,
  generateActivationHash,
  verifyCID,
  createActivationState,
  activateThroughCIDs,
  getGlyphForChain,
  getGlyphString,
  emitActivationEvent,
  onActivationEvent,
};
