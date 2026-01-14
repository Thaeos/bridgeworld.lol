/**
 * ENS Configuration
 * θεός°•.eth Domain Configuration
 * Updated: 2026-01-14
 */

import contractsData from '../config/treasure-dao-contracts.json';

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

/**
 * Get ENS domain name
 */
export function getENSDomain(): string {
  return ENS_CONFIG.domain;
}

/**
 * Get ENS owner address
 */
export function getENSOwner(): string {
  return ENS_CONFIG.owner;
}

/**
 * Get ENS resolver address
 */
export function getENSResolver(): string {
  return ENS_CONFIG.resolver;
}

/**
 * Get ENS namehash (hex)
 */
export function getENSNamehashHex(): string {
  return ENS_CONFIG.namehash.hex;
}

/**
 * Get ENS namehash (decimal)
 */
export function getENSNamehashDecimal(): string {
  return ENS_CONFIG.namehash.decimal;
}

/**
 * Get complete ENS configuration
 */
export function getENSConfig() {
  return ENS_CONFIG;
}

/**
 * Verify ENS ownership
 */
export function verifyENSOwner(address: string): boolean {
  return address.toLowerCase() === ENS_CONFIG.owner.toLowerCase();
}

export default ENS_CONFIG;
