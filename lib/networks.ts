/**
 * Network configuration for Bridgeworld.lol
 * Supports multi-chain: Treasure Chain (primary), Arbitrum (legacy)
 */

export interface NetworkConfig {
  name: string;
  chainId: number;
  rpc: string;
  rpcWss?: string;
  explorer: string;
  nativeToken: string;
  status: 'primary' | 'legacy' | 'testnet';
  contracts?: {
    magic?: string;
    stMagic?: string;
    marketplace?: string;
    legion?: string;
    staking?: string;
  };
}

export const NETWORKS: Record<string, NetworkConfig> = {
  treasure: {
    name: 'Treasure Chain',
    chainId: 61166,
    rpc: process.env.NEXT_PUBLIC_TREASURE_RPC || 'https://rpc.treasure.lol',
    rpcWss: process.env.NEXT_PUBLIC_TREASURE_WSS || 'wss://rpc.treasure.lol/ws',
    explorer: 'https://treasurescan.io',
    nativeToken: 'MAGIC',
    status: 'primary',
    contracts: {
      // Contracts will be updated after migration
      magic: '', // Native on Treasure Chain
      stMagic: '', // Pending deployment
      marketplace: '',
      staking: '',
    },
  },
  arbitrum: {
    name: 'Arbitrum One',
    chainId: 42161,
    rpc: process.env.NEXT_PUBLIC_ARBITRUM_RPC || 'https://arb1.arbitrum.io/rpc',
    explorer: 'https://arbiscan.io',
    nativeToken: 'ETH',
    status: 'legacy',
    contracts: {
      magic: '0x539bdE0d7Dbd336b79148AA742883198BBF60342',
      marketplace: '0x09986B4e255B3c548041a30A2Ee312Fe176731c2',
      legion: '0xfE8c1ac365bA6780AEc5a985D989b327C27670A1',
    },
  },
  topaz: {
    name: 'Treasure Topaz',
    chainId: 978670,
    rpc: 'https://rpc.topaz.treasure.lol',
    explorer: 'https://topaz.treasurescan.io',
    nativeToken: 'MAGIC',
    status: 'testnet',
  },
  ruby: {
    name: 'Treasure Ruby',
    chainId: 978657,
    rpc: 'https://rpc-testnet.treasure.lol/http',
    rpcWss: 'wss://rpc-testnet.treasure.lol/ws',
    explorer: 'https://testnet.treasurescan.io',
    nativeToken: 'MAGIC',
    status: 'testnet',
  },
};

export const DEFAULT_NETWORK = NETWORKS.treasure;

/**
 * Get network config by chain ID
 */
export function getNetworkByChainId(chainId: number): NetworkConfig | undefined {
  return Object.values(NETWORKS).find((n) => n.chainId === chainId);
}

/**
 * Get network config by name
 */
export function getNetwork(name: keyof typeof NETWORKS): NetworkConfig {
  return NETWORKS[name];
}

/**
 * Check if a chain ID is supported
 */
export function isSupportedChain(chainId: number): boolean {
  return Object.values(NETWORKS).some((n) => n.chainId === chainId);
}

/**
 * Get all production networks (non-testnet)
 */
export function getProductionNetworks(): NetworkConfig[] {
  return Object.values(NETWORKS).filter((n) => n.status !== 'testnet');
}

/**
 * Switch network in wallet
 */
export async function switchNetwork(chainId: number): Promise<boolean> {
  if (typeof window === 'undefined' || !window.ethereum) {
    console.error('No wallet detected');
    return false;
  }

  const network = getNetworkByChainId(chainId);
  if (!network) {
    console.error('Unsupported network');
    return false;
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
    return true;
  } catch (switchError: any) {
    // Chain not added, try to add it
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${chainId.toString(16)}`,
              chainName: network.name,
              nativeCurrency: {
                name: network.nativeToken,
                symbol: network.nativeToken,
                decimals: 18,
              },
              rpcUrls: [network.rpc],
              blockExplorerUrls: [network.explorer],
            },
          ],
        });
        return true;
      } catch (addError) {
        console.error('Failed to add network:', addError);
        return false;
      }
    }
    console.error('Failed to switch network:', switchError);
    return false;
  }
}

/**
 * Bridge configuration
 */
export const BRIDGE = {
  hyperlane: {
    url: 'https://app.treasure.lol/bridge',
    docs: 'https://docs.treasure.lol/chain',
  },
};

/**
 * EigenLayer staking configuration
 */
export const EIGENLAYER = {
  status: 'pending' as const,
  launchDate: 'Q1 2025',
  proposal: 'TIP-42',
  description: 'EigenLayer AVS staking for MAGIC-ETH security',
};

/**
 * Mage AI configuration
 */
export const MAGE = {
  status: 'active' as const,
  platform: 'Mage AI Agent Launchpad',
  description: 'Stake MAGIC as mana for AI compute rewards',
  docs: 'https://docs.treasure.lol',
};
