/**
 * Diamond Activation System
 * 
 * Triggers Diamond contract activation when wallet connects via Brave/ConnectKit
 * Uses IPFS CID hashes via Lucy gateway for facet deployment across chains:
 * - Ruby (Treasure Chain)
 * - Arbitrum
 * - Polygon  
 * - Base (Coinbase)
 */

import { type Address, type Chain } from 'viem';
import { arbitrum, polygon, base, mainnet } from 'viem/chains';

// Lucy Gateway endpoints (bridgeworld.lol)
export const LUCY_GATEWAY = {
  ethereum: 'https://system76.bridgeworld.lol',
  ipfs: 'https://theos.bridgeworld.lol',
} as const;

// Diamond contract addresses per chain
export const DIAMOND_ADDRESSES: Record<number, Address> = {
  1: '0x0000000000000000000000000000000000000000', // Mainnet (via Lucy gateway)
  42161: '0xf7993A8df974AD022647E63402d6315137c58ABf', // Arbitrum (main deployment)
  137: '0x0000000000000000000000000000000000000000', // Polygon (to deploy)
  8453: '0x0000000000000000000000000000000000000000', // Base (to deploy)
  978657: '0x0000000000000000000000000000000000000000', // Treasure Ruby (to deploy)
};

// Treasure Ruby Chain definition
export const treasureRuby: Chain = {
  id: 978657,
  name: 'Treasure Ruby',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.treasure.lol'] },
  },
  blockExplorers: {
    default: { name: 'Treasurescan', url: 'https://ruby.treasurescan.io' },
  },
};

// Target chains for Diamond facet deployment
export const TARGET_CHAINS = [treasureRuby, arbitrum, polygon, base] as const;

// Hive address (linked to Diamond)
export const HIVE_ADDRESS = '0x67A977eaD94C3b955ECbf27886CE9f62464423B2' as const;

// Imperial Aramaic Glyphs for IPFS CID mapping
export const IPFS_GLYPHS = {
  1: '𐡀',   // Aleph - First node
  5: '𐡄',   // He - Second node
  10: '𐡉',  // Yodh - Third node
  369: '𐡔𐡎𐡈', // EL→369 - Fourth node
  419: '𐡕𐡉𐡃', // Theos - Fifth node (Completion)
} as const;

// Diamond Facet CIDs (IPFS content addresses for facet bytecode)
export interface FacetCID {
  name: string;
  cid: string;
  glyph: string;
  chain: number;
  selectors: string[];
}

export const FACET_CIDS: FacetCID[] = [
  {
    name: 'TreasureMarketplaceFacet',
    cid: 'Qm...', // To be populated from IPFS
    glyph: IPFS_GLYPHS[1],
    chain: 978657, // Ruby
    selectors: ['0x9e43e0d0'],
  },
  {
    name: 'ArbitrumBridgeFacet',
    cid: 'Qm...',
    glyph: IPFS_GLYPHS[5],
    chain: 42161, // Arbitrum
    selectors: ['0x47e7ef24'],
  },
  {
    name: 'PolygonBridgeFacet',
    cid: 'Qm...',
    glyph: IPFS_GLYPHS[10],
    chain: 137, // Polygon
    selectors: ['0x69328dec'],
  },
  {
    name: 'BaseBridgeFacet',
    cid: 'Qm...',
    glyph: IPFS_GLYPHS[369],
    chain: 8453, // Base
    selectors: ['0x7d8d9f36'],
  },
];

// Authorized wallet addresses that can trigger Diamond activation
export const AUTHORIZED_WALLETS: Address[] = [
  // Add your Brave wallet address here
];

/**
 * Check if connected wallet is authorized for Diamond activation
 */
export function isAuthorizedWallet(address: Address): boolean {
  // For now, allow any connected wallet
  // In production, check against AUTHORIZED_WALLETS
  return address !== undefined && address.length === 42;
}

/**
 * Detect if user is connecting via Brave Wallet
 */
export function detectBraveWallet(): boolean {
  if (typeof window === 'undefined') return false;
  const ethereum = (window as any).ethereum;
  return ethereum?.isBraveWallet === true;
}

/**
 * Get facet bytecode from IPFS via Lucy gateway
 */
export async function getFacetFromIPFS(cid: string): Promise<string> {
  const response = await fetch(`${LUCY_GATEWAY.ipfs}/ipfs/${cid}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch facet from IPFS: ${cid}`);
  }
  return await response.text();
}

/**
 * Diamond activation payload
 */
export interface DiamondActivationPayload {
  walletAddress: Address;
  isBraveWallet: boolean;
  targetChains: number[];
  facetCIDs: FacetCID[];
  timestamp: string;
  signature?: string;
}

/**
 * Create Diamond activation payload
 */
export function createActivationPayload(
  walletAddress: Address,
  isBraveWallet: boolean
): DiamondActivationPayload {
  return {
    walletAddress,
    isBraveWallet,
    targetChains: TARGET_CHAINS.map(c => c.id),
    facetCIDs: FACET_CIDS,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Diamond Cut parameters for facet addition
 */
export interface DiamondCutParam {
  facetAddress: Address;
  action: 0 | 1 | 2; // 0 = Add, 1 = Replace, 2 = Remove
  functionSelectors: `0x${string}`[];
}

/**
 * Prepare Diamond Cut for multi-chain deployment
 */
export function prepareDiamondCut(
  facetAddress: Address,
  selectors: string[]
): DiamondCutParam {
  return {
    facetAddress,
    action: 0, // Add
    functionSelectors: selectors as `0x${string}`[],
  };
}

/**
 * Diamond activation event handler
 * Called when wallet connects and address is authorized
 */
export async function onDiamondActivation(
  address: Address,
  chainId: number
): Promise<void> {
  console.log(`[Diamond] Activation triggered for ${address} on chain ${chainId}`);
  
  const isBrave = detectBraveWallet();
  console.log(`[Diamond] Brave Wallet: ${isBrave}`);
  
  if (!isAuthorizedWallet(address)) {
    console.log(`[Diamond] Wallet not authorized`);
    return;
  }
  
  const payload = createActivationPayload(address, isBrave);
  console.log(`[Diamond] Activation payload created:`, payload);
  
  // Emit custom event for tracking
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('diamond:activation', {
      detail: payload
    }));
  }
}

/**
 * Get Diamond address for chain
 */
export function getDiamondAddress(chainId: number): Address | null {
  return DIAMOND_ADDRESSES[chainId] || null;
}

/**
 * Check if Diamond is deployed on chain
 */
export function isDiamondDeployed(chainId: number): boolean {
  const address = DIAMOND_ADDRESSES[chainId];
  return address !== undefined && address !== '0x0000000000000000000000000000000000000000';
}

// DiamondCut ABI for contract interaction
export const DIAMOND_CUT_ABI = [
  {
    inputs: [
      {
        components: [
          { name: 'facetAddress', type: 'address' },
          { name: 'action', type: 'uint8' },
          { name: 'functionSelectors', type: 'bytes4[]' },
        ],
        name: '_diamondCut',
        type: 'tuple[]',
      },
      { name: '_init', type: 'address' },
      { name: '_calldata', type: 'bytes' },
    ],
    name: 'diamondCut',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

// DiamondLoupe ABI for reading facets
export const DIAMOND_LOUPE_ABI = [
  {
    inputs: [],
    name: 'facets',
    outputs: [
      {
        components: [
          { name: 'facetAddress', type: 'address' },
          { name: 'functionSelectors', type: 'bytes4[]' },
        ],
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '_functionSelector', type: 'bytes4' }],
    name: 'facetAddress',
    outputs: [{ name: 'facetAddress_', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export default {
  LUCY_GATEWAY,
  DIAMOND_ADDRESSES,
  HIVE_ADDRESS,
  TARGET_CHAINS,
  FACET_CIDS,
  IPFS_GLYPHS,
  isAuthorizedWallet,
  detectBraveWallet,
  getFacetFromIPFS,
  createActivationPayload,
  prepareDiamondCut,
  onDiamondActivation,
  getDiamondAddress,
  isDiamondDeployed,
};
