import { getDefaultConfig } from 'connectkit';
import type { Chain } from 'viem/chains';
import {
  cookieStorage,
  createConfig,
  createStorage,
  http,
  type Transport,
} from 'wagmi';
import { injected } from 'wagmi/connectors';
import { ENABLED_CHAINS, CHAIN_RPC_URLS } from '~/const';

// Brave wallet detection
function isBraveWallet(): boolean {
  if (typeof window === 'undefined') return false;
  const ethereum = (window as any).ethereum;
  return ethereum?.isBraveWallet === true;
}

// Get Brave wallet provider if available
function getBraveProvider() {
  if (typeof window === 'undefined') return undefined;
  const ethereum = (window as any).ethereum;
  if (ethereum?.isBraveWallet) return ethereum;
  // Check providers array for multi-wallet setups
  if (ethereum?.providers) {
    return ethereum.providers.find((p: any) => p.isBraveWallet);
  }
  return undefined;
}

export function getConfig() {
  const connectors = [
    // Brave Wallet connector (prioritized)
    injected({
      target: () => ({
        id: 'braveWallet',
        name: 'Brave Wallet',
        provider: getBraveProvider(),
      }),
    }),
    // Generic injected connector for MetaMask and others
    injected(),
  ];

  return createConfig(
    getDefaultConfig({
      connectors,
      transports: ENABLED_CHAINS.reduce<{
        [key in Chain['id']]: Transport;
      }>((acc, chain) => {
        // Use custom RPC URLs or fallback to thirdweb
        const rpcUrl = CHAIN_RPC_URLS[chain.id] || 
          `https://${chain.id}.rpc.thirdweb.com/${ENV.PUBLIC_THIRDWEB_KEY || ''}`;
        acc[chain.id] = http(rpcUrl);
        return acc;
      }, {}),
      storage: createStorage({
        storage: cookieStorage,
      }),
      walletConnectProjectId: ENV.PUBLIC_WALLETCONNECT_PROJECT_ID ?? '',
      chains: ENABLED_CHAINS,
      appName: 'Bridgeworld Market',
      appDescription: 'Diamond Meta{Safe} - NFT Marketplace powered by Treasure',
      ssr: true,
    }),
  );
}

export { isBraveWallet, getBraveProvider };
