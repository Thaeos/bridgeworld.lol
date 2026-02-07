// TreasureMarketplace contract integration
import { type Address } from 'viem';

// Arbitrum Mainnet TreasureMarketplace address
export const TREASURE_MARKETPLACE_ADDRESS = '0x09986B4e255B3c548041a30A2Ee312Fe176731c2' as const;

// MAGIC token on Arbitrum
export const MAGIC_ADDRESS = '0x539bdE0d7Dbd336b79148AA742883198BBF60342' as const;

export const TREASURE_MARKETPLACE_ABI = [
  {
    "inputs": [
      {
        "components": [
          { "internalType": "address", "name": "nftAddress", "type": "address" },
          { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
          { "internalType": "address", "name": "owner", "type": "address" },
          { "internalType": "uint64", "name": "quantity", "type": "uint64" },
          { "internalType": "uint128", "name": "maxPricePerItem", "type": "uint128" },
          { "internalType": "address", "name": "paymentToken", "type": "address" },
          { "internalType": "bool", "name": "usingEth", "type": "bool" }
        ],
        "internalType": "struct BuyItemParams[]",
        "name": "_buyItemParams",
        "type": "tuple[]"
      }
    ],
    "name": "buyItems",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_nftAddress", "type": "address" },
      { "internalType": "uint256", "name": "_tokenId", "type": "uint256" }
    ],
    "name": "cancelListing",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_nftAddress", "type": "address" },
      { "internalType": "uint256", "name": "_tokenId", "type": "uint256" },
      { "internalType": "uint64", "name": "_quantity", "type": "uint64" },
      { "internalType": "uint128", "name": "_pricePerItem", "type": "uint128" },
      { "internalType": "uint64", "name": "_expirationTime", "type": "uint64" },
      { "internalType": "address", "name": "_paymentToken", "type": "address" }
    ],
    "name": "createListing",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_nftAddress", "type": "address" },
      { "internalType": "uint256", "name": "_tokenId", "type": "uint256" },
      { "internalType": "uint64", "name": "_newQuantity", "type": "uint64" },
      { "internalType": "uint128", "name": "_newPricePerItem", "type": "uint128" },
      { "internalType": "uint64", "name": "_newExpirationTime", "type": "uint64" },
      { "internalType": "address", "name": "_paymentToken", "type": "address" }
    ],
    "name": "updateListing",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "", "type": "address" },
      { "internalType": "uint256", "name": "", "type": "uint256" },
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "name": "listings",
    "outputs": [
      { "internalType": "uint64", "name": "quantity", "type": "uint64" },
      { "internalType": "uint128", "name": "pricePerItem", "type": "uint128" },
      { "internalType": "uint64", "name": "expirationTime", "type": "uint64" },
      { "internalType": "address", "name": "paymentTokenAddress", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// ERC20 ABI for MAGIC token approval
export const ERC20_ABI = [
  {
    "inputs": [
      { "name": "spender", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "owner", "type": "address" },
      { "name": "spender", "type": "address" }
    ],
    "name": "allowance",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Types for marketplace operations
export interface BuyItemParams {
  nftAddress: Address;
  tokenId: bigint;
  owner: Address;
  quantity: bigint;
  maxPricePerItem: bigint;
  paymentToken: Address;
  usingEth: boolean;
}

export interface Listing {
  quantity: bigint;
  pricePerItem: bigint;
  expirationTime: bigint;
  paymentTokenAddress: Address;
}

// Brave wallet specific utilities
export const requestBraveWalletPermissions = async () => {
  if (typeof window === 'undefined') return false;
  const ethereum = (window as any).ethereum;
  if (!ethereum?.isBraveWallet) return false;
  
  try {
    await ethereum.request({ method: 'eth_requestAccounts' });
    return true;
  } catch (error) {
    console.error('Failed to connect Brave wallet:', error);
    return false;
  }
};
