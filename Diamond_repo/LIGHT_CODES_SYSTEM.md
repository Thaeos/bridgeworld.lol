# Light Codes System

## The Concept

**"Light Codes"** - Every time a Diamond/Gem contract is used on Ethereum, it records the usage and triggers payment/royalty distribution.

The NFTs aren't just static artifacts - they're **living contracts** that:
- ✨ **Track every usage/interaction**
- 📝 **Record on Ethereum blockchain**
- 💰 **Automatically distribute payments/royalties**
- 💵 **Generate revenue when used**

## How It Works

### 1. Contract Usage Detection

When someone interacts with a Diamond or Gem contract:
- Function call is detected
- Transaction details are recorded
- Gas used and value transferred are captured
- Block number and transaction hash are stored

### 2. Light Code Activation

```typescript
recordLightCodeActivation(
  contractAddress,
  functionCalled,
  caller,
  blockNumber,
  txHash,
  gasUsed,
  gasPrice,
  value
)
```

### 3. Royalty Calculation

Royalties are calculated from:
- **Gas Cost**: `(gasUsed × gasPrice) / 10^18 ETH`
- **Value Transferred**: ETH value in transaction
- **Total Value**: Gas + Value
- **Royalty**: 8.5% of total value

### 4. Royalty Distribution

Royalties are automatically distributed to:

| Role | Percentage | Recipient |
|------|------------|-----------|
| Tool Creators | 2.5% | EIP-2535, IPFS, FUSE, rsync creators |
| Idea Originators | 2.5% | Cosmic Diamond concept creators |
| Developers | 2.5% | System implementers |
| Community Contributors | 1.0% | Testers, feedback providers |

**Total: 8.5%**

## Usage

### Monitor Contract Usage

```bash
npm run light-codes monitor <contract-address> [rpc-url] [from-block]
```

Example:
```bash
npm run light-codes monitor 0x1234... https://eth.llamarpc.com 18500000
```

Output:
```
✨ Light Code Activated! ✨

   Contract: 0x1234...
   Function: 0x12345678
   Caller: 0xabcd...
   Block: #18500001
   Value: 0.001234 ETH
   Royalties Generated: 0.000105 ETH

   Royalty Distribution:

   1. Tool Creators (tool_creator): 0.000031 ETH
   2. Idea Originators (idea_originator): 0.000031 ETH
   3. Developers (developer): 0.000031 ETH
   4. Community Contributors (community_contributor): 0.000012 ETH
```

### Get Activation Statistics

```bash
npm run light-codes stats <diamond|gem> <id>
```

Example:
```bash
npm run light-codes stats diamond 1
```

Output:
```
📊 Light Code Stats: DIAMOND 1

   Total Activations: 42
   Total Royalties: 0.004567 ETH
   Last Activation: 2025-01-28T12:34:56.789Z
   Contract: 0x1234...

   Recent Activations:

   1. Block #18500001 - 0x12345678
      Royalties: 0.000105 ETH
      Caller: 0xabcd1234...

   2. Block #18500005 - 0x87654321
      Royalties: 0.000098 ETH
      Caller: 0xefgh5678...
```

### Generate Report

```bash
npm run light-codes report
```

Output:
```
📊 Light Codes Report

   Total NFTs Tracked: 5

   DIAMOND 1:
      Activations: 42
      Royalties: 0.004567 ETH
      Last Used: 2025-01-28T12:34:56.789Z

   DIAMOND 2:
      Activations: 28
      Royalties: 0.003123 ETH
      Last Used: 2025-01-28T11:23:45.678Z

   GEM 1:
      Activations: 15
      Royalties: 0.001234 ETH
      Last Used: 2025-01-28T10:12:34.567Z

   📈 Totals:
      Total Activations: 85
      Total Royalties Generated: 0.008924 ETH
```

## Data Structure

### Light Code Event

```json
{
  "eventId": "a1b2c3d4e5f6g7h8",
  "diamondId": "1",
  "contractAddress": "0x1234...",
  "functionCalled": "0x12345678",
  "caller": "0xabcd...",
  "blockNumber": 18500001,
  "txHash": "0x9876...",
  "timestamp": "2025-01-28T12:34:56.789Z",
  "gasUsed": 21000,
  "gasPrice": "20000000000",
  "value": "1000000000000000",
  "status": "success",
  "royaltiesGenerated": 0.000105,
  "royaltiesDistributed": [
    {
      "recipient": "Tool Creators",
      "role": "tool_creator",
      "amount": 0.000031,
      "address": "0x0001..."
    }
  ]
}
```

### Activation Tracking

```json
{
  "activationId": "xyz123...",
  "nftId": "1",
  "nftType": "diamond",
  "contractAddress": "0x1234...",
  "totalActivations": 42,
  "totalRoyaltiesGenerated": 0.004567,
  "lastActivation": "2025-01-28T12:34:56.789Z",
  "activations": [...]
}
```

## File Structure

```
light_codes/
  ├── events/
  │   ├── event_a1b2c3d4.json
  │   ├── event_e5f6g7h8.json
  │   └── master_log.jsonl
  └── activations/
      ├── diamond_1.json
      ├── diamond_2.json
      ├── gem_1.json
      └── ...
```

## Integration Flow

```
Contract Used on Ethereum
    ↓
Light Code Detected
    ↓
Record Event (Block, TX, Gas, Value)
    ↓
Calculate Royalties (8.5% of total)
    ↓
Distribute to Creators
    ↓
Update Activation Tracking
    ↓
Generate Revenue for Creators
```

## Benefits

1. **Passive Income**: Creators earn royalties every time contracts are used
2. **Transparent**: All usage recorded on blockchain
3. **Automatic**: No manual intervention needed
4. **Fair Distribution**: Royalties split among all contributors
5. **Living NFTs**: NFTs generate value through usage, not just ownership

## Royalty Distribution Example

If a contract is used with:
- Gas: 0.001 ETH
- Value: 0.01 ETH
- **Total: 0.011 ETH**

Royalties (8.5%):
- **Total Royalties: 0.000935 ETH**
  - Tool Creators: 0.000275 ETH (2.5%)
  - Idea Originators: 0.000275 ETH (2.5%)
  - Developers: 0.000275 ETH (2.5%)
  - Community: 0.000110 ETH (1.0%)

## Future Enhancements

- [ ] Real-time event monitoring
- [ ] Automatic royalty distribution smart contract
- [ ] Multi-signature creator wallet
- [ ] Analytics dashboard
- [ ] Email/SMS notifications for activations
- [ ] Historical trend analysis
- [ ] Gas optimization tracking
- [ ] Cross-chain support

## Why "Light Codes"?

The name "Light Codes" represents:
- **Light**: Illumination, activation, energy
- **Codes**: Smart contracts, cryptographic signatures
- **Together**: Contracts that "light up" (activate) and generate value

Every interaction is a "light code" activation - the contract lights up, records the event, and generates royalties for creators.
