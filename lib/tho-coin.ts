/**
 * THO Coin - .x402 Contract
 * Base Network Token
 * Updated: 2026-01-14
 */

import contractsData from '../config/treasure-dao-contracts.json';

export const THO_COIN = {
  contract: contractsData.x402_contract.contract_address,
  coin: contractsData.x402_contract.coin_address,
  ticker: contractsData.x402_contract.ticker,
  name: contractsData.x402_contract.name || 'THO Coin',
  creator: contractsData.x402_contract.creator_address,
  owner: contractsData.x402_contract.owner,
  network: contractsData.x402_contract.network,
  chainId: contractsData.x402_contract.chain_id,
  pool: {
    address: contractsData.x402_contract.pool_address,
    url: contractsData.x402_contract.pool_url
  },
  explorer: contractsData.x402_contract.explorer,
  status: contractsData.x402_contract.status || 'active'
};

/**
 * Get THO coin information
 */
export function getTHOCoin() {
  return THO_COIN;
}

/**
 * Get THO contract address
 */
export function getTHOContract(): string {
  return THO_COIN.contract;
}

/**
 * Get THO pool information
 */
export function getTHOPool() {
  return THO_COIN.pool;
}

/**
 * Get THO explorer link
 */
export function getTHOExplorer(): string {
  return THO_COIN.explorer;
}

/**
 * Verify THO ownership
 */
export function verifyTHOOwner(address: string): boolean {
  return address.toLowerCase() === THO_COIN.creator.toLowerCase() ||
         address.toLowerCase() === THO_COIN.owner.toLowerCase();
}

export default THO_COIN;
