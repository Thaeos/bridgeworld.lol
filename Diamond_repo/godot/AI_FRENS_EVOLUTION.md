# AI Frens Evolution System

**2D NFT Images → 3D Characters through On-Chain Activity**

As AI Frens traverse, interact, and build on Arbitrum, their minted NFT profile images evolve into fully-realized 3D characters.

## Evolution Levels

| Level | Name | Points Required | Features |
|-------|------|-----------------|----------|
| 0 | 2D Sprite | 0 | Flat 2D image |
| 1 | Flat 3D | 100 | Billboard in 3D space with depth |
| 2 | Low Poly | 500 | Basic 3D mesh body with head |
| 3 | Detailed | 2,000 | Full body, arms, legs, accessories |
| 4 | Animated | 5,000 | Skeleton, idle/walk/interact animations |
| 5 | Legendary | 15,000 | Particle aura, special effects, emotes |

## Activity Points

Every on-chain action earns evolution points:

| Activity | Points |
|----------|--------|
| Transaction sent/received | 1 |
| Contract interaction | 5 |
| DeFi swap | 10 |
| DeFi supply/lend | 15 |
| NFT mint | 20 |
| NFT trade | 10 |
| Cross-chain bridge | 25 |
| Glyph execution | 30 |
| Guild joined | 50 |
| Crafting recipe created | 75 |
| Contract deployed | 100 |
| AI bot registered | 150 |
| Guild created | 200 |

## How It Works

### 1. Registration

```gdscript
# Register an AI Fren with their NFT
var fren = fren_evolution.register_fren(
    "0xAI_FREN_ADDRESS",
    "0xNFT_CONTRACT",
    token_id
)
```

### 2. Automatic Activity Tracking

The system automatically tracks on-chain activity:
- Listens to `ArbitrumEngine` signals
- Records transactions, glyph executions, bridges
- Calculates points and checks evolution thresholds

### 3. Visual Evolution

When thresholds are reached:

**Level 0 → 1 (100 points)**
- NFT image becomes a billboard in 3D space
- Can exist in the FrenWorld

**Level 1 → 2 (500 points)**
- Basic 3D body generated
- Colors extracted from NFT
- Shadow added

**Level 2 → 3 (2,000 points)**
- Detailed body, head, arms, legs
- NFT projected onto head
- Accessories from NFT traits
- Facial features

**Level 3 → 4 (5,000 points)**
- Skeleton rig added
- Idle animation (breathing)
- Walk animation
- Interact animation

**Level 4 → 5 (15,000 points)**
- Particle aura (color based on dominant activity)
- Special effects for achievements
- Legendary ring for 1000+ activities
- Emote system

## FrenWorld - The 3D Environment

AI Frens exist in a 3D world representing Arbitrum:

### Zones

```
                    ┌─────────────┐
                    │  COSMOS     │
                    │  BRIDGE     │
                    └─────────────┘
                          │
    ┌──────────┐    ┌─────┴─────┐    ┌──────────┐
    │   TON    │    │   STAR    │    │  ENJIN   │
    │ GATEWAY  │────│   NEXUS   │────│  PORTAL  │
    └──────────┘    └─────┬─────┘    └──────────┘
                          │
┌────────────┐      ┌─────┴─────┐      ┌────────────┐
│   ORACLE   │      │   SPAWN   │      │  UNISWAP   │
│   SHRINE   │      │  PLATFORM │      │   TOWER    │
└────────────┘      └───────────┘      └────────────┘
                          │
    ┌──────────┐    ┌─────┴─────┐    ┌──────────┐
    │   NFT    │    │   GUILD   │    │   AAVE   │
    │  GALLERY │    │   HALL    │    │   BANK   │
    └──────────┘    └───────────┘    └──────────┘
                          │
                    ┌─────┴─────┐
                    │ CRAFTING  │
                    │   FORGE   │
                    └───────────┘
```

### Zone Types

- **DeFi District**: Uniswap Tower, Aave Bank, GMX Exchange
- **Oracle Shrine**: Price feed visualization
- **NFT Gallery**: MagicSwap Vault, NFT display
- **Bridge Towers**: Cosmos, Enjin, TON portals
- **Guild Hall**: Social hub, guild creation
- **Crafting Forge**: Recipe creation
- **Star Nexus**: Central hub, 13-Point Star route execution

### Fren Movement

```gdscript
# Move fren to a zone
fren_world.move_fren_to_zone("0xFREN_ADDRESS", "UNISWAP_TOWER")

# When fren enters zone, glyph can auto-execute
fren_world.fren_entered_zone.connect(func(address, zone):
    if zone == "UNISWAP_TOWER":
        # Fren is at Uniswap, ready to swap
        arbitrum_engine.execute_glyph(0)  # Aleph - uniswapSwap
)
```

## Color Extraction

The 3D model colors are derived from the NFT:

- **Primary Color**: Extracted from center pixels → Body color
- **Secondary Color**: Extracted from edges → Arms/legs color
- **Aura Color**: Based on dominant activity type

## Trait Integration

NFT attributes become 3D accessories:

```json
{
  "attributes": [
    {"trait_type": "hat", "value": "wizard"},
    {"trait_type": "accessory", "value": "sword"},
    {"trait_type": "background", "value": "rare"}
  ]
}
```

At Level 3+, these traits unlock:
- Hats appear on head
- Accessories attached to body
- Rare/legendary traits add sparkle effects

## Aura Colors by Activity

| Dominant Activity | Aura Color |
|-------------------|------------|
| DeFi (swap/supply) | Green |
| Cross-chain bridge | Purple |
| NFT (mint/trade) | Orange |
| Glyph execution | Gold |
| Contract deployment | Blue |
| Default | Gray |

## Code Example

```gdscript
extends Node3D

@onready var engine = $ArbitrumEngine
@onready var evolution = $FrenEvolution
@onready var world = $FrenWorld

func _ready():
    # Initialize
    evolution.initialize(engine)
    
    # Connect signals
    evolution.fren_evolved.connect(_on_fren_evolved)
    evolution.fren_3d_ready.connect(_on_fren_ready)
    
    # Register an AI Fren
    var fren = evolution.register_fren(
        "0x1234567890abcdef...",
        "0xNFTContract...",
        42
    )

func _on_fren_ready(address: String, model: Node3D):
    print("Fren spawned: ", address)
    world.spawn_fren(address, model)

func _on_fren_evolved(address: String, level: int, model: Node3D):
    print("Fren evolved to level ", level)
    
    # Celebrate evolution
    if level >= 3:
        # Detailed model achieved!
        world.focus_camera_on_fren(address)

# Simulate activity for testing
func test_evolution():
    evolution.simulate_activity_burst(
        "0x1234567890abcdef...",
        "defi_swap",
        100  # 100 swaps = 1000 points
    )
```

## Integration with Diamond Contract

When a fren executes actions through the Diamond contract:

1. `ArbitrumEngine` broadcasts transaction
2. `FrenEvolution` records activity points
3. If threshold crossed, evolution triggers
4. New 3D model replaces old one
5. `FrenWorld` updates visual representation

The entire system creates a visual feedback loop:
- **More activity** → **Higher evolution** → **More impressive 3D character**

---

## File Structure

```
godot/addons/arbitrum_engine/
├── arbitrum_engine.gd        # Core blockchain engine
├── plugin.gd                 # Godot plugin loader
├── plugin.cfg                # Plugin config
├── nodes/
│   └── blockchain_renderer.gd  # 2D visualization
└── ai_frens/
    ├── fren_evolution.gd     # Evolution system
    └── fren_world.gd         # 3D world environment
```

---

**Diamond Contract**: `0xf7993A8df974AD022647E63402d6315137c58ABf`  
**Network**: Arbitrum One (42161)
