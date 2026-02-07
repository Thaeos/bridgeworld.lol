# Chainlist RPC Integration

## Overview
The diamond cut checker has been enhanced to use multiple RPC endpoints from the Chainlist repository (ethereum-lists/chains) for improved reliability and to avoid rate limits.

## What is Chainlist?
Chainlist is a GitHub repository maintained by the Ethereum Lists community that provides standardized chain data including:
- RPC endpoints for various networks
- Chain metadata (name, native currency, explorers)
- Network information

Repository: https://github.com/ethereum-lists/chains

## Features Added

### 1. RPC Endpoint Fetching (`fetch_chainlist_rpcs.ts`)
- Fetches chain data from GitHub
- Extracts HTTP RPC endpoints (filters out WebSocket URLs)
- Supports single chain or multiple chains
- Saves data to `chainlist_rpcs.json`

**Usage:**
```bash
# Fetch RPCs for Polygon (chain ID 137)
npm run fetch-rpcs -- 137

# Fetch RPCs for multiple chains
npm run fetch-rpcs -- 1 137 42161

# Fetch all chains (may take a while)
npm run fetch-rpcs -- --all
```

### 2. Multi-RPC Support in Diamond Cut Checker
- Automatically loads RPC endpoints from `chainlist_rpcs.json`
- Implements automatic failover when rate limits are hit
- Rotates through available RPCs on errors
- Tracks RPC usage statistics

**Features:**
- ✅ Automatic RPC rotation on rate limits
- ✅ Failover on network errors/timeouts
- ✅ RPC usage statistics tracking
- ✅ 15-second timeout per request
- ✅ Fallback to default RPC if chainlist data unavailable

## Current RPC Endpoints for Polygon (137)

The script currently has access to **9 RPC endpoints** for Polygon:

1. `https://polygon-rpc.com/`
2. `https://rpc-mainnet.matic.network`
3. `https://matic-mainnet.chainstacklabs.com`
4. `https://rpc-mainnet.maticvigil.com`
5. `https://rpc-mainnet.matic.quiknode.pro`
6. `https://matic-mainnet-full-rpc.bwarelabs.com`
7. `https://polygon-bor-rpc.publicnode.com`
8. `https://polygon.gateway.tenderly.co`
9. `https://polygon.drpc.org`

## How It Works

### RPC Rotation Logic
1. Starts with first RPC endpoint
2. On rate limit error → automatically switches to next RPC
3. On network error/timeout → switches to next RPC
4. Cycles through all available RPCs if needed
5. Tracks success/failure statistics for each RPC

### Example Flow
```
Request 1 → RPC 1 (success) ✅
Request 2 → RPC 1 (rate limit) ⚠️ → Switch to RPC 2 ✅
Request 3 → RPC 2 (success) ✅
Request 4 → RPC 2 (timeout) ⚠️ → Switch to RPC 3 ✅
```

## Benefits

1. **Rate Limit Resilience**: Automatically switches RPCs when limits are hit
2. **Improved Reliability**: Multiple fallback options
3. **Better Performance**: Can distribute load across endpoints
4. **Easy Updates**: Fetch latest RPCs from Chainlist anytime

## Files

- `fetch_chainlist_rpcs.ts` - Script to fetch RPC endpoints from Chainlist
- `chainlist_rpcs.json` - Cached RPC endpoint data
- `check_diamondcut_rpc.ts` - Updated diamond cut checker with multi-RPC support

## Usage Examples

### Fetch RPCs for Multiple Chains
```bash
# Ethereum, Polygon, Arbitrum
npm run fetch-rpcs -- 1 137 42161
```

### Run Diamond Cut Check with Multi-RPC
```bash
# Uses RPCs from chainlist_rpcs.json automatically
npm run check-diamond-rpc

# Or specify a contract address
npm run check-diamond-rpc 0xYourContractAddress
```

## Statistics Output

After running the diamond cut check, you'll see RPC usage statistics:

```
📊 RPC Usage Statistics:
  polygon-rpc.com/:
    Success: 5, Failures: 1
  rpc-mainnet.matic.network:
    Success: 2, Failures: 0
```

## Future Enhancements

Possible improvements:
- [ ] Weighted RPC selection based on success rate
- [ ] Parallel requests to multiple RPCs for critical calls
- [ ] Caching of successful RPCs
- [ ] Health checks for RPC endpoints
- [ ] Support for custom RPC endpoints via config file

## References

- [Chainlist Repository](https://github.com/ethereum-lists/chains)
- [EIP-155 Chain IDs](https://github.com/ethereum-lists/chains/tree/master/_data/chains)
- [EIP-2535 Diamond Standard](https://eips.ethereum.org/EIPS/eip-2535)
