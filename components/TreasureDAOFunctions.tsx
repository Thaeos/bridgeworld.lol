'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getAllFunctions, getFunctionsByContract, type TreasureDAOFunction } from '@/lib/treasure-dao-functions';

const CONTRACT_ABIS: Record<string, any[]> = {
  Magic: [
    'function mint(address account, uint256 amount) external',
    'function teamMint(address account, uint256 amount) external',
    'function setWhitelist(address[] calldata minters) external',
    'function transfer(address recipient, uint256 amount) external returns (bool)',
    'function balanceOf(address account) external view returns (uint256)',
    'function totalSupply() external view returns (uint256)'
  ],
  MagicClaim: [
    'function claim(address account, uint256 amount, bytes32[] calldata proof) external',
    'function hasClaimed(address account) public view returns (bool)',
    'function validateClaim(address account, uint256 amount, bytes32[] calldata proof) public view returns (bool)'
  ],
  CardsBase: [
    'function uri(uint256 tokenId) public view returns (string memory)'
  ]
};

export default function TreasureDAOFunctions() {
  const [functions, setFunctions] = useState<TreasureDAOFunction[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [connected, setConnected] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState<TreasureDAOFunction | null>(null);
  const [result, setResult] = useState<string>('');

  useEffect(() => {
    let filtered = getAllFunctions();
    if (filter !== 'all') {
      filtered = getFunctionsByContract(filter);
    }
    setFunctions(filtered);
  }, [filter]);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        setProvider(provider);
        setConnected(true);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    }
  };

  const callViewFunction = async (func: TreasureDAOFunction, params: any[]) => {
    if (!provider) return;

    try {
      const abi = CONTRACT_ABIS[func.contract] || [];
      const contract = new ethers.Contract(func.address, abi, provider);
      const result = await contract[func.name](...params);
      setResult(JSON.stringify(result, null, 2));
    } catch (error: any) {
      setResult(`Error: ${error.message}`);
    }
  };

  const getExplorerUrl = (address: string) => {
    return `https://etherscan.io/address/${address}`;
  };

  const contracts = Array.from(new Set(functions.map(f => f.contract)));

  return (
    <div className="treasure-dao-functions p-6 bg-gradient-to-br from-blue-900/20 to-indigo-900/20 rounded-lg border border-blue-500/30">
      <h2 className="text-2xl font-bold mb-4 text-white">Treasure DAO Functions</h2>
      
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All ({getAllFunctions().length})
          </button>
          {contracts.map(contract => (
            <button
              key={contract}
              onClick={() => setFilter(contract)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === contract
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {contract} ({getFunctionsByContract(contract).length})
            </button>
          ))}
        </div>

        {!connected ? (
          <button
            onClick={connectWallet}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Connect Wallet to Interact
          </button>
        ) : (
          <div className="text-sm text-green-400">✅ Wallet Connected</div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {functions.map((func, index) => (
          <div
            key={index}
            className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-blue-500/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-white font-semibold">{func.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{func.contract}</p>
              </div>
              <a
                href={getExplorerUrl(func.address)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-xs"
              >
                View →
              </a>
            </div>

            <p className="text-sm text-gray-300 mb-3">{func.description}</p>

            <div className="mb-3">
              <p className="text-xs text-gray-400 mb-1">Parameters:</p>
              <div className="text-xs text-gray-300 font-mono">
                {func.parameters.length > 0 ? func.parameters.join(', ') : 'None'}
              </div>
            </div>

            <div className="text-xs text-gray-500 font-mono break-all">
              {func.address}
            </div>

            {connected && func.name.includes('view') && (
              <button
                onClick={() => {
                  setSelectedFunction(func);
                  // For view functions, you'd need to provide parameters
                  setResult('Click to call view function (parameters required)');
                }}
                className="mt-2 w-full px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors"
              >
                Call View Function
              </button>
            )}
          </div>
        ))}
      </div>

      {result && (
        <div className="mt-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
          <h3 className="text-white font-semibold mb-2">Result:</h3>
          <pre className="text-xs text-gray-300 overflow-auto">{result}</pre>
        </div>
      )}
    </div>
  );
}
