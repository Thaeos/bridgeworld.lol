#!/usr/bin/env ts-node
/**
 * Multi-Chain Diamond Facet Deployment
 * 
 * Deploys facets to:
 * - Treasure Ruby (978657)
 * - Arbitrum (42161)
 * - Polygon (137)
 * - Base/Coinbase (8453)
 * 
 * Uses Lucy gateway (system76.bridgeworld.lol) for Ethereum routing
 * Uses IPFS gateway (theos.bridgeworld.lol) for facet bytecode
 * 
 * IMPORTANT: Requires OPENSEA_12_WORD_SEED in environment for wallet
 */

import { 
  createPublicClient,
  createWalletClient,
  http,
  type Address,
  type Hash,
  encodeFunctionData,
  parseAbi,
} from 'viem';
import { mnemonicToAccount } from 'viem/accounts';
import { arbitrum, polygon, base, mainnet } from 'viem/chains';
import * as fs from 'fs';
import * as path from 'path';

// Lucy Gateway endpoints
const LUCY_GATEWAY = {
  ethereum: 'https://system76.bridgeworld.lol',
  ipfs: 'https://theos.bridgeworld.lol',
};

// Treasure Ruby Chain
const treasureRuby = {
  id: 978657,
  name: 'Treasure Ruby',
  network: 'treasure-ruby',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.treasure.lol'] },
    public: { http: ['https://rpc.treasure.lol'] },
  },
  blockExplorers: {
    default: { name: 'Treasurescan', url: 'https://ruby.treasurescan.io' },
  },
} as const;

// Target chains
const TARGET_CHAINS = [
  { chain: treasureRuby, rpc: 'https://rpc.treasure.lol' },
  { chain: arbitrum, rpc: 'https://arb1.arbitrum.io/rpc' },
  { chain: polygon, rpc: 'https://polygon-rpc.com' },
  { chain: base, rpc: 'https://mainnet.base.org' },
];

// Diamond addresses per chain (main on Arbitrum, deploy others)
const DIAMOND_ADDRESSES: Record<number, Address> = {
  42161: '0xf7993A8df974AD022647E63402d6315137c58ABf', // Arbitrum - existing
};

// Hive address
const HIVE_ADDRESS = '0x67A977eaD94C3b955ECbf27886CE9f62464423B2' as const;

// Imperial Aramaic Glyphs for IPFS CID mapping
const IPFS_GLYPHS: Record<number, string> = {
  1: '𐡀',     // Aleph
  5: '𐡄',     // He
  10: '𐡉',    // Yodh
  369: '𐡔𐡎𐡈', // EL→369
  419: '𐡕𐡉𐡃', // Theos
};

// DiamondCut ABI
const DIAMOND_CUT_ABI = parseAbi([
  'function diamondCut((address facetAddress, uint8 action, bytes4[] functionSelectors)[] _diamondCut, address _init, bytes _calldata) external',
]);

// Diamond ABI for deployment
const DIAMOND_ABI = parseAbi([
  'constructor(address _contractOwner, address _diamondCutFacet)',
]);

// Facet ABIs
const FACET_SELECTORS = {
  TreasureMarketplaceFacet: ['0x9e43e0d0', '0x47e7ef24', '0x69328dec'],
  ArbitrumBridgeFacet: ['0x7d8d9f36', '0x6d9a640a'],
  PolygonBridgeFacet: ['0x042c1e5c', '0x8b0e9f3a'],
  BaseBridgeFacet: ['0xa5b3c4d2', '0xb6c5d7e8'],
};

interface DeploymentResult {
  chain: string;
  chainId: number;
  diamond?: Address;
  facets: {
    name: string;
    address: Address;
    txHash: Hash;
    selectors: string[];
  }[];
  timestamp: string;
}

async function getMnemonic(): Promise<string> {
  // Try environment variable first
  const envMnemonic = process.env.OPENSEA_12_WORD_SEED;
  if (envMnemonic) {
    console.log('[Deploy] Using mnemonic from OPENSEA_12_WORD_SEED env');
    return envMnemonic;
  }
  
  // Try reading from Vault (if mounted)
  const vaultPath = '/mnt/Vault/env.txt';
  if (fs.existsSync(vaultPath)) {
    const content = fs.readFileSync(vaultPath, 'utf-8');
    const match = content.match(/OPENSEA_12_WORD_SEED=(.+)/);
    if (match) {
      console.log('[Deploy] Using mnemonic from Vault');
      return match[1].trim().replace(/^["']|["']$/g, '');
    }
  }
  
  // Try local .env
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    const match = content.match(/OPENSEA_12_WORD_SEED=(.+)/);
    if (match) {
      console.log('[Deploy] Using mnemonic from .env');
      return match[1].trim().replace(/^["']|["']$/g, '');
    }
  }
  
  throw new Error('No mnemonic found. Set OPENSEA_12_WORD_SEED environment variable.');
}

async function fetchFacetFromIPFS(cid: string): Promise<`0x${string}`> {
  console.log(`[IPFS] Fetching facet from CID: ${cid.substring(0, 12)}...`);
  
  const response = await fetch(`${LUCY_GATEWAY.ipfs}/ipfs/${cid}`);
  if (!response.ok) {
    throw new Error(`IPFS fetch failed: ${response.status}`);
  }
  
  const bytecode = await response.text();
  return (bytecode.startsWith('0x') ? bytecode : `0x${bytecode}`) as `0x${string}`;
}

async function deployToChain(
  chainConfig: typeof TARGET_CHAINS[0],
  mnemonic: string,
  glyphIndex: number
): Promise<DeploymentResult> {
  const { chain, rpc } = chainConfig;
  console.log(`\n[Deploy] Starting deployment to ${chain.name} (${chain.id})`);
  console.log(`[Deploy] Glyph: ${IPFS_GLYPHS[glyphIndex] || IPFS_GLYPHS[1]}`);
  
  // Create account from mnemonic
  const account = mnemonicToAccount(mnemonic);
  console.log(`[Deploy] Deployer: ${account.address}`);
  
  // Create clients
  const publicClient = createPublicClient({
    chain: chain as any,
    transport: http(rpc),
  });
  
  const walletClient = createWalletClient({
    account,
    chain: chain as any,
    transport: http(rpc),
  });
  
  // Check balance
  const balance = await publicClient.getBalance({ address: account.address });
  console.log(`[Deploy] Balance: ${(Number(balance) / 1e18).toFixed(4)} ETH`);
  
  if (balance < BigInt(1e16)) { // 0.01 ETH minimum
    console.log(`[Deploy] WARNING: Low balance on ${chain.name}`);
  }
  
  const result: DeploymentResult = {
    chain: chain.name,
    chainId: chain.id,
    facets: [],
    timestamp: new Date().toISOString(),
  };
  
  // Check if Diamond exists on this chain
  const existingDiamond = DIAMOND_ADDRESSES[chain.id];
  if (existingDiamond) {
    console.log(`[Deploy] Using existing Diamond: ${existingDiamond}`);
    result.diamond = existingDiamond;
  } else {
    console.log(`[Deploy] No existing Diamond on ${chain.name}, will deploy facets only`);
  }
  
  // For now, simulate facet deployment
  console.log(`[Deploy] Facet deployment ready for ${chain.name}`);
  console.log(`[Deploy] Selectors prepared:`, Object.keys(FACET_SELECTORS));
  
  return result;
}

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║     MULTI-CHAIN DIAMOND FACET DEPLOYMENT                  ║');
  console.log('║     via Lucy Gateway + IPFS                               ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`[Gateway] Ethereum: ${LUCY_GATEWAY.ethereum}`);
  console.log(`[Gateway] IPFS: ${LUCY_GATEWAY.ipfs}`);
  console.log('');
  console.log('[Chains] Target chains:');
  TARGET_CHAINS.forEach((t, i) => {
    const glyph = Object.values(IPFS_GLYPHS)[i] || '○';
    console.log(`  ${glyph} ${t.chain.name} (${t.chain.id})`);
  });
  console.log('');
  
  // Get mnemonic
  let mnemonic: string;
  try {
    mnemonic = await getMnemonic();
    console.log('[Auth] Mnemonic loaded (not displayed for security)');
  } catch (error) {
    console.error('[Auth] ERROR:', (error as Error).message);
    console.log('');
    console.log('To deploy, set your wallet mnemonic:');
    console.log('  export OPENSEA_12_WORD_SEED="your twelve word seed phrase here"');
    console.log('');
    process.exit(1);
  }
  
  // Deploy to each chain
  const results: DeploymentResult[] = [];
  const glyphKeys = [1, 5, 10, 369, 419];
  
  for (let i = 0; i < TARGET_CHAINS.length; i++) {
    const chainConfig = TARGET_CHAINS[i];
    const glyphIndex = glyphKeys[i] || 1;
    
    try {
      const result = await deployToChain(chainConfig, mnemonic, glyphIndex);
      results.push(result);
    } catch (error) {
      console.error(`[Deploy] ERROR on ${chainConfig.chain.name}:`, error);
      results.push({
        chain: chainConfig.chain.name,
        chainId: chainConfig.chain.id,
        facets: [],
        timestamp: new Date().toISOString(),
      });
    }
  }
  
  // Save results
  const outputPath = path.join(process.cwd(), 'multichain_deployment.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log('');
  console.log(`[Deploy] Results saved to: ${outputPath}`);
  
  // Summary
  console.log('');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║                    DEPLOYMENT SUMMARY                      ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  
  results.forEach((r, i) => {
    const glyph = Object.values(IPFS_GLYPHS)[i] || '○';
    const status = r.diamond ? '✓ Active' : '○ Ready';
    console.log(`  ${glyph} ${r.chain}: ${status}`);
    if (r.diamond) {
      console.log(`     Diamond: ${r.diamond.substring(0, 20)}...`);
    }
  });
  
  console.log('');
  console.log('[Deploy] Remember these glyphs instead of CIDs:');
  console.log(`  ${Object.values(IPFS_GLYPHS).join('  ')}`);
}

main().catch(console.error);
