# Bridgeworld Content Update Check

## Sources to Check

### Official Documentation
- **Bridgeworld Docs**: https://docs.bridgeworld.treasure.lol
- **Treasure Docs**: https://docs.treasure.lol
- **Bridgeworld Game**: https://bridgeworld.treasure.lol

### Content Areas to Verify

#### 1. Harvesters Status
Check if any harvester statuses have changed:
- Lupus Magus (Bridgeworld) - Currently: ACTIVE
- Emerion (Beacon) - Currently: ACTIVE
- Thundermane (KotE) - Currently: ACTIVE
- Emberwing (Zeeverse) - Currently: ACTIVE
- Destroyed: Shinoba, Asiterra, Kameji, Afarit

**Action**: Verify at https://bridgeworld.treasure.lol/harvesters/all

#### 2. Legion Classes
Check for new legion classes or updated stats:
- Genesis 1/1 (600% boost, 120kg)
- Genesis All Class (200% boost, 40kg)
- Genesis Uncommon (100% boost, 21kg)
- Genesis Special (75% boost, 16kg)
- Genesis Common (50% boost, 11kg)
- Auxiliary Rare (25% boost, 5.5kg)
- Auxiliary Uncommon (10% boost, 4kg)
- Auxiliary Common (5% boost, 2.5kg)

**Action**: Check official docs for any new classes

#### 3. Metabolic Boosters
Verify booster types and stats:
- Small Metabolic Booster (20%, 3h)
- Medium Metabolic Booster (25%, 3h)
- Large Metabolic Booster (30%, 3h)
- Durable Booster (20%, 4h)
- Anabolic Booster (40%, 2h)
- Overclocked Booster (90%, 1h)

**Action**: Check if any new boosters were added

#### 4. Lore Content
Verify lore chapters match latest bridgeworld-docs:
- Foundations
- Origins
- Atlas Mine
- Legions
- Harvesters

**Action**: Compare with https://docs.bridgeworld.treasure.lol

#### 5. MAGIC Utilization Boost
Check if utilization thresholds changed:
- Current: 5% minimum, 10% intervals up to 80%+
- Emissions: 20% to 100%

**Action**: Verify current mechanics

## Update Process

1. **Check Official Sources**: Visit the URLs above
2. **Compare Content**: Use diff tools to compare
3. **Update HTML**: Make necessary changes
4. **Test**: Verify all links and content
5. **Commit**: Commit updates with clear messages

## Automated Check Script

Run this to check for broken links:
```bash
./test-links.sh
```

## Notes

- Content should be sourced from official Treasure documentation
- Always maintain proper attribution
- Keep lore content consistent with game mechanics
- Update gameplay stats if game mechanics change
