# Take Ownership Script

⚠️ **WARNING: Only use this script if you are authorized to take ownership of the contract!**

## Usage

```bash
# Transfer ownership to your connected MetaMask address
npm run take-ownership

# Transfer ownership to a specific address
npm run take-ownership 0xf7993A8df974AD022647E63402d6315137c58ABf 0xYourTargetAddress

# Or directly with tsx
tsx take_ownership.ts [contractAddress] [targetAddress]
```

## What It Does

1. **Connects to MetaMask** - Requires user approval
2. **Checks Network** - Ensures you're on Polygon (Chain ID: 137)
3. **Checks Current Owner** - Verifies who currently owns the contract
4. **Checks AccessControl** - Looks for role-based access patterns
5. **Transfers Ownership** - Sends transaction to transfer ownership

## Ownership Patterns Supported

- **Ownable Pattern** - Standard OpenZeppelin Ownable
  - `owner()` - Get current owner
  - `transferOwnership(address)` - Transfer to new owner
  - `renounceOwnership()` - Make contract ownerless

- **AccessControl Pattern** - OpenZeppelin AccessControl
  - Checks for `DEFAULT_ADMIN_ROLE`
  - Can grant roles if you have admin

## Requirements

- MetaMask installed and unlocked
- Connected to Polygon network
- Sufficient MATIC for gas fees
- Authorization to transfer ownership

## Security Notes

- ⚠️ Only use if you are the current owner or authorized
- ⚠️ Unauthorized ownership transfer is illegal
- ⚠️ This script will send real transactions on Polygon
- ⚠️ Double-check the contract address before running

## Troubleshooting

**"You are not the current owner"**
- You must be the current owner to transfer ownership
- Check if contract uses a different ownership mechanism
- Some contracts use multi-sig or timelock

**"Transaction rejected"**
- User rejected in MetaMask
- Or contract has additional restrictions

**"Contract reverted"**
- You don't have permission
- Contract might have timelock
- Contract might require multi-sig approval

## Example Output

```
🔐 Diamond Ownership Transfer Tool
======================================================================
Contract Address: 0xf7993A8df974AD022647E63402d6315137c58ABf
Network: Polygon (Chain ID: 137)

⚠️  WARNING: Only use this if you are authorized!

Initializing MetaMask SDK...
Connecting to MetaMask...
✅ Connected: 0xYourAddress

Step 1: Checking current owner...
Current Owner: 0xCurrentOwner
Your Address:  0xYourAddress

Step 2: Checking for AccessControl pattern...
❌ You do not have ADMIN_ROLE

Step 3: Ownership Transfer Options
...
```
