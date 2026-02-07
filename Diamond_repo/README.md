# Diamond Standard Contract Checker

A comprehensive TypeScript tool for checking EIP-2535 Diamond Standard contracts with automatic RPC failover and chainlist integration.

## Features

- ✅ **Direct RPC Calls** - No wallet required, works in non-interactive environments
- ✅ **Automatic RPC Failover** - Rotates through multiple RPC endpoints on failure
- ✅ **Chainlist Integration** - Fetches RPC endpoints from chainlist.org
- ✅ **Contract Analysis** - Analyzes bytecode for diamond patterns
- ✅ **Event Fetching** - Retrieves DiamondCut events with adaptive block ranges
- ✅ **Facet Detection** - Decodes and validates facet addresses
- ✅ **Function Selector Extraction** - Identifies available functions
- ✅ **Progress Tracking** - Shows progress during large block range searches

## Installation

```bash
npm install
```

## Usage

### Fetch RPC Endpoints from Chainlist

```bash
# Fetch RPCs for specific chains
npm run fetch-rpcs -- 137        # Polygon
npm run fetch-rpcs -- 1 137 42161 # Ethereum, Polygon, Arbitrum

# Fetch RPCs for all chains
npm run fetch-rpcs -- --all
```

### Check Diamond Contract

```bash
# Check default contract (Polygon)
npm run check-diamond-rpc

# Check specific contract address
npm run check-diamond-rpc 0xYourContractAddress
```

## Scripts

- `fetch-rpcs` - Fetch RPC endpoints from chainlist.org
- `check-diamond-rpc` - Check diamond contract using direct RPC calls

## Features

### RPC Failover
The script automatically rotates through multiple RPC endpoints when:
- Rate limits are hit
- Authentication is required
- Network errors occur
- Timeouts happen

### Contract Analysis
- Checks if contract exists
- Analyzes bytecode for diamond patterns
- Tests Diamond Loupe interface
- Fetches and decodes DiamondCut events
- Validates facet addresses
- Extracts function selectors

### Event Fetching
- Finds contract creation block using binary search
- Fetches events in chunks to avoid "block range too large" errors
- Shows progress during large searches
- Limits search to last 500k blocks for performance

## Output

Results are saved to `diamond_cut_check_results.json` with:
- Contract analysis
- Bytecode patterns
- Facet addresses and validation
- DiamondCut events
- RPC usage statistics

## Requirements

- Node.js 18+
- TypeScript
- Access to Ethereum RPC endpoints (via chainlist)

## License

MIT
