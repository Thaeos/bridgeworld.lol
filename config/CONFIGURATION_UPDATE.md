# Bridgeworld.lol Configuration Update

**Date**: 2026-01-14  
**Status**: ✅ Updated with Latest Configuration

## What Was Updated

This repository has been updated with the current configuration:

### 1. ENS Domain Configuration
- **ENS Name**: `θεός°•.eth` (corrected - not subdomains)
- **Owner Address**: `0x9B1D38e00898625BBeECE55d39109A907A3fcFfA`
- **Registry**: `0xfa05997C66437dCCAe860af334b30d69E0De24DC`
- **Text Records**: All 22 contracts stored as text records on `θεός°•.eth`

### 2. 22 TreasureDAO Contracts
- Complete mapping of all 22 contracts (Aleph through Taw)
- Aramaic glyphs for each contract
- Contract addresses on Arbitrum One
- ENS text record keys for each contract
- Verified contracts marked

### 3. Master Key NFT
- **IPFS CID**: `vQSMpXuEy9NrcjDsoQK2RxHxGKTyvCWsqFjzqSnPMck`
- **Recipient**: `0x9b1d38e00898625bbeece55d39109a907a3fcffa`
- **Network**: Sei Network (Chain ID: 1328)
- **Marketplace**: SKYNET (https://skynet.sei.io)
- **Status**: Pending mint

### 4. .x402 Contract
- **Contract**: `0x233f3956d82bfea9E78B2BdB0a9D245193881870`
- **Ticker**: THO
- **Network**: Base (Chain ID: 8453)
- **Pool**: https://dexscreener.com/base/0xc0B518AD8f598D1F830c357f31295E0fEC3dcb58

### 5. Cloudflare Domain
- **Domain**: `bridgeworld.lol`
- **URL**: https://bridgeworld.lol
- **Owner**: `0x9B1D38e00898625BBeECE55d39109A907A3fcFfA`

### 6. Ethermail
- `0x9b1d38e00898625bbeece55d39109a907a3fcffa@ethermail.io`
- `θεός°•.eth@ethermail.io`

## New Configuration File

**File**: `/root/bridgeworld.lol/config/treasure-dao-contracts.json`

This file contains:
- Complete ENS configuration
- All 22 TreasureDAO contracts with glyphs
- Master Key NFT information
- .x402 contract details
- Cloudflare domain info
- Ethermail addresses

## Updated Files

1. **next.config.js** - Added new environment variables:
   - `NEXT_PUBLIC_ENS_DOMAIN`
   - `NEXT_PUBLIC_ENS_OWNER`
   - `NEXT_PUBLIC_MAGIC_TOKEN`
   - `NEXT_PUBLIC_CLOUDFLARE_DOMAIN`

2. **config/treasure-dao-contracts.json** - Complete contract registry

## Integration Points

The bridgeworld.lol portal can now:
- Display all 22 TreasureDAO contracts
- Show Aramaic glyph mappings
- Link to ENS text records
- Display Master Key NFT information
- Show .x402 contract details
- Reference verified contracts

## Next Steps

1. Update components to use new configuration
2. Integrate ENS text record lookups
3. Display contract registry with glyphs
4. Link to Master Key NFT on Sei SKYNET
5. Show .x402 contract information
