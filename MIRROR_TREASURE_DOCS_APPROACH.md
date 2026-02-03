# Mirroring TreasureProject Documentation Approach

## How TreasureProject Handles Atlas Mine

### 1. Governance Documentation (`about-treasure/governance/README.md`)

**Their Approach:**
```markdown
Only MAGIC stakers (Harvesters and Governance Staking) and those with $MAGIC-WETH SLP in the Arbitrum LP Rewards contract are eligible to vote with gMAGIC.

_Note: the Atlas Mine has been sunsetted as part of_ [_TIP-23_](https://gov.treasure.lol/discussion/8902-tip23-atlas-mine-cataclysm-sunset) _as of January 2023._
```

**Key Points:**
- ✅ Simple, factual note
- ✅ Links to TIP-23 discussion
- ✅ States current mechanisms (Harvesters, Governance Staking)
- ✅ Historical reference in italics (subtle, not prominent)

### 2. Contract References (`references/contracts/README.md`)

**Their Approach:**
- Still lists Atlas Mine contract addresses
- Treated as historical reference
- No active functionality mentioned
- Just factual contract information

### 3. Staking Documentation (`about-treasure/what-is-magic/treasure-mine-staking.md`)

**Their Approach:**
- Title: "Staking $MAGIC"
- Focuses on **current** staking options:
  - Harvesters in Bridgeworld
  - SLP tokens in MAGIC-WETH SLP
- Mentions Atlas Mine only in historical context:
  > "Staking is no longer active on the Ethereum Mainnet, and you can no longer stake Loot, n, or AGLD for MAGIC."
- Links to Bridgeworld docs for details

### 4. Bridgeworld Reference (`SUMMARY.md`)

**Their Approach:**
- Links externally to: `[Bridgeworld](https://docs.bridgeworld.treasure.lol/)`
- Doesn't duplicate Bridgeworld content
- Points to official Bridgeworld docs

## Pattern to Mirror

1. **Simple, factual notes** - No long explanations
2. **Focus on current mechanisms** - Harvesters, Governance Staking
3. **Historical references** - Subtle, in italics or notes
4. **Link to official docs** - Don't duplicate, link out
5. **Clean structure** - Current first, historical second

## How to Apply to bridgeworld.lol

### Update Strategy:

1. **Keep Lore** (`lore.html`)
   - ✅ Keep as-is (historical/lore content)
   - Add subtle note at end (mirror their style):
     ```html
     <p class="historical-note">
       <em>Note: The Atlas Mine was sunsetted as part of TIP-23 as of January 2023.</em>
     </p>
     ```

2. **Update Gameplay** (`gameplay.html`, `index.html`)
   - Focus on **current** mechanisms: Harvesters
   - Remove active Atlas Mine references
   - Update to match their style: simple, factual

3. **Atlas Mine Section** (`index.html`)
   - Keep as historical/lore context
   - Add note similar to their governance note
   - Update description to reflect it's historical

4. **Meta Tags**
   - Remove "Atlas Mines" from active gameplay keywords
   - Focus on current features

## Implementation Plan

Following their pattern:
- ✅ Simple notes (not long explanations)
- ✅ Current mechanisms first
- ✅ Historical references subtle
- ✅ Clean, factual tone
- ✅ Link to official docs where appropriate
