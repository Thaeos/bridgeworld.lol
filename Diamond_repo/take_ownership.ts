/**
 * Take Ownership Script using MetaMask SDK
 * Attempts to transfer ownership of diamond contract
 * 
 * WARNING: Only use this if you are authorized to take ownership!
 */

import { MetaMaskSDK, MetaMaskSDKOptions } from '@metamask/sdk';

// Contract address
const DIAMOND_ADDRESS = process.argv[2] || '0xf7993A8df974AD022647E63402d6315137c58ABf';
const CHAIN_ID = 137; // Polygon

// Common ownership function selectors
const OWNER_SELECTOR = '0x8da5cb5b'; // owner()
const TRANSFER_OWNERSHIP_SELECTOR = '0xf2fde38b'; // transferOwnership(address)
const RENOUNCE_OWNERSHIP_SELECTOR = '0x715018a6'; // renounceOwnership()
const PENDING_OWNER_SELECTOR = '0xe30c3978'; // pendingOwner() (for 2-step transfers)

// AccessControl selectors
const HAS_ROLE_SELECTOR = '0x91d14854'; // hasRole(bytes32,address)
const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';
const GRANT_ROLE_SELECTOR = '0x2f2ff15d'; // grantRole(bytes32,address)

const options: MetaMaskSDKOptions = {
  shouldShimWeb3: false,
  dappMetadata: {
    name: 'Diamond Ownership Transfer',
    url: 'http://localhost',
  },
  checkInstallationImmediately: false,
};

const sdk = new MetaMaskSDK(options);

/**
 * Get function selector from signature (keccak256 first 4 bytes)
 * For demo purposes - in production use proper keccak256
 */
function getSelector(signature: string): string {
  // These are pre-computed selectors
  const selectors: Record<string, string> = {
    'owner()': '0x8da5cb5b',
    'transferOwnership(address)': '0xf2fde38b',
    'renounceOwnership()': '0x715018a6',
    'pendingOwner()': '0xe30c3978',
    'acceptOwnership()': '0x79ba5097',
    'hasRole(bytes32,address)': '0x91d14854',
    'grantRole(bytes32,address)': '0x2f2ff15d',
  };
  return selectors[signature] || '0x00000000';
}

/**
 * Encode address for function call
 */
function encodeAddress(address: string): string {
  // Remove 0x prefix and pad to 64 characters
  const addr = address.startsWith('0x') ? address.slice(2) : address;
  return addr.toLowerCase().padStart(64, '0');
}

/**
 * Get current owner of contract
 */
async function getOwner(provider: any, address: string): Promise<string | null> {
  try {
    const result = await provider.request({
      method: 'eth_call',
      params: [{
        to: address,
        data: OWNER_SELECTOR,
      }, 'latest'],
    });
    
    if (result && result !== '0x' && result.length >= 66) {
      // Decode address (last 40 chars after 0x)
      const ownerAddress = '0x' + result.slice(-40);
      return ownerAddress;
    }
    return null;
  } catch (error: any) {
    // Function might not exist
    return null;
  }
}

/**
 * Check if address has admin role
 */
async function hasAdminRole(provider: any, contractAddress: string, userAddress: string): Promise<boolean> {
  try {
    const data = HAS_ROLE_SELECTOR + DEFAULT_ADMIN_ROLE + encodeAddress(userAddress);
    const result = await provider.request({
      method: 'eth_call',
      params: [{
        to: contractAddress,
        data: data,
      }, 'latest'],
    });
    
    // Result is bool - check if it's true (0x000...001)
    return result && result !== '0x' && result.slice(-1) === '1';
  } catch (error) {
    return false;
  }
}

/**
 * Transfer ownership via MetaMask
 */
async function transferOwnership(provider: any, from: string, to: string, contractAddress: string): Promise<string> {
  const data = TRANSFER_OWNERSHIP_SELECTOR + encodeAddress(to);
  
  const txHash = await provider.request({
    method: 'eth_sendTransaction',
    params: [{
      from: from,
      to: contractAddress,
      data: data,
      gas: '0x100000', // 1M gas
      gasPrice: '0x' + (50e9).toString(16), // 50 gwei
    }],
  });
  
  return txHash;
}

/**
 * Renounce ownership via MetaMask
 */
async function renounceOwnership(provider: any, from: string, contractAddress: string): Promise<string> {
  const txHash = await provider.request({
    method: 'eth_sendTransaction',
    params: [{
      from: from,
      to: contractAddress,
      data: RENOUNCE_OWNERSHIP_SELECTOR,
      gas: '0x100000',
      gasPrice: '0x' + (50e9).toString(16),
    }],
  });
  
  return txHash;
}

/**
 * Main function
 */
async function takeOwnership() {
  try {
    console.log('🔐 Diamond Ownership Transfer Tool');
    console.log('='.repeat(70));
    console.log(`Contract Address: ${DIAMOND_ADDRESS}`);
    console.log(`Network: Polygon (Chain ID: ${CHAIN_ID})`);
    console.log('');
    
    console.log('⚠️  WARNING: Only use this if you are authorized!');
    console.log('');
    
    // Initialize MetaMask SDK
    console.log('Initializing MetaMask SDK...');
    await sdk.init();
    
    // Connect to MetaMask
    console.log('Connecting to MetaMask...');
    console.log('Please approve the connection in MetaMask...');
    const accounts = await sdk.connect();
    
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts connected');
    }
    
    const userAddress = accounts[0];
    console.log(`✅ Connected: ${userAddress}`);
    console.log('');
    
    const provider = sdk.getProvider();
    if (!provider) {
      throw new Error('Provider not available');
    }
    
    // Check current chain
    const chainId = await provider.request({
      method: 'eth_chainId',
      params: [],
    });
    
    const currentChainId = parseInt(chainId, 16);
    console.log(`Current Chain ID: ${currentChainId}`);
    
    if (currentChainId !== CHAIN_ID) {
      console.log(`⚠️  Wrong network! Please switch to Polygon (Chain ID: ${CHAIN_ID})`);
      console.log('Requesting network switch...');
      
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x' + CHAIN_ID.toString(16) }],
        });
        console.log('✅ Switched to Polygon');
      } catch (error: any) {
        if (error.code === 4902) {
          // Chain not added, need to add it
          console.log('Polygon not added to MetaMask. Please add it manually.');
          throw new Error('Please add Polygon network to MetaMask');
        }
        throw error;
      }
    }
    console.log('');
    
    // Check current owner
    console.log('Step 1: Checking current owner...');
    const currentOwner = await getOwner(provider, DIAMOND_ADDRESS);
    
    if (currentOwner) {
      console.log(`Current Owner: ${currentOwner}`);
      console.log(`Your Address:  ${userAddress}`);
      
      if (currentOwner.toLowerCase() === userAddress.toLowerCase()) {
        console.log('✅ You are already the owner!');
        return;
      }
      
      if (currentOwner.toLowerCase() !== userAddress.toLowerCase()) {
        console.log('❌ You are not the current owner.');
        console.log('⚠️  You cannot transfer ownership unless you are the current owner.');
        console.log('   Or if the contract has a different ownership mechanism.');
        return;
      }
    } else {
      console.log('⚠️  Could not determine owner (contract might not use Ownable pattern)');
    }
    console.log('');
    
    // Check for AccessControl pattern
    console.log('Step 2: Checking for AccessControl pattern...');
    const hasAdmin = await hasAdminRole(provider, DIAMOND_ADDRESS, userAddress);
    
    if (hasAdmin) {
      console.log('✅ You have ADMIN_ROLE!');
      console.log('You can grant roles but ownership transfer might work differently.');
    } else {
      console.log('❌ You do not have ADMIN_ROLE');
    }
    console.log('');
    
    // Ask user what they want to do
    console.log('Step 3: Ownership Transfer Options');
    console.log('');
    console.log('Options:');
    console.log('1. Transfer ownership to another address');
    console.log('2. Renounce ownership (make contract ownerless)');
    console.log('');
    
    // For now, we'll attempt to transfer to the connected address
    // In a real scenario, you'd prompt the user
    const targetAddress = process.argv[3] || userAddress;
    
    if (targetAddress.toLowerCase() === userAddress.toLowerCase() && currentOwner?.toLowerCase() === userAddress.toLowerCase()) {
      console.log('You are already the owner. No action needed.');
      return;
    }
    
    console.log(`Attempting to transfer ownership to: ${targetAddress}`);
    console.log('');
    console.log('⚠️  This will require a transaction. Please confirm in MetaMask.');
    console.log('');
    
    // Attempt transfer
    try {
      console.log('Sending transaction...');
      const txHash = await transferOwnership(provider, userAddress, targetAddress, DIAMOND_ADDRESS);
      console.log(`✅ Transaction sent!`);
      console.log(`Transaction Hash: ${txHash}`);
      console.log('');
      console.log('Waiting for confirmation...');
      console.log(`View on PolygonScan: https://polygonscan.com/tx/${txHash}`);
      console.log('');
      console.log('⏳ Please wait for the transaction to be confirmed.');
      console.log('   Check MetaMask or PolygonScan for status.');
    } catch (error: any) {
      if (error.code === 4001) {
        console.log('❌ Transaction rejected by user');
      } else if (error.message?.includes('revert')) {
        console.log('❌ Transaction failed: Contract reverted');
        console.log('   Possible reasons:');
        console.log('   - You are not the current owner');
        console.log('   - Contract uses different ownership mechanism');
        console.log('   - Contract has additional restrictions');
      } else {
        throw error;
      }
    }
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  }
}

// Run
takeOwnership();
