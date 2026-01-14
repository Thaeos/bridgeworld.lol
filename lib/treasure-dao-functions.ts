/**
 * Treasure DAO Functions Library
 * Access to 10 key Treasure DAO contract functions
 * Updated: 2026-01-14
 */

import functionsData from '../config/treasure-dao-functions.json';

export interface TreasureDAOFunction {
  name: string;
  contract: string;
  address: string;
  description: string;
  parameters: string[];
}

export const TREASURE_DAO_FUNCTIONS = functionsData.treasure_dao_functions as TreasureDAOFunction[];

/**
 * Get function by name
 */
export function getFunctionByName(name: string): TreasureDAOFunction | undefined {
  return TREASURE_DAO_FUNCTIONS.find(f => f.name.toLowerCase() === name.toLowerCase());
}

/**
 * Get functions by contract
 */
export function getFunctionsByContract(contract: string): TreasureDAOFunction[] {
  return TREASURE_DAO_FUNCTIONS.filter(f => 
    f.contract.toLowerCase() === contract.toLowerCase()
  );
}

/**
 * Get all functions
 */
export function getAllFunctions(): TreasureDAOFunction[] {
  return TREASURE_DAO_FUNCTIONS;
}

/**
 * Get Magic contract functions
 */
export function getMagicFunctions(): TreasureDAOFunction[] {
  return getFunctionsByContract('Magic');
}

/**
 * Get MagicClaim contract functions
 */
export function getMagicClaimFunctions(): TreasureDAOFunction[] {
  return getFunctionsByContract('MagicClaim');
}

export default {
  functions: TREASURE_DAO_FUNCTIONS,
  getFunctionByName,
  getFunctionsByContract,
  getAllFunctions,
  getMagicFunctions,
  getMagicClaimFunctions
};
