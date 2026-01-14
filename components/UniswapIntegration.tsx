'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getTHOCoin } from '@/lib/tho-coin';
import { getENSConfig } from '@/lib/ens-config';

// Base Network Uniswap V3 Router
const UNISWAP_V3_ROUTER_BASE = '0x2626664c2603336E57B271c5C0b26F421741e481';
const WETH_BASE = '0x4200000000000000000000000000000000000006';

const ROUTER_ABI = [
  'function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountOut)',
  'function exactOutputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountOut, uint256 amountInMaximum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountIn)'
];

export default function UniswapIntegration() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [connected, setConnected] = useState(false);
  const [tho, setTho] = useState<any>(null);
  const [amountIn, setAmountIn] = useState('');
  const [swapDirection, setSwapDirection] = useState<'tho-to-weth' | 'weth-to-tho'>('tho-to-weth');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  useEffect(() => {
    const thoData = getTHOCoin();
    setTho(thoData);
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Switch to Base network if needed
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== '0x2105') { // Base chain ID
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x2105' }],
            });
          } catch (switchError: any) {
            if (switchError.code === 4902) {
              // Add Base network
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: '0x2105',
                  chainName: 'Base',
                  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                  rpcUrls: ['https://mainnet.base.org'],
                  blockExplorerUrls: ['https://basescan.org']
                }],
              });
            }
          }
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
        setProvider(provider);
        setSigner(signer);
        setConnected(true);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    }
  };

  const executeSwap = async () => {
    if (!signer || !amountIn || !tho) return;

    setLoading(true);
    setTxHash(null);

    try {
      const router = new ethers.Contract(
        UNISWAP_V3_ROUTER_BASE,
        ROUTER_ABI,
        signer
      );

      const amountInWei = ethers.parseUnits(amountIn, 18);
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes
      const ensConfig = getENSConfig();

      const tokenIn = swapDirection === 'tho-to-weth' ? tho.contract : WETH_BASE;
      const tokenOut = swapDirection === 'tho-to-weth' ? WETH_BASE : tho.contract;

      const params = {
        tokenIn,
        tokenOut,
        fee: 3000, // 0.3% fee tier
        recipient: ensConfig.owner,
        deadline,
        amountIn: amountInWei,
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0
      };

      const tx = await router.exactInputSingle(params);
      setTxHash(tx.hash);
      
      const receipt = await tx.wait();
      console.log('Swap successful:', receipt);
    } catch (error: any) {
      console.error('Swap error:', error);
      alert(`Swap failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="uniswap-integration p-6 bg-gradient-to-br from-green-900/20 to-blue-900/20 rounded-lg border border-green-500/30">
      <h2 className="text-2xl font-bold mb-4 text-white">Uniswap V3 Integration</h2>
      
      {tho && (
        <div className="mb-6 bg-gray-800/50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2">{tho.ticker} Coin</h3>
          <div className="space-y-1 text-sm">
            <p className="text-gray-300">
              <span className="text-gray-400">Contract:</span>{' '}
              <span className="font-mono text-xs">{tho.contract}</span>
            </p>
            <p className="text-gray-300">
              <span className="text-gray-400">Network:</span> {tho.network}
            </p>
            <p className="text-gray-300">
              <span className="text-gray-400">Pool:</span>{' '}
              <a
                href={tho.pool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                View on DexScreener
              </a>
            </p>
          </div>
        </div>
      )}

      {!connected ? (
        <button
          onClick={connectWallet}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
        >
          Connect Wallet (Base Network)
        </button>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Swap Direction</label>
            <div className="flex gap-4">
              <button
                onClick={() => setSwapDirection('tho-to-weth')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  swapDirection === 'tho-to-weth'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                THO → WETH
              </button>
              <button
                onClick={() => setSwapDirection('weth-to-tho')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  swapDirection === 'weth-to-tho'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                WETH → THO
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Amount ({swapDirection === 'tho-to-weth' ? 'THO' : 'WETH'})
            </label>
            <input
              type="text"
              value={amountIn}
              onChange={(e) => setAmountIn(e.target.value)}
              placeholder="0.0"
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
            />
          </div>

          <button
            onClick={executeSwap}
            disabled={loading || !amountIn}
            className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
          >
            {loading ? 'Swapping...' : 'Execute Swap'}
          </button>

          {txHash && (
            <div className="mt-4 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
              <p className="text-sm text-green-400">
                Transaction Hash:{' '}
                <a
                  href={`${tho?.explorer}/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-green-300"
                >
                  {txHash}
                </a>
              </p>
            </div>
          )}

          <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-400">
              ⚠️ This is a demo integration. Always verify contract addresses and test with small amounts first.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
