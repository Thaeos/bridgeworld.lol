# Atlas Mine Content Update Plan

## Understanding

**bridgeworld.lol** is the **community-maintained version** for governance. Since you're the primary maintainer, we need to decide how to handle Atlas Mine content.

## Current Situation

### What We Know:
1. **Atlas Mine was sunsetted** in January 2023 (TIP-23)
2. **Current site** has multiple references to Atlas Mine as active
3. **Lore content** describes Atlas Mine as a location (this is fine - it's lore)
4. **Gameplay references** suggest active staking (needs updating)

### Key References Found:

**index.html** (line 568):
```html
Stake your MAGIC in the Atlas Mine, use it to craft treasures, or trade it on the open market.
```

**gameplay.html** (line 312):
```html
harvest MAGIC from the Atlas Mine
```

**lore.html** (lines 343-375):
- Full chapter "III. The Atlas Mine" - This is **lore/historical**, which is fine to keep

## Recommended Approach

### Option 1: Update to Current Mechanics (Recommended)

**Keep Lore, Update Gameplay:**

1. **Keep lore.html** - Atlas Mine chapter is historical/lore content ✅
2. **Update index.html** - Change "Stake your MAGIC in the Atlas Mine" to "Stake your MAGIC in Harvesters"
3. **Update gameplay.html** - Change "harvest MAGIC from the Atlas Mine" to "harvest MAGIC from Harvesters"
4. **Update meta descriptions** - Remove "Atlas Mines" from active gameplay keywords
5. **Keep navigation** - But update links to point to Harvesters section instead

### Option 2: Historical Archive Approach

If you want to preserve Atlas Mine as historical documentation:

1. Keep all current content
2. Add note: "The Atlas Mine was sunsetted in January 2023 (TIP-23). Current staking is done through Harvesters."
3. Create a historical section documenting what Atlas Mine was
4. Update gameplay to reflect current state

### Option 3: Community Governance Decision

Since this is community-governed:
1. Document the issue
2. Present options to community
3. Let governance decide how to handle historical content

## Specific Changes Needed

### index.html
- Line 7: Meta description - "Explore the Atlas Mines" → "Explore Harvesters"
- Line 8: Keywords - Remove "Atlas Mine" or mark as historical
- Line 17: OG description - Update to remove Atlas Mines
- Line 438: Navigation - Update link target
- Line 477-519: Atlas Mine section - Either update or add historical note
- Line 568: **CRITICAL** - "Stake your MAGIC in the Atlas Mine" → "Stake your MAGIC in Harvesters"

### gameplay.html
- Line 7: Meta description - Remove Atlas Mine reference
- Line 297: Navigation link - Update target
- Line 312: Description - "harvest MAGIC from the Atlas Mine" → "harvest MAGIC from Harvesters"

### lore.html
- **Keep as-is** - Lore content is historical and appropriate
- Optionally add: "Note: The Atlas Mine was sunsetted in January 2023 (TIP-23)"

## Migration Path

**From:** Atlas Mine (sunsetted Jan 2023)  
**To:** Harvesters (current staking mechanism)

**Current Staking Options:**
- Harvesters (bridgeworld.treasure.lol/harvesters/)
- Governance Staking (governance-staking.treasure.lol/)

## Next Steps

1. **Decide on approach** (Option 1, 2, or 3)
2. **Update content** accordingly
3. **Verify links** point to current mechanisms
4. **Test** all pages
5. **Deploy**

## Questions to Consider

1. Should Atlas Mine be completely removed or preserved as historical?
2. Do you want to document the migration from Atlas Mine → Harvesters?
3. Should lore content include a note about the sunset?
4. What does the community prefer?
