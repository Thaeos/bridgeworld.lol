'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ethers } from 'ethers';

interface StakingStats {
  magicBalance: string;
  stakedAmount: string;
  stMagicBalance: string;
  pendingRewards: string;
  apy: string;
  totalStaked: string;
}

interface StakingUIProps {
  walletAddress?: string;
}

export default function StakingUI({ walletAddress }: StakingUIProps) {
  const [activeTab, setActiveTab] = useState<'stake' | 'unstake' | 'rewards'>('stake');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<StakingStats>({
    magicBalance: '0',
    stakedAmount: '0',
    stMagicBalance: '0',
    pendingRewards: '0',
    apy: '12.5', // Placeholder APY
    totalStaked: '0',
  });

  // Placeholder for EigenLayer staking status
  const [eigenLayerStatus, setEigenLayerStatus] = useState({
    active: false,
    message: 'EigenLayer AVS staking coming Q1 2025 (TIP-42)',
  });

  // Mage AI Launchpool status
  const [mageStatus, setMageStatus] = useState({
    active: true,
    manaPooled: '0',
    computeRewards: '0',
  });

  const handleStake = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setIsLoading(true);
    
    try {
      // TODO: Implement actual staking logic when contracts are deployed
      // const provider = new ethers.BrowserProvider(window.ethereum);
      // const signer = await provider.getSigner();
      // const stakingContract = new ethers.Contract(STAKING_ADDRESS, STAKING_ABI, signer);
      // const tx = await stakingContract.stake(ethers.parseEther(amount));
      // await tx.wait();
      
      console.log(`Staking ${amount} MAGIC...`);
      
      // Simulate success
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAmount('');
    } catch (error) {
      console.error('Staking failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnstake = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setIsLoading(true);
    
    try {
      // TODO: Implement actual unstaking logic
      console.log(`Unstaking ${amount} stMAGIC...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAmount('');
    } catch (error) {
      console.error('Unstaking failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimRewards = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement reward claiming
      console.log('Claiming rewards...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('Claim failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
          MAGIC Staking
        </h2>
        <p className="text-gray-400 mt-2">
          Stake MAGIC for stMAGIC and earn rewards via EigenLayer AVS
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Your MAGIC" value={stats.magicBalance} />
        <StatCard label="Staked" value={stats.stakedAmount} />
        <StatCard label="stMAGIC" value={stats.stMagicBalance} />
        <StatCard label="APY" value={`${stats.apy}%`} highlight />
      </div>

      {/* EigenLayer Status Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`mb-6 p-4 rounded-lg border ${
          eigenLayerStatus.active 
            ? 'bg-green-500/10 border-green-500/30' 
            : 'bg-yellow-500/10 border-yellow-500/30'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${eigenLayerStatus.active ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`} />
          <span className="text-sm">
            <strong>EigenLayer AVS:</strong> {eigenLayerStatus.message}
          </span>
        </div>
      </motion.div>

      {/* Mage AI Launchpool */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6 p-4 rounded-lg bg-purple-500/10 border border-purple-500/30"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧙</span>
            <div>
              <strong className="text-purple-400">Mage AI Launchpool</strong>
              <p className="text-xs text-gray-400">Pool MAGIC as mana for AI compute rewards</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Mana Pooled</div>
            <div className="font-mono text-purple-400">{mageStatus.manaPooled} MAGIC</div>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        {(['stake', 'unstake', 'rewards'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === tab
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
        >
          {activeTab === 'stake' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Amount to Stake</label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-xl font-mono focus:outline-none focus:border-purple-500"
                  />
                  <button
                    onClick={() => setAmount(stats.magicBalance)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-purple-400 hover:text-purple-300"
                  >
                    MAX
                  </button>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>Available: {stats.magicBalance} MAGIC</span>
                  <span>You will receive: {amount || '0'} stMAGIC</span>
                </div>
              </div>
              
              <button
                onClick={handleStake}
                disabled={isLoading || !amount}
                className="w-full py-4 rounded-lg font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⟳</span> Staking...
                  </span>
                ) : (
                  'Stake MAGIC → stMAGIC'
                )}
              </button>
              
              <p className="text-xs text-gray-500 text-center">
                Staking locks your MAGIC and mints stMAGIC at 1:1 ratio. 
                Rewards accrue from EigenLayer AVS validation.
              </p>
            </div>
          )}

          {activeTab === 'unstake' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Amount to Unstake</label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-xl font-mono focus:outline-none focus:border-purple-500"
                  />
                  <button
                    onClick={() => setAmount(stats.stMagicBalance)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-purple-400 hover:text-purple-300"
                  >
                    MAX
                  </button>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>Staked: {stats.stMagicBalance} stMAGIC</span>
                  <span>Cooldown: 7 days</span>
                </div>
              </div>
              
              <button
                onClick={handleUnstake}
                disabled={isLoading || !amount}
                className="w-full py-4 rounded-lg font-bold text-lg bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⟳</span> Unstaking...
                  </span>
                ) : (
                  'Unstake stMAGIC → MAGIC'
                )}
              </button>
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="space-y-6">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Pending Rewards</span>
                  <span className="text-2xl font-bold text-green-400">
                    {stats.pendingRewards} MAGIC
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400">From EigenLayer</div>
                  <div className="text-lg font-mono">0 MAGIC</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400">From Mage Pool</div>
                  <div className="text-lg font-mono">{mageStatus.computeRewards} MAGIC</div>
                </div>
              </div>
              
              <button
                onClick={handleClaimRewards}
                disabled={isLoading || parseFloat(stats.pendingRewards) <= 0}
                className="w-full py-4 rounded-lg font-bold text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⟳</span> Claiming...
                  </span>
                ) : (
                  'Claim All Rewards'
                )}
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Network Info */}
      <div className="mt-6 text-center text-xs text-gray-500">
        <p>Connected to Treasure Chain (ID: 61166) | <a href="https://treasurescan.io" target="_blank" rel="noopener" className="text-purple-400 hover:underline">Explorer</a></p>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-4 rounded-lg ${
        highlight 
          ? 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30' 
          : 'bg-gray-900/50 border border-gray-800'
      }`}
    >
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div className={`text-lg font-bold font-mono ${highlight ? 'text-green-400' : 'text-white'}`}>
        {value}
      </div>
    </motion.div>
  );
}
