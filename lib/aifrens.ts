/**
 * AI Frens Profile Configuration
 * Updated: 2026-01-14
 */

import contractsData from '../config/treasure-dao-contracts.json';

export const AIFRENS = {
  platform: contractsData.aifrens.platform,
  platformUrl: contractsData.aifrens.platform_url,
  profileUrl: contractsData.aifrens.profile_url,
  frenContract: contractsData.aifrens.fren_contract,
  frenWallet: contractsData.aifrens.fren_wallet,
  address: contractsData.aifrens.address,
  network: contractsData.aifrens.network,
  chainId: contractsData.aifrens.chain_id,
  description: contractsData.aifrens.description
};

/**
 * Get AI Frens profile URL
 */
export function getAIFrensProfileUrl(): string {
  return AIFRENS.profileUrl;
}

/**
 * Get AI Frens address
 */
export function getAIFrensAddress(): string {
  return AIFRENS.address;
}

/**
 * Get complete AI Frens configuration
 */
export function getAIFrens() {
  return AIFRENS;
}

export default AIFRENS;
