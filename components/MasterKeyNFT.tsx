'use client';

import { useState, useEffect } from 'react';
import { MASTER_KEY_NFT } from '@/lib/treasure-dao-contracts';

export default function MasterKeyNFT() {
  const [nft, setNft] = useState<any>(null);

  useEffect(() => {
    setNft(MASTER_KEY_NFT);
  }, []);

  if (!nft) return null;

  return (
    <div className="master-key-nft p-6 bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-lg border border-amber-500/30">
      <h2 className="text-2xl font-bold mb-4 text-white">Master Key NFT</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">NFT Details</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-400">Name:</span>
                <span className="text-white ml-2">{nft.name}</span>
              </div>
              <div>
                <span className="text-gray-400">Description:</span>
                <p className="text-white mt-1">{nft.description}</p>
              </div>
              <div>
                <span className="text-gray-400">Network:</span>
                <span className="text-white ml-2">{nft.network}</span>
              </div>
              <div>
                <span className="text-gray-400">Marketplace:</span>
                <span className="text-white ml-2">{nft.marketplace}</span>
              </div>
              <div>
                <span className="text-gray-400">Recipient:</span>
                <span className="text-white ml-2 font-mono text-xs">{nft.recipient_address}</span>
              </div>
            </div>
          </div>

          {nft.ipfs_cid && (
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-3">IPFS</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-400">CID:</span>
                  <span className="text-white ml-2 font-mono text-xs break-all">{nft.ipfs_cid}</span>
                </div>
                <a
                  href={`https://ipfs.io/ipfs/${nft.ipfs_cid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-2 text-blue-400 hover:text-blue-300 underline"
                >
                  View on IPFS
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">Metadata</h3>
            <div className="space-y-2 text-sm">
              {nft.attributes && nft.attributes.map((attr: any, index: number) => (
                <div key={index}>
                  <span className="text-gray-400">{attr.trait_type}:</span>
                  <span className="text-white ml-2">{attr.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">Links</h3>
            <div className="space-y-2">
              {nft.marketplace_url && (
                <a
                  href={nft.marketplace_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded text-center transition-colors"
                >
                  View on {nft.marketplace}
                </a>
              )}
              {nft.explorer_url && (
                <a
                  href={nft.explorer_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-center transition-colors"
                >
                  View on Explorer
                </a>
              )}
            </div>
          </div>

          {nft.ens_name && (
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-3">ENS</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-400">ENS Name:</span>
                  <span className="text-white ml-2">{nft.ens_name}</span>
                </div>
                <a
                  href={`https://app.ens.domains/name/${nft.ens_name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-2 text-blue-400 hover:text-blue-300 underline"
                >
                  View on ENS
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
