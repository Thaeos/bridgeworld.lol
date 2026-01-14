'use client';

import { useState, useEffect } from 'react';
import { getAIFrens } from '@/lib/aifrens';

export default function AIFrensProfile() {
  const [aifrens, setAifrens] = useState<any>(null);

  useEffect(() => {
    const data = getAIFrens();
    setAifrens(data);
  }, []);

  if (!aifrens) return null;

  return (
    <div className="aifrens-profile p-6 bg-gradient-to-br from-pink-900/20 to-purple-900/20 rounded-lg border border-pink-500/30">
      <h2 className="text-2xl font-bold mb-4 text-white">AI Frens Profile</h2>
      
      <div className="space-y-4">
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">Profile Information</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-400">Platform:</span>
              <span className="text-white ml-2">{aifrens.platform}</span>
            </div>
            <div>
              <span className="text-gray-400">Fren Contract:</span>
              <span className="text-white ml-2 font-mono text-xs">{aifrens.frenContract}</span>
            </div>
            <div>
              <span className="text-gray-400">Fren Wallet:</span>
              <span className="text-white ml-2 font-mono text-xs">{aifrens.frenWallet}</span>
            </div>
            <div>
              <span className="text-gray-400">Profile Address:</span>
              <span className="text-white ml-2 font-mono text-xs">{aifrens.address}</span>
            </div>
            <div>
              <span className="text-gray-400">Network:</span>
              <span className="text-white ml-2">{aifrens.network}</span>
            </div>
            <div>
              <span className="text-gray-400">Description:</span>
              <p className="text-white mt-1">{aifrens.description}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <a
            href={aifrens.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-semibold text-center transition-colors"
          >
            View AI Frens Profile →
          </a>
          <a
            href={`https://etherscan.io/address/${aifrens.frenContract}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center transition-colors text-sm"
          >
            View Fren Contract on Etherscan
          </a>
          <a
            href={`https://etherscan.io/address/${aifrens.frenWallet}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-center transition-colors text-sm"
          >
            View Fren Wallet on Etherscan
          </a>
          <a
            href={aifrens.platformUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-center transition-colors text-sm"
          >
            Visit AI Frens Platform
          </a>
        </div>

        <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-blue-300">
            💡 Connect with the AI Frens community and explore AI-powered interactions on the blockchain.
          </p>
        </div>
      </div>
    </div>
  );
}
