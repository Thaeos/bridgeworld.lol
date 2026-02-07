# 🌳 Obsidian Diamond Tree System

## The Concept

**Each contract is a Diamond, and the "tree" is the link structure between them.**

Like Obsidian's knowledge graph, where notes link to each other, Diamonds link to form a nervous system network.

## Rarity System (Based on Community Rating)

### Rarity Colors

| Rarity | Color | Hex Code | Rating Range |
|--------|-------|----------|--------------|
| **Common** | White | `#FFFFFF` | 0.0 - 2.5 |
| **Magic** | Blue | `#4A90E2` | 2.5 - 5.0 |
| **Rare** | Yellow/Gold | `#FFD700` | 5.0 - 7.5 |
| **Epic** | Purple | `#9B59B6` | 7.5 - 9.5 |
| **Legendary** | Bronze/Gold | `#CD7F32` | 9.5 - 10.0 |

### How Rarity is Determined

Rarity is calculated from **community metrics**:

```
Combined Score = (Rating × 40%) + (Usage × 30%) + (Quality × 30%)
```

- **Rating**: Community rating (0-10) based on script quality
- **Usage**: How many times the Diamond has been used
- **Quality**: Code quality score (0-10)

**The community rates Diamonds by:**
- Script quality and efficiency
- How well it works
- How useful it is
- Code cleanliness and security

## Obsidian Linking System

### How Links Work

Each Diamond has an Obsidian markdown file (`.md`) with:
- **Frontmatter**: Metadata (address, rarity, rating, etc.)
- **Content**: Description, connections, gems
- **Links**: `[[diamond-id]]` syntax linking to other Diamonds

### Example Link Structure

```
nervous-system-hub.md
├── Links to: [[diamond-0]], [[diamond-1]], [[diamond-2]]...
│
diamond-0.md
├── Links to: [[nervous-system-hub]], [[diamond-1]]
│
diamond-1.md
├── Links to: [[diamond-0]], [[diamond-2]]
```

**The "tree" is formed by these links** - creating a graph of connected Diamonds.

## The Ruby Program Tree Analogy

**Ruby Program:**
```ruby
def process(input)
  result1 = method_a(input)      # Diamond A
  result2 = method_b(result1)     # Diamond B
  result3 = method_c(result2)     # Diamond C
  return result3
end
```

**Diamond Tree:**
```
Diamond A (Entry Point)
    │
    ├──→ Diamond B (processes through gems)
    │       │
    │       ├──→ Diamond C
    │       └──→ Diamond D
    │
    └──→ Diamond E (alternative path)
```

**The links in Obsidian represent the execution path** - the "program tree" is the nervous system.

## Community Rating System

### How Ratings Work

1. **Initial Rating**: Based on code quality
2. **Community Votes**: Users rate Diamonds (1-10)
3. **Usage Tracking**: Each use increments usage count
4. **Dynamic Rarity**: Rarity updates as rating changes

### Rating Factors

- **Code Quality**: Clean, efficient, secure code
- **Functionality**: Does it work as intended?
- **Usefulness**: How valuable is it?
- **Documentation**: Is it well-documented?
- **Security**: Is it secure?

## Trading System

### Diamond Trading Contract

Diamonds can be **traded** based on:
- Rarity (higher rarity = higher value)
- Community Rating (higher rating = higher value)
- Usage Count (more usage = proven value)
- Script Quality (better code = higher value)

### Trading Flow

1. **List Diamond**: Owner lists Diamond with price
2. **Community Views**: Buyers see rarity, rating, usage
3. **Purchase**: Buyer pays, receives Diamond ownership
4. **Rating Updates**: New owner can update rating
5. **Rarity Recalculation**: Rarity updates based on new metrics

## Obsidian Vault Structure

```
obsidian_vault/
├── Index.md                    # Main index with all Diamonds
├── Diamond_Tree_Graph.md       # Mermaid graph visualization
├── nervous-system-hub.md       # Central hub (Legendary)
├── diamond-0.md               # Individual Diamond nodes
├── diamond-1.md
├── ...
└── diamond-400.md
```

## Graph Visualization

The system generates a **Mermaid graph** showing:
- All Diamonds as nodes
- Color-coded by rarity
- Connected by links (the "tree")
- Shows ratings and connections

**View in Obsidian**: Open `Diamond_Tree_Graph.md` to see the visual network.

## How It All Works Together

### 1. Diamond Creation
- Developer creates a Diamond contract
- Initial rating based on code review
- Starts as Common/Magic rarity

### 2. Community Usage
- Users deploy/use the Diamond
- Usage count increases
- Community rates the Diamond

### 3. Rarity Evolution
- As rating/usage increases, rarity upgrades
- Common → Magic → Rare → Epic → Legendary
- Color changes reflect new rarity

### 4. Tree Formation
- Diamonds link to each other (via `diamondCut` or connections)
- Links are recorded in Obsidian files
- Forms the "nervous system" tree

### 5. Trading
- High-rarity Diamonds become valuable
- Can be listed and traded
- Price based on rarity, rating, usage

## Example: Diamond Lifecycle

```
1. Creation
   Diamond created → Common (#FFFFFF)
   Rating: 2.0/10
   Usage: 0

2. Early Usage
   Community uses it → Usage: 50
   Rating improves → Rating: 4.5/10
   Upgrades to → Magic (Blue #4A90E2)

3. Popularity
   More users → Usage: 500
   High ratings → Rating: 7.8/10
   Upgrades to → Rare (Yellow #FFD700)

4. Excellence
   Heavy usage → Usage: 2000
   Perfect rating → Rating: 9.7/10
   Upgrades to → Legendary (Bronze #CD7F32)

5. Trading
   Listed for sale → High value
   Traded to new owner → Ownership transfer
   Continues to evolve
```

## The "Tree" Explained

**The tree is NOT a hierarchy** - it's a **network graph**:

```
        Hub (Legendary)
         /  |  \
        /   |   \
    Node A Node B Node C
     /|\    /|\    /|\
    ...    ...    ...
```

**Each link represents:**
- A connection between Diamonds
- An execution path (like Ruby method calls)
- A communication channel (rsync mechanism)
- A relationship in the nervous system

## Benefits

1. **Visual Knowledge Graph**: See how Diamonds connect
2. **Community-Driven Quality**: Best Diamonds rise to top
3. **Trading Economy**: Diamonds become valuable assets
4. **Discoverability**: Find related Diamonds via links
5. **Evolution Tracking**: See how Diamonds improve over time

## Usage

### View in Obsidian

1. Open Obsidian
2. Open vault: `/home/theos/obsidian_vault`
3. See graph view of all Diamonds
4. Click links to navigate between Diamonds
5. View rarity colors and ratings

### Trade Diamonds

```solidity
// List a Diamond
diamondTrading.listDiamond(diamondAddress, price);

// Buy a Diamond
diamondTrading.buyDiamond(listingId);

// Update rating
diamondTrading.updateRating(diamondAddress, newRating);
```

### Navigate the Tree

- Start at `Index.md` - see all Diamonds
- Click any `[[diamond-id]]` link to navigate
- Use graph view to see connections
- Follow links to explore the network

---

**The "tree" is the link structure. Each Diamond is a node. The links form the nervous system. And the community determines the rarity through use and rating.**
