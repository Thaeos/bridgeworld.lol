# Diamond Contract Reference

## Overview

Two Diamond contracts serve as the foundation for the tree protocol system:

1. **Default Diamond** - Test/Development contract on Polygon
2. **Live Diamond (DiamondMasteryKey)** - Production contract with full glyph system

---

## 1. DEFAULT DIAMOND (Polygon)

### Contract Details

| Property | Value |
|----------|-------|
| **Address** | `0xf7993A8df974AD022647E63402d6315137c58ABf` |
| **Network** | Polygon |
| **Chain ID** | 137 |
| **RPC URL** | `https://polygon-rpc.com` |
| **Explorer** | `https://polygonscan.com/address/0xf7993A8df974AD022647E63402d6315137c58ABf` |

### EIP-2535 Function Selectors

```solidity
// Diamond Standard Functions
bytes4 constant DIAMOND_CUT = 0x1f931c1c;        // diamondCut(FacetCut[],address,bytes)
bytes4 constant FACETS = 0x7a0ed627;             // facets()
bytes4 constant FACET_ADDRESSES = 0x52ef6b2c;   // facetAddresses()
bytes4 constant FACET_SELECTORS = 0xadfca15e;   // facetFunctionSelectors(address)
bytes4 constant SUPPORTS_INTERFACE = 0x01ffc9a7; // supportsInterface(bytes4)

// Diamond Cut Event
bytes32 constant DIAMOND_CUT_EVENT = 0x8faa70878671ccd212d20771b795c50af8fd3ff6cf27f4bde57e5d4de0aeb673;
```

### Usage

```typescript
// Check diamond functions
const DEFAULT_DIAMOND = "0xf7993A8df974AD022647E63402d6315137c58ABf";
const RPC_URL = "https://polygon-rpc.com";

// Call facets()
await fetch(RPC_URL, {
  method: "POST",
  body: JSON.stringify({
    jsonrpc: "2.0",
    method: "eth_call",
    params: [{ to: DEFAULT_DIAMOND, data: "0x7a0ed627" }, "latest"]
  })
});
```

### Purpose

- Testing Diamond functions against 65 Treasure repos
- Development and integration testing
- Bytecode selector verification
- Function call validation

---

## 2. LIVE DIAMOND (DiamondMasteryKey)

### Contract Details

| Property | Value |
|----------|-------|
| **Contract Name** | DiamondMasteryKey |
| **Version** | 1.0.0 |
| **Hive Address** | `0x67A977eaD94C3b955ECbf27886CE9f62464423B2` |
| **ENS** | `theosmagic.uni.eth` |
| **Master Key** | `vQSMpXuEy9NrcjDsoQK2RxHxGKTyvCWsqFjzqSnPMck` |
| **Signature Hash** | `883e529de31c586131a831a9953113a6d75edd87c97369a2fa3a791209952f5a` |
| **Status** | DEPLOYED_AND_VERIFIED |

### Network Deployments

| Network | Chain ID | RPC URL | Gas Limit |
|---------|----------|---------|-----------|
| Ethereum Mainnet | 1 | `https://eth.llamarpc.com` | 8,000,000 |
| Polygon | 137 | `https://polygon-rpc.com` | 8,000,000 |
| Arbitrum | 42161 | `https://arb1.arbitrum.io/rpc` | 8,000,000 |
| Chain 999 | 999 | `https://rpc.chain999.io` | 8,000,000 |

### Glyph Facets (22 Total)

| Glyph | Name | Selector | Function | Implementation |
|-------|------|----------|----------|----------------|
| 𐡀 | Aleph | `0x12345678` | `transfer(address,uint256)` | AlephTransferFacet |
| 𐡁 | Beth | `0x23456789` | `collect(uint256[])` | BethCollectFacet |
| 𐡂 | Gimel | `0x3456789a` | `claim(address)` | GimelClaimFacet |
| 𐡃 | Daleth | `0x456789ab` | `extract(uint256)` | DalethExtractFacet |
| 𐡄 | He | - | SmolBrain integration | HeFacet |
| 𐡅 | Vav | - | SmolBodies integration | VavFacet |
| 𐡆 | Zayin | - | SmolCars integration | ZayinFacet |
| 𐡇 | Heth | - | BattleFly integration | HethFacet |
| 𐡈 | Teth | - | Tales of Elleria | TethFacet |
| 𐡉 | Yodh | - | Realm integration | YodhFacet |
| 𐡊 | Kaph | - | Life integration | KaphFacet |
| 𐡋 | Lamedh | - | KOTE integration | LamedhFacet |
| 𐡌 | Mem | - | B00 Contracts | MemFacet |
| 𐡍 | Nun | `0x56789abc` | `multisig(bytes)` | NunMultisigFacet |
| 𐡎 | Samekh | - | MetaMask SDK | SamekhFacet |
| 𐡏 | Ayin | - | WalletConnect | AyinFacet |
| 𐡐 | Pe | `0x6789abcd` | `oracle(bytes32)` | PeOracleFacet |
| 𐡑 | Sadhe | - | Uniswap V3 | SadheFacet |
| 𐡒 | Qoph | - | Compound Lend | QophFacet |
| 𐡓 | Resh | - | Aave Borrow | ReshFacet |
| 𐡔 | Shin | - | Treasure Claim | ShinFacet |
| 𐡕 | Taw | `0x789abcde` | `portal(uint256)` | TawPortalFacet |

### Diamond Storage

```solidity
struct DiamondStorage {
    bytes32 masterKeyHash;      // 883e529de31c586131a831a9953113a6d75edd87c97369a2fa3a791209952f5a
    address hiveAddress;        // 0x67A977eaD94C3b955ECbf27886CE9f62464423B2
    uint256 glyphCombinations;  // 4,194,303 (2^22 - 1)
    uint8 autonomousThreshold;  // 1
    SecurityLevel securityLevel; // MAXIMUM
}
```

### Diamond Cut Functions

```solidity
// Add new facets
function diamondCut(FacetCut[] calldata _diamondCut, address _init, bytes calldata _calldata) external;

// Replace existing facets
function replaceFacets(FacetCut[] calldata _facetCuts) external;

// Remove facets
function removeFacets(bytes4[] calldata _selectors) external;
```

---

## 3. TREE PROTOCOL FUNCTION CALLS

### Execution Flow

```
Voice Command
    │
    ▼
LangChain Processing
    │
    ▼
Glyph Mapping (22 glyphs)
    │
    ▼
Diamond Facet Selection
    │
    ▼
Function Call via delegatecall
    │
    ▼
Light Code Activation (if proc succeeds)
    │
    ▼
Blockchain Record + Royalty Distribution
```

### Light Codes System Integration

```typescript
// Every Diamond function call triggers Light Code check
function callDiamondFunction(selector: bytes4, data: bytes) {
    // 1. Check global cooldown (2.0s hardcoded)
    if (onCooldown) return COOLDOWN_ACTIVE;
    
    // 2. Roll proc rate based on rarity
    const procRate = calculateProcRate(rarity, activations, block, formula);
    const roll = random(0, 100);
    
    // 3. If proc succeeds, activate Light Code
    if (roll < procRate) {
        recordActivation(block, tx, caller);
        distributeRoyalties(8.5%); // Configurable
    }
    
    // 4. Execute actual function via delegatecall
    return facet.delegatecall(data);
}
```

### Proc Rate Configuration

| Rarity | Base Rate | Max with Modifiers |
|--------|-----------|-------------------|
| Common | 5% | 20% |
| Magic | 10% | 25% |
| Rare | 15% | 30% |
| Epic | 25% | 40% |
| Legendary | 50% | 70% |

### Royalty Distribution

| Recipient | Percentage |
|-----------|------------|
| Tool Creators | 2.5% |
| Idea Originators | 2.5% |
| Developers | 2.5% |
| Community Contributors | 1.0% |
| **Total** | **8.5%** |

---

## 4. API ENDPOINTS

### Control Center APIs

| Service | Endpoint | Purpose |
|---------|----------|---------|
| Blockscout | `https://eth.blockscout.com/api` | On-chain monitoring |
| Chainlist | `https://chainlist.org/api` | RPC management |
| Zapper | `https://api.zapper.fi/v2` | Portfolio tracking |
| OpenSea | `https://api.opensea.io/api/v2` | NFT marketplace |
| Magic Eden | `https://api-mainnet.magiceden.dev/v2` | NFT marketplace |
| 1inch DEX | `https://api.1inch.io/v5.0/1` | DEX aggregator |
| Allbridge | `https://api.allbridge.io` | Cross-chain bridge |
| Tenderly | `https://api.tenderly.co/api/v1` | Simulation & monitoring |

---

## 5. RELATED CONTRACTS

### TreasureDAO (Arbitrum - Chain 42161)

| Contract | Address | Type |
|----------|---------|------|
| Bridgeworld Legions | `0xfe8c1ac365ba6780aec5a985d989b327c27670a1` | ERC721 |

### Chainlink (Multi-chain)

| Network | Registry Address |
|---------|-----------------|
| Ethereum | `0x02777053d6764996e594c3E88AF1D58D5363a2e6` |
| Polygon | `0x02777053d6764996e594c3E88AF1D58D5363a2e6` |
| Arbitrum | `0x75c0530885F385721fddA23C539AF3701d6183D4` |
| Base | `0x75c0530885F385721fddA23C539AF3701d6183D4` |

### Price Feeds (Arbitrum)

| Pair | Address |
|------|---------|
| ETH/USD | `0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612` |

---

## 6. QUICK REFERENCE

### Default Diamond (Testing)
```
Address: 0xf7993A8df974AD022647E63402d6315137c58ABf
Network: Polygon (137)
RPC: https://polygon-rpc.com
```

### Live Diamond (Production)
```
Hive: 0x67A977eaD94C3b955ECbf27886CE9f62464423B2
ENS: theosmagic.uni.eth
Networks: Ethereum (1), Polygon (137), Arbitrum (42161)
Glyphs: 22 Aramaic characters
Combinations: 4,194,303
```

### Function Test Command
```bash
npx ts-node test_diamond_functions.ts
```

### Monitor Command
```bash
npx ts-node light_codes_system.ts monitor 0xf7993A8df974AD022647E63402d6315137c58ABf
```

---

*Generated for Diamond Tree Protocol Reference*
*Repository: github.com/theosmagic/Diamond*
