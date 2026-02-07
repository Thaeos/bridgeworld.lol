/**
 * ConnectKit Configuration
 * Replaces WalletConnect with TreasureProject's ConnectKit
 * 
 * Features:
 * - Beautiful pre-built UI themes
 * - wagmi + viem integration
 * - SIWE (Sign In With Ethereum) support
 * - Multi-chain support
 * - Customizable themes
 */

import { getDefaultConfig } from 'connectkit';
import { createConfig, http } from 'wagmi';
import { mainnet, arbitrum, polygon, optimism, base } from 'wagmi/chains';

// Treasure Chain (Custom)
export const treasureChain = {
  id: 978657,
  name: 'Treasure Ruby',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.treasure.lol'] },
    public: { http: ['https://rpc.treasure.lol'] },
  },
  blockExplorers: {
    default: { name: 'Treasurescan', url: 'https://ruby.treasurescan.io' },
  },
};

// ConnectKit Configuration
export const connectKitConfig = createConfig(
  getDefaultConfig({
    // Required
    chains: [arbitrum, mainnet, polygon, optimism, base, treasureChain as any],
    transports: {
      [mainnet.id]: http('https://eth.llamarpc.com'),
      [arbitrum.id]: http('https://arb1.arbitrum.io/rpc'),
      [polygon.id]: http('https://polygon-rpc.com'),
      [optimism.id]: http('https://mainnet.optimism.io'),
      [base.id]: http('https://mainnet.base.org'),
      [treasureChain.id]: http('https://rpc.treasure.lol'),
    },

    // Required API Keys
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',

    // Required App Info
    appName: 'Diamond Meta{Safe}',
    appDescription: 'Autonomous Diamond Contract System with Treasure Integration',
    appUrl: 'https://bridgeworld.lol',
    appIcon: 'https://bridgeworld.lol/icon.png',
  })
);

// Theme Configuration
export const connectKitTheme = {
  // Available themes: 'auto', 'web95', 'retro', 'soft', 'midnight', 'minimal', 'rounded', 'nouns'
  theme: 'midnight',
  
  // Custom colors (optional)
  customTheme: {
    '--ck-font-family': '"ABCWhyte", system-ui, sans-serif',
    '--ck-border-radius': '12px',
    '--ck-accent-color': '#7C3AED', // Purple accent
    '--ck-accent-text-color': '#ffffff',
    
    // Modal
    '--ck-modal-box-shadow': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    
    // Buttons
    '--ck-primary-button-background': '#7C3AED',
    '--ck-primary-button-hover-background': '#6D28D9',
    
    // Secondary
    '--ck-secondary-button-background': '#1F2937',
    '--ck-secondary-button-hover-background': '#374151',
  },
  
  // Mode: 'auto', 'light', 'dark'
  mode: 'dark',
};

// SIWE Configuration for Sign-In with Ethereum
export const siweConfig = {
  enabled: true,
  
  // Session duration in seconds (default: 1 day)
  sessionDuration: 86400,
  
  // Custom message
  getMessage: ({ address, chainId, nonce }: { address: string; chainId: number; nonce: string }) => {
    return `Diamond Meta{Safe} Authentication

Sign this message to authenticate with the Diamond autonomous execution system.

Wallet: ${address}
Chain ID: ${chainId}
Nonce: ${nonce}
Issued At: ${new Date().toISOString()}

This request will not trigger a blockchain transaction or cost any gas fees.`;
  },
  
  // Verification endpoint
  verifyEndpoint: '/api/siwe/verify',
  signOutEndpoint: '/api/siwe/signout',
  sessionEndpoint: '/api/siwe/session',
};

// Supported Wallets Configuration
export const walletConfig = {
  // Prioritized wallets shown first
  priorityWallets: [
    'metaMask',
    'coinbaseWallet',
    'walletConnect',
    'safe',
    'rainbow',
  ],
  
  // Hide specific wallets
  hiddenWallets: [],
  
  // Show "More Wallets" option
  showMoreWallets: true,
  
  // Recent wallets to remember
  rememberRecentWallets: true,
};

// Chain Configuration for Diamond System
export const chainConfig = {
  defaultChain: arbitrum,
  
  // Chains supported by the Diamond system
  supportedChains: {
    1: { name: 'Ethereum', explorer: 'https://etherscan.io' },
    42161: { name: 'Arbitrum One', explorer: 'https://arbiscan.io' },
    137: { name: 'Polygon', explorer: 'https://polygonscan.com' },
    10: { name: 'Optimism', explorer: 'https://optimistic.etherscan.io' },
    8453: { name: 'Base', explorer: 'https://basescan.org' },
    978657: { name: 'Treasure Ruby', explorer: 'https://ruby.treasurescan.io' },
  },
  
  // Diamond contract addresses per chain
  diamondAddresses: {
    1: '0x0000000000000000000000000000000000000000', // Mainnet (not deployed)
    42161: '0xf7993A8df974AD022647E63402d6315137c58ABf', // Arbitrum (main deployment)
    137: '0x0000000000000000000000000000000000000000', // Polygon (not deployed)
  },
};

// Export React component wrapper
export const ConnectKitProviderConfig = {
  theme: connectKitTheme.theme,
  customTheme: connectKitTheme.customTheme,
  mode: connectKitTheme.mode,
  options: {
    embedGoogleFonts: true,
    walletConnectName: 'WalletConnect',
    truncateLongENSAddress: true,
    walletOnboardingUrl: 'https://treasure.lol/wallet',
    disclaimer: (
      `By connecting, you agree to the Diamond Meta{Safe} Terms of Service and acknowledge that you have read and understand the risks involved with blockchain transactions.`
    ),
  },
};

export default {
  config: connectKitConfig,
  theme: connectKitTheme,
  siwe: siweConfig,
  wallets: walletConfig,
  chains: chainConfig,
  provider: ConnectKitProviderConfig,
};
