# ⚠️ Atlas Mine Content Issue

## Critical Finding

The **treasure-docs** repository indicates that the **Atlas Mine was sunsetted in January 2023** as part of TIP-23.

However, the **Bridgeworld.lol** site still contains **multiple active references** to the Atlas Mine as if it's a current feature.

## References Found in Bridgeworld.lol

### index.html
- Meta description: "Explore the Atlas Mines, discover MAGIC"
- Keywords: "Atlas Mine"
- Navigation link: `<a href="#atlas">Atlas Mine</a>`
- Section title: "The Atlas Mine"
- Content: "Stake your MAGIC in the Atlas Mine, use it to craft treasures..."
- Multiple mentions of Atlas Mine as active feature

### lore.html
- Meta description: "Atlas Mine, Legions, and Harvesters"
- Keywords: "Atlas Mine"
- Navigation links to Atlas Mine
- Full chapter: "III. The Atlas Mine"
- Lore content describing Atlas Mine as active location

### gameplay.html
- Navigation link: `<a href="index.html#atlas">Atlas Mine</a>`
- Description: "harvest MAGIC from the Atlas Mine"

## Documentation Source

**From** `/mnt/Vault/TreasureProject/about-treasure/governance/README.md`:
> "Note: the Atlas Mine has been sunsetted as part of TIP-23 as of January 2023."

**Reference**: https://gov.treasure.lol/discussion/8902-tip23-atlas-mine-cataclysm-sunset

## Decision Required

Before deployment, decide how to handle Atlas Mine references:

### Option 1: Remove/Update References
- Remove Atlas Mine from active gameplay descriptions
- Update meta descriptions and keywords
- Keep lore chapter but add note about sunset
- Update navigation to remove active links

### Option 2: Keep as Historical/Lore
- Keep lore content (historical context)
- Update gameplay references to indicate it's sunset
- Add note: "The Atlas Mine was sunsetted in January 2023"
- Update meta descriptions to remove active references

### Option 3: Verify Status
- Confirm with Treasure team if Atlas Mine is truly sunset
- Check if there's a replacement mechanism
- Verify if lore-only references are acceptable

## Recommended Action

**Before deploying**, update:
1. ✅ Remove "Atlas Mine" from active gameplay descriptions
2. ✅ Update meta descriptions to remove "Atlas Mines" (plural)
3. ✅ Add historical note in lore if keeping the chapter
4. ✅ Update navigation if Atlas Mine section is removed
5. ✅ Verify current MAGIC staking mechanisms (now Harvesters only)

## Current Status

- [ ] Atlas Mine references reviewed
- [ ] Decision made on how to handle
- [ ] Content updated accordingly
- [ ] Ready for deployment
