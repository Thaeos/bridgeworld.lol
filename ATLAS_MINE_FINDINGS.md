# Atlas Mine Research Findings

## Key Information Discovered

### From Brave Search & Documentation:

1. **Atlas Mine Status**: 
   - Destroyed in "Cataclysm early 2023" (TIP-23)
   - Corruption seeped into it
   - Players who staked in Atlas Mine received "Atlas Mine Ancient Permits"

2. **Migration Path**:
   - **Atlas Mine Ancient Permits** can be staked in **Afarit and Lupus Magus Harvesters**
   - 10,000 MAGIC per permit, max 40 permits per wallet
   - These permits were rewards for original 12-month stakers

3. **Current Lore Documentation**:
   - `docs.bridgeworld.treasure.lol/lore/bridgeworld/atlas-mine` still exists
   - Lore content is preserved in official docs
   - Your `lore.html` matches the official lore

4. **Historical Context** (from search results):
   - Atlas Mine allowed time-locked MAGIC staking (2 weeks to 12 months)
   - Longer lock = higher boost (up to 400% for 12 months)
   - No cap on MAGIC staking (unlike Harvesters)
   - Players could stake Legions, Treasures, and NFTs to boost mining power

## What This Means for bridgeworld.lol

### Current Content Status:

✅ **Lore Content** (`lore.html`):
- Matches official docs
- Historical/lore context is appropriate
- Can stay as-is OR add note about Cataclysm

⚠️ **Gameplay References** (needs updating):
- `index.html` line 568: "Stake your MAGIC in the Atlas Mine" → Should reference Harvesters
- `gameplay.html` line 312: "harvest MAGIC from the Atlas Mine" → Should reference Harvesters
- Meta descriptions mention "Atlas Mines" as active feature

✅ **Atlas Mine Section** (`index.html` lines 477-531):
- Currently describes Atlas Mine as active location
- Could be updated to historical/lore context
- OR updated to reflect current state (destroyed, Harvesters now)

## Recommended Approach

### Option A: Historical Preservation (Recommended for Community Site)

1. **Keep lore.html as-is** - It's historical/lore content ✅
2. **Update index.html Atlas Mine section** - Add note:
   ```html
   <div class="historical-note">
     <p><em>Note: The Atlas Mine was destroyed in the Cataclysm of early 2023 (TIP-23). 
     Players who staked in the Atlas Mine received Atlas Mine Ancient Permits, 
     which can now be used in the Afarit and Lupus Magus Harvesters.</em></p>
   </div>
   ```

3. **Update gameplay references**:
   - "Stake your MAGIC in the Atlas Mine" → "Stake your MAGIC in Harvesters"
   - "harvest MAGIC from the Atlas Mine" → "harvest MAGIC from Harvesters"

4. **Update meta descriptions** - Remove "Atlas Mines" from active gameplay keywords

### Option B: Complete Historical Archive

1. Keep all Atlas Mine content
2. Add comprehensive historical note about:
   - What Atlas Mine was
   - How it worked
   - Why it was destroyed (Cataclysm)
   - Migration to Harvesters
   - Atlas Mine Ancient Permits

### Option C: Minimal Update

1. Keep lore as-is
2. Update only active gameplay references
3. Add small note in Atlas Mine section about sunset

## Migration Information

**From Atlas Mine:**
- Time-locked MAGIC staking (2 weeks - 12 months)
- Boost based on lock duration (up to 400%)
- No cap on staking
- Staking Legions, Treasures, NFTs for boost

**To Harvesters:**
- Ancient Permits required (obtained from games/competitions)
- Atlas Mine Ancient Permits → Afarit & Lupus Magus Harvesters
- 10,000 MAGIC per permit, max 40 permits
- Different Harvesters have different permit requirements

## Next Steps

1. **Decide on approach** (A, B, or C)
2. **Update content** accordingly
3. **Verify** all links and references
4. **Test** pages
5. **Deploy**

## Questions for Community Governance

Since bridgeworld.lol is community-maintained:

1. Should Atlas Mine be preserved as historical documentation?
2. How detailed should the migration information be?
3. Should we document the full history of Atlas Mine mechanics?
4. What's the community preference for handling sunset features?
