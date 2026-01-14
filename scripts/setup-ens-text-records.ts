/**
 * ENS Text Records Setup Script
 * Sets text records for all 22 TreasureDAO contracts on θεός°•.eth
 * 
 * Usage:
 *   npx ts-node scripts/setup-ens-text-records.ts
 * 
 * Requires:
 *   - Wallet connected to Ethereum Mainnet
 *   - ENS domain ownership
 *   - Resolver configured
 */

import { ethers } from 'ethers';
import { getAllContracts, getENSTextRecord } from '../lib/treasure-dao-contracts';
import { getENSResolver, getENSNamehashHex, getENSOwner } from '../lib/ens-config';

const RESOLVER_ABI = [
  'function setText(bytes32 node, string calldata key, string calldata value) external',
  'function text(bytes32 node, string calldata key) external view returns (string memory)',
  'function setAddr(bytes32 node, address a) external'
];

interface TextRecord {
  key: string;
  value: string;
  contract: string;
  glyph: string;
}

/**
 * Generate all text records for 22 contracts
 */
export function generateTextRecords(): TextRecord[] {
  const contracts = getAllContracts();
  const records: TextRecord[] = [];

  contracts.forEach(contract => {
    // Contract address record
    records.push({
      key: `${contract.glyph_name.toLowerCase()}_contract`,
      value: contract.address,
      contract: contract.contract_name,
      glyph: contract.glyph
    });

    // Glyph record
    records.push({
      key: `${contract.glyph_name.toLowerCase()}_glyph`,
      value: contract.glyph,
      contract: contract.contract_name,
      glyph: contract.glyph
    });

    // Identity record
    records.push({
      key: `${contract.glyph_name.toLowerCase()}_identity`,
      value: contract.identity,
      contract: contract.contract_name,
      glyph: contract.glyph
    });

    // Function record
    records.push({
      key: `${contract.glyph_name.toLowerCase()}_function`,
      value: contract.function,
      contract: contract.contract_name,
      glyph: contract.glyph
    });
  });

  return records;
}

/**
 * Set a single text record
 */
export async function setTextRecord(
  signer: ethers.Signer,
  key: string,
  value: string
): Promise<ethers.ContractTransaction> {
  const resolverAddress = getENSResolver();
  const namehash = getENSNamehashHex();

  const resolver = new ethers.Contract(
    resolverAddress,
    RESOLVER_ABI,
    signer
  );

  const tx = await resolver.setText(namehash, key, value);
  return tx;
}

/**
 * Set all text records (batch)
 */
export async function setAllTextRecords(
  signer: ethers.Signer,
  records: TextRecord[]
): Promise<ethers.ContractTransaction[]> {
  const resolverAddress = getENSResolver();
  const namehash = getENSNamehashHex();

  const resolver = new ethers.Contract(
    resolverAddress,
    RESOLVER_ABI,
    signer
  );

  const transactions: ethers.ContractTransaction[] = [];

  for (const record of records) {
    console.log(`Setting ${record.key} = ${record.value}`);
    const tx = await resolver.setText(namehash, record.key, record.value);
    transactions.push(tx);
    await tx.wait(); // Wait for each transaction
  }

  return transactions;
}

/**
 * Read a text record
 */
export async function getTextRecord(
  provider: ethers.Provider,
  key: string
): Promise<string> {
  const resolverAddress = getENSResolver();
  const namehash = getENSNamehashHex();

  const resolver = new ethers.Contract(
    resolverAddress,
    RESOLVER_ABI,
    provider
  );

  return await resolver.text(namehash, key);
}

/**
 * Verify all text records are set correctly
 */
export async function verifyTextRecords(
  provider: ethers.Provider
): Promise<{ key: string; expected: string; actual: string; match: boolean }[]> {
  const records = generateTextRecords();
  const results = [];

  for (const record of records) {
    try {
      const actual = await getTextRecord(provider, record.key);
      results.push({
        key: record.key,
        expected: record.value,
        actual,
        match: actual.toLowerCase() === record.value.toLowerCase()
      });
    } catch (error) {
      results.push({
        key: record.key,
        expected: record.value,
        actual: 'ERROR',
        match: false
      });
    }
  }

  return results;
}

// CLI execution
if (require.main === module) {
  const records = generateTextRecords();
  console.log('='.repeat(80));
  console.log('ENS TEXT RECORDS SETUP');
  console.log('='.repeat(80));
  console.log(`\nTotal records to set: ${records.length}`);
  console.log(`Contracts: ${getAllContracts().length}`);
  console.log(`\nRecords:`);
  records.forEach((record, index) => {
    console.log(`  ${index + 1}. ${record.key} = ${record.value} (${record.contract})`);
  });
  console.log('\nTo execute, connect a wallet and call setAllTextRecords()');
}

export default {
  generateTextRecords,
  setTextRecord,
  setAllTextRecords,
  getTextRecord,
  verifyTextRecords
};
