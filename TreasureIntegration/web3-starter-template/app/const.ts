import { arbitrum, arbitrumSepolia, mainnet, polygon, base, type Chain } from 'viem/chains';

// Treasure Ruby Chain (custom)
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

// Mainnet chains for Diamond facet deployment
const MAINNET = [arbitrum, mainnet, polygon, base, treasureRuby] as const;

const TESTNET = [arbitrumSepolia] as const;

export const ENABLED_CHAINS =
  ENV.PUBLIC_ENABLE_TESTNET === 'true' ? TESTNET : MAINNET;

// Chain-specific RPC endpoints
export const CHAIN_RPC_URLS: Record<number, string> = {
  1: 'https://eth.llamarpc.com',
  42161: 'https://arb1.arbitrum.io/rpc',
  137: 'https://polygon-rpc.com',
  8453: 'https://mainnet.base.org',
  978657: 'https://rpc.treasure.lol',
  421614: 'https://sepolia-rollup.arbitrum.io/rpc',
};
