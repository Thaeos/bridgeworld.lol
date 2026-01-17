'use client';

import { useState, useEffect } from 'react';
import { getAllContracts, getContractsByLayer, type TreasureDAOContract } from '@/lib/treasure-dao-contracts';
import { getENSConfig } from '@/lib/ens-config';

export default function ContractRegistry() {
  const [contracts, setContracts] = useState<TreasureDAOContract[]>([]);
  const [filter, setFilter] = useState<'all' | 'Foundation' | 'Operational' | 'Governance'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let filtered = getAllContracts();
    
    if (filter !== 'all') {
      filtered = getContractsByLayer(filter);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(c => 
        c.contract_name.toLowerCase().includes(searchLower) ||
        c.glyph_name.toLowerCase().includes(searchLower) ||
        c.address.toLowerCase().includes(searchLower) ||
        c.function.toLowerCase().includes(searchLower)
      );
    }
    
    setContracts(filtered);
  }, [filter, search]);

  const getExplorerUrl = (address: string) => {
    return `https://arbitrum.blockscout.com/address/${address}`;
  };

  const getENSRecordUrl = (key: string) => {
    const ens = getENSConfig();
    return `https://app.ens.domains/name/${ens.domain}/details`;
  };

  return (
    <div className="contract-registry p-6 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-lg border border-indigo-500/30">
      <h2 className="text-3xl font-bold mb-6 text-white">TreasureDAO Contract Registry</h2>
      
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All ({getAllContracts().length})
          </button>
          <button
            onClick={() => setFilter('Foundation')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'Foundation'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Foundation ({getContractsByLayer('Foundation').length})
          </button>
          <button
            onClick={() => setFilter('Operational')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'Operational'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Operational ({getContractsByLayer('Operational').length})
          </button>
          <button
            onClick={() => setFilter('Governance')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'Governance'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Governance ({getContractsByLayer('Governance').length})
          </button>
        </div>

        <input
          type="text"
          placeholder="Search contracts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contracts.map((contract) => (
          <div
            key={contract.number}
            className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-purple-500/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{contract.glyph}</span>
                  <span className="text-lg font-semibold text-white">{contract.glyph_name}</span>
                </div>
                <p className="text-sm text-gray-400">#{contract.number}</p>
              </div>
              {contract.verified && (
                <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded">
                  Verified
                </span>
              )}
            </div>

            <h3 className="text-white font-semibold mb-2">{contract.contract_name}</h3>
            <p className="text-sm text-gray-300 mb-3">{contract.function}</p>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-gray-400">Type:</span>
                <span className="text-white ml-2">{contract.contract_type}</span>
              </div>
              <div>
                <span className="text-gray-400">Layer:</span>
                <span className="text-white ml-2">{contract.layer}</span>
              </div>
              <div>
                <span className="text-gray-400">Identity:</span>
                <span className="text-white ml-2 font-mono">{contract.identity}</span>
              </div>
              <div>
                <span className="text-gray-400">ENS Record:</span>
                <span className="text-white ml-2 font-mono text-xs">{contract.ens_text_record}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700 space-y-2">
              <a
                href={getExplorerUrl(contract.address)}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
              >
                View on BlockScout
              </a>
              <a
                href={getENSRecordUrl(contract.ens_text_record)}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors"
              >
                View ENS Record
              </a>
            </div>

            <div className="mt-2">
              <p className="text-xs text-gray-500 font-mono break-all">
                {contract.address}
              </p>
            </div>
          </div>
        ))}
      </div>

      {contracts.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No contracts found matching your search.
        </div>
      )}
    </div>
  );
}
