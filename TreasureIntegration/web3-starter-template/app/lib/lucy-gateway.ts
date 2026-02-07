/**
 * Lucy Gateway Integration
 * 
 * Ethereum Gateway: system76.bridgeworld.lol
 * IPFS Gateway: theos.bridgeworld.lol
 * 
 * Routes facet deployments through Lucy for multi-chain Diamond deployment
 */

import { type Address, type Hash, createPublicClient, createWalletClient, http, type Chain } from 'viem';
import { arbitrum, polygon, base, mainnet } from 'viem/chains';
import { privateKeyToAccount, mnemonicToAccount } from 'viem/accounts';

// Lucy Gateway endpoints
export const LUCY_GATEWAY = {
  ethereum: 'https://system76.bridgeworld.lol',
  ipfs: 'https://theos.bridgeworld.lol',
  rpcProxy: 'https://system76.bridgeworld.lol/rpc',
} as const;

// Treasure Ruby Chain
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

// Chain RPC endpoints (routed through Lucy when available)
export const CHAIN_RPC: Record<number, string> = {
  1: `${LUCY_GATEWAY.ethereum}/mainnet`,
  42161: 'https://arb1.arbitrum.io/rpc',
  137: 'https://polygon-rpc.com',
  8453: 'https://mainnet.base.org',
  978657: 'https://rpc.treasure.lol',
};

// Get public client for chain
export function getPublicClient(chainId: number) {
  const chain = getChainById(chainId);
  if (!chain) throw new Error(`Unknown chain: ${chainId}`);
  
  return createPublicClient({
    chain,
    transport: http(CHAIN_RPC[chainId]),
  });
}

// Get chain config by ID
export function getChainById(chainId: number): Chain | undefined {
  switch (chainId) {
    case 1: return mainnet;
    case 42161: return arbitrum;
    case 137: return polygon;
    case 8453: return base;
    case 978657: return treasureRuby;
    default: return undefined;
  }
}

/**
 * Fetch facet bytecode from IPFS via Lucy gateway
 */
export async function fetchFacetFromIPFS(cid: string): Promise<`0x${string}`> {
  const url = `${LUCY_GATEWAY.ipfs}/ipfs/${cid}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch from IPFS: ${response.status}`);
  }
  
  const bytecode = await response.text();
  
  // Ensure it's valid hex
  if (!bytecode.startsWith('0x')) {
    return `0x${bytecode}` as `0x${string}`;
  }
  
  return bytecode as `0x${string}`;
}

/**
 * Pin content to IPFS via Lucy gateway
 */
export async function pinToIPFS(content: string | Uint8Array): Promise<string> {
  const formData = new FormData();
  
  if (typeof content === 'string') {
    formData.append('file', new Blob([content], { type: 'application/octet-stream' }));
  } else {
    formData.append('file', new Blob([content], { type: 'application/octet-stream' }));
  }
  
  const response = await fetch(`${LUCY_GATEWAY.ipfs}/api/v0/add`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error(`Failed to pin to IPFS: ${response.status}`);
  }
  
  const result = await response.json();
  return result.Hash;
}

/**
 * Create wallet client from mnemonic (DO NOT LOG OR EXPOSE)
 */
export function createWalletFromMnemonic(mnemonic: string, chainId: number) {
  const chain = getChainById(chainId);
  if (!chain) throw new Error(`Unknown chain: ${chainId}`);
  
  const account = mnemonicToAccount(mnemonic);
  
  return createWalletClient({
    account,
    chain,
    transport: http(CHAIN_RPC[chainId]),
  });
}

/**
 * Create wallet client from private key (DO NOT LOG OR EXPOSE)
 */
export function createWalletFromPrivateKey(privateKey: `0x${string}`, chainId: number) {
  const chain = getChainById(chainId);
  if (!chain) throw new Error(`Unknown chain: ${chainId}`);
  
  const account = privateKeyToAccount(privateKey);
  
  return createWalletClient({
    account,
    chain,
    transport: http(CHAIN_RPC[chainId]),
  });
}

/**
 * Diamond facet deployment parameters
 */
export interface FacetDeployment {
  bytecode: `0x${string}`;
  chainId: number;
  gasLimit?: bigint;
}

/**
 * Deploy facet bytecode to chain
 */
export async function deployFacet(
  deployment: FacetDeployment,
  walletClient: ReturnType<typeof createWalletFromPrivateKey>
): Promise<{ address: Address; hash: Hash }> {
  const hash = await walletClient.deployContract({
    abi: [],
    bytecode: deployment.bytecode,
    gas: deployment.gasLimit,
  });
  
  const publicClient = getPublicClient(deployment.chainId);
  
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  
  if (!receipt.contractAddress) {
    throw new Error('Contract deployment failed');
  }
  
  return {
    address: receipt.contractAddress,
    hash,
  };
}

/**
 * Multi-chain deployment manifest
 */
export interface DeploymentManifest {
  diamond: Address;
  facets: {
    name: string;
    address: Address;
    chainId: number;
    cid: string;
    txHash: Hash;
    deployedAt: string;
  }[];
  chains: number[];
  timestamp: string;
}

/**
 * Create deployment manifest
 */
export function createDeploymentManifest(
  diamondAddress: Address,
  chainIds: number[]
): DeploymentManifest {
  return {
    diamond: diamondAddress,
    facets: [],
    chains: chainIds,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Route RPC request through Lucy gateway
 */
export async function proxyRpcRequest(
  chainId: number,
  method: string,
  params: any[]
): Promise<any> {
  const response = await fetch(`${LUCY_GATEWAY.rpcProxy}/${chainId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method,
      params,
    }),
  });
  
  if (!response.ok) {
    throw new Error(`RPC proxy error: ${response.status}`);
  }
  
  const result = await response.json();
  
  if (result.error) {
    throw new Error(result.error.message);
  }
  
  return result.result;
}

export default {
  LUCY_GATEWAY,
  CHAIN_RPC,
  getPublicClient,
  getChainById,
  fetchFacetFromIPFS,
  pinToIPFS,
  createWalletFromMnemonic,
  createWalletFromPrivateKey,
  deployFacet,
  createDeploymentManifest,
  proxyRpcRequest,
};
