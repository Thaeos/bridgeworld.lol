'use client';

import ContractRegistry from '@/components/ContractRegistry';
import ENSManager from '@/components/ENSManager';
import TreasureDAOFunctions from '@/components/TreasureDAOFunctions';

export default function ContractsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">TreasureDAO Contracts</h1>
          <p className="text-gray-400">22 Contracts • Aramaic Glyphs • ENS Integration • Functions</p>
        </div>

        <ENSManager />
        <TreasureDAOFunctions />
        <ContractRegistry />
      </div>
    </main>
  );
}
