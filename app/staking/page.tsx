'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StakingUI from '@/components/StakingUI';
import Navigation from '@/components/Navigation';

export default function StakingPage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      alert('Please install MetaMask or another Web3 wallet');
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    // Check if already connected
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      });
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Stake MAGIC
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Earn rewards through EigenLayer AVS validation and Mage AI compute pools.
            Secure the Treasure Chain ecosystem while growing your holdings.
          </p>
        </motion.div>

        {/* TIP-42 Info Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mb-8 p-6 rounded-xl bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20"
        >
          <div className="flex items-start gap-4">
            <span className="text-4xl">📜</span>
            <div>
              <h3 className="text-lg font-bold text-purple-300">TIP-42 Passed</h3>
              <p className="text-gray-400 text-sm mt-1">
                Bridgeworld emissions have been reallocated to Treasure Chain EigenLayer staking 
                and Bridgeworld v2 transition. Stake your MAGIC to earn from the new reward structure.
              </p>
              <a 
                href="https://forum.treasure.lol/discussion/24254-tip42-reallocating-bridgeworld-emissions-to-treasure-chain-eigenlayer-staking-and-transition-to-bridgeworld-v2"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 text-sm mt-2 inline-block"
              >
                Read the full proposal →
              </a>
            </div>
          </div>
        </motion.div>

        {/* Wallet Connection / Staking UI */}
        {walletAddress ? (
          <StakingUI walletAddress={walletAddress} />
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border border-gray-800">
              <div className="text-6xl mb-4">🔗</div>
              <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
              <p className="text-gray-400 mb-6">
                Connect your wallet to view your MAGIC balance and start staking.
              </p>
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="w-full py-4 rounded-lg font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 transition-all"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto mt-16 grid md:grid-cols-3 gap-6"
        >
          <FeatureCard
            icon="🛡️"
            title="EigenLayer AVS"
            description="Secure the network through restaking. Your MAGIC helps validate Treasure Chain."
            status="Coming Q1 2025"
          />
          <FeatureCard
            icon="🧙"
            title="Mage Launchpool"
            description="Pool MAGIC as mana to power AI agents and earn compute rewards."
            status="Active"
          />
          <FeatureCard
            icon="🌉"
            title="Hyperlane Bridge"
            description="Seamlessly bridge assets between Arbitrum and Treasure Chain."
            status="Active"
          />
        </motion.div>

        {/* Network Info */}
        <div className="text-center mt-16 text-sm text-gray-500">
          <p>
            Treasure Chain (ID: 61166) | 
            <a href="https://treasurescan.io" target="_blank" rel="noopener" className="text-purple-400 hover:underline ml-1">
              Explorer
            </a> | 
            <a href="https://docs.treasure.lol" target="_blank" rel="noopener" className="text-purple-400 hover:underline ml-1">
              Docs
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  status 
}: { 
  icon: string; 
  title: string; 
  description: string; 
  status: string;
}) {
  const isActive = status === 'Active';
  
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:border-purple-500/30 transition-colors">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      <span className={`text-xs px-2 py-1 rounded-full ${
        isActive 
          ? 'bg-green-500/20 text-green-400' 
          : 'bg-yellow-500/20 text-yellow-400'
      }`}>
        {status}
      </span>
    </div>
  );
}
