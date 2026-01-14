/**
 * THO Coin Usage Examples
 * 
 * This file demonstrates how to use the THO coin library
 * in your React components and pages.
 */

import { getTHOCoin, getTHOPool, getTHOExplorer, verifyTHOOwner } from '@/lib/tho-coin';

// Example 1: Basic usage
export function BasicTHOExample() {
  const tho = getTHOCoin();
  
  console.log(tho.ticker); // THO
  console.log(tho.contract); // 0x233f3956d82bfea9E78B2BdB0a9D245193881870
  
  return (
    <div>
      <h2>{tho.ticker} Coin</h2>
      <p>Contract: {tho.contract}</p>
      <p>Network: {tho.network}</p>
    </div>
  );
}

// Example 2: Get pool information
export function THOPoolExample() {
  const pool = getTHOPool();
  
  return (
    <div>
      <h3>Liquidity Pool</h3>
      <p>Address: {pool.address}</p>
      <a href={pool.url} target="_blank" rel="noopener noreferrer">
        View on DEX Screener
      </a>
    </div>
  );
}

// Example 3: Verify ownership
export function THOOwnershipExample({ address }: { address: string }) {
  const isOwner = verifyTHOOwner(address);
  const tho = getTHOCoin();
  
  return (
    <div>
      {isOwner ? (
        <p>✅ You are the owner/creator of {tho.ticker}</p>
      ) : (
        <p>❌ Address does not match {tho.ticker} owner</p>
      )}
    </div>
  );
}

// Example 4: Get explorer link
export function THOExplorerExample() {
  const explorer = getTHOExplorer();
  const tho = getTHOCoin();
  
  return (
    <a href={explorer} target="_blank" rel="noopener noreferrer">
      View {tho.ticker} on Base Explorer
    </a>
  );
}

// Example 5: Complete component
export function CompleteTHOExample() {
  const tho = getTHOCoin();
  const pool = getTHOPool();
  const explorer = getTHOExplorer();
  
  return (
    <div className="tho-coin-card">
      <h2>🪙 {tho.name}</h2>
      <div className="info">
        <p><strong>Ticker:</strong> {tho.ticker}</p>
        <p><strong>Contract:</strong> {tho.contract}</p>
        <p><strong>Network:</strong> {tho.network} (Chain ID: {tho.chainId})</p>
        <p><strong>Status:</strong> {tho.status}</p>
      </div>
      <div className="pool">
        <h3>Liquidity Pool</h3>
        <p>{pool.address}</p>
        <a href={pool.url}>View Pool</a>
      </div>
      <div className="links">
        <a href={explorer}>View on Explorer</a>
      </div>
    </div>
  );
}

// Example 6: Using in a page
export default function THOPageExample() {
  const tho = getTHOCoin();
  
  return (
    <div>
      <h1>{tho.name}</h1>
      <p>Contract: {tho.contract}</p>
      <p>Network: {tho.network}</p>
      <p>Ticker: {tho.ticker}</p>
    </div>
  );
}
