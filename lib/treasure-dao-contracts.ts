/**
 * 22 TreasureDAO Contracts - Complete Registry
 * Mapped to Aramaic Glyphs (Aleph through Taw)
 * Updated: 2026-01-14
 */

import contractsData from '../config/treasure-dao-contracts.json';

export interface TreasureDAOContract {
  number: number;
  glyph: string;
  glyph_name: string;
  contract_name: string;
  contract_type: string;
  address: string;
  identity: string;
  function: string;
  layer: 'Foundation' | 'Operational' | 'Governance';
  ens_text_record: string;
  verified?: boolean;
}

export const TREASURE_DAO_CONTRACTS = contractsData.contracts as TreasureDAOContract[];

export const ENS_CONFIG = {
  domain: contractsData.ens_domain.name,
  owner: contractsData.ens_domain.owner_address,
  registry: contractsData.ens_domain.registry_address,
  resolver: contractsData.ens_domain.resolver_address,
  namehash: {
    hex: contractsData.ens_domain.namehash_hex,
    decimal: contractsData.ens_domain.namehash_decimal
  },
  network: contractsData.ens_domain.network,
  chainId: contractsData.ens_domain.chain_id
};

export const CLOUDFLARE_CONFIG = {
  domain: contractsData.cloudflare_domain.domain,
  url: contractsData.cloudflare_domain.url,
  provider: contractsData.cloudflare_domain.provider,
  owner: contractsData.cloudflare_domain.owner_address
};

export const MASTER_KEY_NFT = contractsData.master_key_nft;
export const X402_CONTRACT = contractsData.x402_contract;
export const ETHERMAIL = contractsData.ethermail;

/**
 * Get contract by glyph
 */
export function getContractByGlyph(glyph: string): TreasureDAOContract | undefined {
  return TREASURE_DAO_CONTRACTS.find(c => c.glyph === glyph);
}

/**
 * Get contract by number (1-22)
 */
export function getContractByNumber(number: number): TreasureDAOContract | undefined {
  return TREASURE_DAO_CONTRACTS.find(c => c.number === number);
}

/**
 * Get contract by address
 */
export function getContractByAddress(address: string): TreasureDAOContract | undefined {
  return TREASURE_DAO_CONTRACTS.find(c => 
    c.address.toLowerCase() === address.toLowerCase()
  );
}

/**
 * Get all verified contracts
 */
export function getVerifiedContracts(): TreasureDAOContract[] {
  return TREASURE_DAO_CONTRACTS.filter(c => c.verified === true);
}

/**
 * Get contracts by layer
 */
export function getContractsByLayer(layer: 'Foundation' | 'Operational' | 'Governance'): TreasureDAOContract[] {
  return TREASURE_DAO_CONTRACTS.filter(c => c.layer === layer);
}

/**
 * Get ENS text record key for contract
 */
export function getENSTextRecord(contract: TreasureDAOContract): string {
  return contract.ens_text_record;
}

/**
 * Get all contracts
 */
export function getAllContracts(): TreasureDAOContract[] {
  return TREASURE_DAO_CONTRACTS;
}

export default {
  contracts: TREASURE_DAO_CONTRACTS,
  ens: ENS_CONFIG,
  cloudflare: CLOUDFLARE_CONFIG,
  masterKey: MASTER_KEY_NFT,
  x402: X402_CONTRACT,
  ethermail: ETHERMAIL,
  getContractByGlyph,
  getContractByNumber,
  getContractByAddress,
  getVerifiedContracts,
  getContractsByLayer,
  getENSTextRecord,
  getAllContracts
};
