# Godot Arbitrum Rendering Engine

A complete Godot engine implementation for rendering and interacting with the Arbitrum blockchain, Diamond smart contracts, and cross-chain protocols.

## Overview

This engine transforms Godot into a full blockchain rendering platform:

- **Visual Transaction Rendering**: See pending, confirmed, and failed transactions
- **13-Point Star Visualization**: Animated cross-chain routing between all supported chains
- **NFT Gallery System**: Load and display NFT assets directly in Godot
- **Glyph Execution UI**: Interactive interface for executing the 22 Aramaic glyphs
- **Real-time Block Updates**: Live blockchain state visualization
- **AI Bot Management**: Register and control AI bots for automated execution

## Installation

1. Copy the `addons/arbitrum_engine` folder to your Godot project's `addons` directory
2. Enable the plugin in Project Settings → Plugins
3. Add an `ArbitrumEngine` node to your scene
4. Add a `BlockchainRenderer` node as a child of your main scene

## Node Types

### ArbitrumEngine

Core engine for blockchain interaction.

```gdscript
# Get reference
@onready var engine: ArbitrumEngine = $ArbitrumEngine

# Check connection
if engine.is_connected():
    print(engine.get_wallet_address())

# Execute a glyph (Aramaic command)
var result = await engine.execute_glyph(0)  # Aleph - uniswapSwap

# Bridge tokens to another chain
await engine.bridge_to_chain(137, "MAGIC", "100")  # Bridge to Polygon

# Load an NFT
var nft = await engine.load_nft("0xfe8c...", 1234)
```

### BlockchainRenderer

Visual rendering of blockchain state.

```gdscript
@onready var renderer: BlockchainRenderer = $BlockchainRenderer

# Connect to engine
renderer.engine = $ArbitrumEngine

# Manually visualize a route
renderer.visualize_route("ARBITRUM", "COSMOS", Color.PURPLE)

# Highlight a glyph
renderer.highlight_glyph(7)  # Heth - sendCrossChain

# Create NFT gallery
renderer.create_nft_gallery(nft_array, Vector2(100, 100), 4)
```

## Signals

### ArbitrumEngine Signals

| Signal | Parameters | Description |
|--------|------------|-------------|
| `wallet_connected` | `address: String` | Wallet connection established |
| `wallet_disconnected` | - | Wallet disconnected |
| `transaction_sent` | `tx_hash: String` | Transaction broadcast |
| `transaction_confirmed` | `tx_hash: String, receipt: Dictionary` | Transaction confirmed |
| `transaction_failed` | `tx_hash: String, error: String` | Transaction failed |
| `block_received` | `block_number: int` | New block detected |
| `nft_loaded` | `token_id: int, metadata: Dictionary, texture: Texture2D` | NFT loaded |
| `glyph_executed` | `glyph_id: int, result: Dictionary` | Glyph command executed |
| `cross_chain_message_sent` | `dest_chain: int, message_id: String` | Cross-chain message sent |
| `ai_bot_status_changed` | `bot_address: String, status: String` | AI bot status updated |

## The 22 Aramaic Glyphs

Interactive function execution through ancient symbols:

| ID | Glyph | Name | Function |
|----|-------|------|----------|
| 0 | 𐡀 | Aleph | uniswapSwap |
| 1 | 𐡁 | Beth | aaveSupply |
| 2 | 𐡂 | Gimel | aaveWithdraw |
| 3 | 𐡃 | Daleth | gmxSwap |
| 4 | 𐡄 | He | getETHPrice |
| 5 | 𐡅 | Vav | getARBPrice |
| 6 | 𐡆 | Zayin | getLINKPrice |
| 7 | 𐡇 | Heth | sendCrossChain |
| 8 | 𐡈 | Teth | estimateLzFees |
| 9 | 𐡉 | Yodh | buyTreasureNFT |
| 10 | 𐡊 | Kaph | getChainlinkPrice |
| 11 | 𐡋 | Lamedh | getAavePosition |
| 12 | 𐡌 | Mem | bridgeToCosmos |
| 13 | 𐡍 | Nun | bridgeToEnjin |
| 14 | 𐡎 | Samekh | bridgeToTon |
| 15 | 𐡏 | Ayin | depositToVault |
| 16 | 𐡐 | Pe | withdrawFromVault |
| 17 | 𐡑 | Tsade | swapNFTsForTokens |
| 18 | 𐡒 | Qoph | createGuild |
| 19 | 𐡓 | Resh | craft |
| 20 | 𐡔 | Shin | executeMetaTx |
| 21 | 𐡕 | Tav | executeStarRoute |

## 13-Point Star Chain Network

The engine visualizes cross-chain routing through a 13-point star:

```
                    ETHEREUM (1)
                        ●
                       /|\
           POLYGON ●   | ●  BASE
              (2)  \   |   /  (3)
                    \  |  /
         COINWEB ●───●ARBITRUM●───● COSMOS
            (4)      (CENTER)        (5)
                    /  |  \
           TON ●   /   |   \  ● GNOSIS
           (6)        |        (7)
                 ●    |    ●
              ENJIN   |   OPTIMISM
               (8)    |    (9)
                    ● | ●
              AVALANCHE BSC
                 (10)  (11)
                    ●
                  FANTOM
                   (12)
```

### Chain Roles

- **Arbitrum**: APEX_CONSTANT - Central hub
- **Ethereum**: SOVEREIGN_BRIDGE - Primary bridge
- **Polygon**: DATA_STABILIZER - Fast confirmations
- **Base**: LIQUIDITY_FOUNDATION - Coinbase integration
- **Cosmos**: INTERCHAIN_HARMONY - IBC routing (via Axelar)
- **Enjin**: NFT_MATRIX_ANCHOR - NFT protocol
- **TON**: OPEN_NETWORK_RELAY - D2Rlan bridge

## Contract Addresses

```gdscript
# Main Diamond Contract
const DIAMOND_ADDRESS = "0xf7993A8df974AD022647E63402d6315137c58ABf"

# Hive Control Center
const HIVE_ADDRESS = "0x67A977eaD94C3b955ECbf27886CE9f62464423B2"

# Treasure Ecosystem
const MAGIC_TOKEN = "0x539bdE0d7Dbd336b79148AA742883198BBF60342"
const TREASURE_MARKETPLACE = "0x2E3b85F85628301a0Bce300Dee3A6B04195A15Ee"
const LEGIONS_NFT = "0xfe8c1ac365ba6780aec5a985d989b327c27670a1"
```

## TDK Integration

The engine integrates with Treasure Development Kit (TDK) for seamless authentication:

```gdscript
# Launched from Treasure Launcher with auth token
# Engine automatically parses --tdk-auth-token argument
if engine.is_connected():
    # Already authenticated via TDK
    var address = engine.get_wallet_address()
```

## Example Scene Setup

```
MainScene (Node2D)
├── ArbitrumEngine (ArbitrumEngine)
├── BlockchainRenderer (BlockchainRenderer)
│   └── [Auto-generated chain node visuals]
└── UI (CanvasLayer)
    ├── WalletPanel
    │   ├── ConnectButton
    │   ├── WalletLabel
    │   └── BalanceLabel
    ├── GlyphPanel
    │   └── GlyphGrid (GridContainer)
    └── StatusPanel
        └── BlockLabel
```

## AI Bot Integration

Register and manage AI bots for autonomous execution:

```gdscript
# Register a bot with specific glyph permissions
engine.register_ai_bot(
    "0xBotAddress...",
    [0, 4, 7]  # Can execute Aleph, He, Heth
)

# Check if bot can execute
if engine.can_bot_execute_glyph("0xBotAddress...", 7):
    print("Bot authorized for cross-chain operations")

# Revoke bot access
engine.revoke_ai_bot("0xBotAddress...")
```

## MagicSwap Integration

NFT-backed DEX operations:

```gdscript
# Deposit NFTs to vault
await engine.deposit_nfts_to_vault(
    ["0xNFTContract..."],
    [1234, 5678],
    [1, 1],
    "0xVaultAddress..."
)

# Swap NFTs for tokens
await engine.swap_nfts_for_tokens(
    ["0xNFTContract..."],
    [1234],
    [1],
    "1000000000000000000",  # 1 token min out
    ["0xMAGIC...", "0xETH..."]
)
```

## Building & Export

1. Enable the plugin in Project Settings
2. Configure export for your target platform
3. Ensure RPC endpoints are accessible from target environment

For web builds, consider CORS and wallet connection requirements.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     GODOT ENGINE                             │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────────────────────┐   │
│  │ ArbitrumEngine  │  │     BlockchainRenderer          │   │
│  │                 │  │                                 │   │
│  │ - RPC Client    │  │ - Transaction Visuals           │   │
│  │ - Wallet Mgmt   │  │ - 13-Point Star Display         │   │
│  │ - Glyph Exec    │  │ - NFT Gallery                   │   │
│  │ - Cross-chain   │  │ - Glyph Animations              │   │
│  │ - NFT Loading   │  │ - Block Chain View              │   │
│  │ - AI Bot Mgmt   │  │                                 │   │
│  └────────┬────────┘  └────────────────┬────────────────┘   │
│           │                            │                     │
│           └────────────┬───────────────┘                     │
│                        │                                     │
├────────────────────────┼─────────────────────────────────────┤
│                        ▼                                     │
│              ┌─────────────────┐                             │
│              │  JSON-RPC Layer │                             │
│              └────────┬────────┘                             │
│                       │                                      │
└───────────────────────┼──────────────────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────┐
        │     ARBITRUM ONE (L2)         │
        │                               │
        │  ┌─────────────────────────┐  │
        │  │    DIAMOND CONTRACT     │  │
        │  │  0xf7993A8df974...      │  │
        │  │                         │  │
        │  │  ├── DeFiFacet          │  │
        │  │  ├── OracleFacet        │  │
        │  │  ├── BridgeFacet        │  │
        │  │  ├── NFTFacet           │  │
        │  │  ├── AmbireWalletFacet  │  │
        │  │  ├── AISafeBotFacet     │  │
        │  │  ├── CoinwebFacet       │  │
        │  │  └── TreasureFacet      │  │
        │  └─────────────────────────┘  │
        │                               │
        │  ┌─────────────────────────┐  │
        │  │    HIVE CONTROL         │  │
        │  │  0x67A977eaD94...       │  │
        │  └─────────────────────────┘  │
        │                               │
        └───────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
   ┌─────────┐    ┌─────────┐    ┌─────────┐
   │ETHEREUM │    │ COSMOS  │    │   TON   │
   │  (L1)   │    │ (Axelar)│    │(D2Rlan) │
   └─────────┘    └─────────┘    └─────────┘
```

---

**Diamond Contract**: `0xf7993A8df974AD022647E63402d6315137c58ABf`
**Hive Address**: `0x67A977eaD94C3b955ECbf27886CE9f62464423B2`
**Network**: Arbitrum One (Chain ID: 42161)
