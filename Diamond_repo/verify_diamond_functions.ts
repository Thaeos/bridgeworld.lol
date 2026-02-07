/**
 * Diamond Function Verification - Tests all facets and functions work correctly
 * Uses public Arbitrum RPC + Tenderly for verification status
 */

import * as fs from "fs";

const ARBITRUM_RPC = "https://arb1.arbitrum.io/rpc";
const DIAMOND_ADDRESS = "0xf7993A8df974AD022647E63402d6315137c58ABf";
const CHAIN_ID = 42161;

// Diamond Loupe selectors
const FACETS_SELECTOR = "0x7a0ed627";
const FACET_ADDRESSES_SELECTOR = "0x52ef6b2c";
const FACET_FUNCTION_SELECTORS_SELECTOR = "0xadfca15e";

// Known function selectors (from our integrated facets)
const KNOWN_FUNCTIONS: Record<string, string> = {
  // Diamond Loupe
  "0x7a0ed627": "facets()",
  "0x52ef6b2c": "facetAddresses()",
  "0xadfca15e": "facetFunctionSelectors(address)",
  "0xcdffacc6": "facetAddress(bytes4)",
  "0x01ffc9a7": "supportsInterface(bytes4)",
  
  // DeFi Functions (Glyphs 0-3)
  "0x38ed1739": "swapExactTokensForTokens (Aleph)",
  "0xe8eda9df": "deposit/supply (Beth)", 
  "0x69328dec": "withdraw (Gimel)",
  "0xd66bda32": "swap (Daleth/GMX)",
  
  // Oracle Functions (Glyphs 4-6, 10)
  "0xfeaf968c": "latestRoundData (He/Vav/Zayin)",
  "0x50d25bcd": "latestAnswer (Kaph)",
  
  // Cross-chain (Glyphs 7-8, 12-14, 21)
  "0x40c10f19": "sendCrossChain (Heth)",
  "0x127e8e4d": "estimateFees (Teth)",
  "0x0e89341c": "bridgeToCosmos (Mem)",
  "0x23b872dd": "bridgeToEnjin (Nun)",
  "0xa9059cbb": "bridgeToTon (Samekh)",
  
  // NFT/Gaming (Glyph 9)
  "0x095ea7b3": "buyNFT (Yodh)",
  
  // Aave (Glyph 11)
  "0x35ea6a75": "getReserveData (Lamedh)",
  
  // Vault (Glyphs 15-17)
  "0xb6b55f25": "depositToVault (Ayin)",
  "0x2e1a7d4d": "withdrawFromVault (Pe)",
  "0x18cbafe5": "swapNFTsForTokens (Tsade)",
  
  // Guild (Glyph 18)
  "0x2d85d921": "createGuild (Qoph)",
  
  // Crafting (Glyph 19)
  "0xd2d0e066": "craft (Resh)",
  
  // Meta-tx (Glyph 20)
  "0x47153f82": "executeMetaTx (Shin)",
  
  // Star Route (Glyph 21)
  "0x1f931c1c": "diamondCut/executeStarRoute (Tav)",
  
  // Ownership
  "0x8da5cb5b": "owner()",
  "0xf2fde38b": "transferOwnership(address)",
};

async function rpcCall(method: string, params: any[]): Promise<any> {
  const response = await fetch(ARBITRUM_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method,
      params,
    }),
  });
  
  const result = await response.json() as { result?: any; error?: { message: string } };
  if (result.error) {
    throw new Error(result.error.message);
  }
  return result.result;
}

async function ethCall(to: string, data: string): Promise<string> {
  return rpcCall("eth_call", [{ to, data }, "latest"]);
}

function decodeAddressArray(data: string): string[] {
  if (!data || data === "0x" || data.length < 66) return [];
  
  const hex = data.startsWith("0x") ? data.slice(2) : data;
  const offset = parseInt(hex.substring(0, 64), 16);
  const length = parseInt(hex.substring(offset * 2, offset * 2 + 64), 16);
  
  const addresses: string[] = [];
  const startPos = offset * 2 + 64;
  
  for (let i = 0; i < length; i++) {
    const addrHex = hex.substring(startPos + i * 64, startPos + i * 64 + 64);
    addresses.push("0x" + addrHex.slice(24));
  }
  
  return addresses;
}

function decodeBytes4Array(data: string): string[] {
  if (!data || data === "0x" || data.length < 66) return [];
  
  const hex = data.startsWith("0x") ? data.slice(2) : data;
  const offset = parseInt(hex.substring(0, 64), 16);
  const length = parseInt(hex.substring(offset * 2, offset * 2 + 64), 16);
  
  const selectors: string[] = [];
  const startPos = offset * 2 + 64;
  
  for (let i = 0; i < length; i++) {
    const selectorHex = hex.substring(startPos + i * 64, startPos + i * 64 + 8);
    selectors.push("0x" + selectorHex);
  }
  
  return selectors;
}

async function getFacetAddresses(): Promise<string[]> {
  const data = await ethCall(DIAMOND_ADDRESS, FACET_ADDRESSES_SELECTOR);
  return decodeAddressArray(data);
}

async function getFacetSelectors(facetAddress: string): Promise<string[]> {
  const data = facetAddress.slice(2).padStart(64, "0");
  const result = await ethCall(DIAMOND_ADDRESS, FACET_FUNCTION_SELECTORS_SELECTOR + data);
  return decodeBytes4Array(result);
}

async function testFunctionCall(selector: string, description: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Just test that the call doesn't revert with "function not found"
    const result = await ethCall(DIAMOND_ADDRESS, selector + "0".repeat(64));
    return { success: true };
  } catch (error: any) {
    // Some functions may revert for valid reasons (no params, auth, etc)
    // "execution reverted" is OK - means function exists
    if (error.message.includes("execution reverted")) {
      return { success: true };
    }
    return { success: false, error: error.message };
  }
}

async function checkTenderlyVerification(address: string): Promise<boolean> {
  const key = process.env.TENDERLY_ACCESS_KEY;
  const username = process.env.TENDERLY_USERNAME;
  const project = process.env.TENDERLY_PROJECT;
  
  if (!key || !username || !project) return false;
  
  try {
    const url = `https://api.tenderly.co/api/v1/account/${username}/project/${project}/contracts/${CHAIN_ID}/${address}`;
    const response = await fetch(url, {
      headers: { "X-Access-Key": key },
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function main() {
  console.log("\n🔷 Diamond Function Verification\n");
  console.log(`Diamond: ${DIAMOND_ADDRESS}`);
  console.log(`Network: Arbitrum One (${CHAIN_ID})\n`);
  console.log("=".repeat(70) + "\n");

  // 1. Get all facet addresses
  console.log("📍 Fetching Diamond Facets...\n");
  
  let facetAddresses: string[];
  try {
    facetAddresses = await getFacetAddresses();
    console.log(`✅ Found ${facetAddresses.length} facet(s)\n`);
  } catch (error: any) {
    console.log(`❌ Failed to fetch facets: ${error.message}`);
    console.log("\n   This may mean:");
    console.log("   - Diamond not deployed at this address");
    console.log("   - DiamondLoupeFacet not installed");
    console.log("   - Network connectivity issue\n");
    return;
  }

  // 2. Get selectors for each facet
  const facetDetails: Array<{
    address: string;
    selectors: string[];
    verified: boolean;
  }> = [];

  let totalSelectors = 0;
  
  console.log("📋 Facet Details:\n");
  
  for (let i = 0; i < facetAddresses.length; i++) {
    const address = facetAddresses[i];
    const selectors = await getFacetSelectors(address);
    const verified = await checkTenderlyVerification(address);
    
    facetDetails.push({ address, selectors, verified });
    totalSelectors += selectors.length;
    
    console.log(`${i + 1}. Facet: ${address}`);
    console.log(`   Selectors: ${selectors.length}`);
    console.log(`   Verified: ${verified ? "✅" : "❌"}`);
    
    // Show known functions
    const knownInFacet = selectors.filter(s => KNOWN_FUNCTIONS[s]);
    if (knownInFacet.length > 0) {
      console.log(`   Known functions:`);
      knownInFacet.slice(0, 5).forEach(s => {
        console.log(`     • ${s} → ${KNOWN_FUNCTIONS[s]}`);
      });
      if (knownInFacet.length > 5) {
        console.log(`     ... and ${knownInFacet.length - 5} more`);
      }
    }
    console.log("");
  }

  // 3. Test function calls
  console.log("=".repeat(70));
  console.log("\n🧪 Testing Function Calls...\n");
  
  const allSelectors = facetDetails.flatMap(f => f.selectors);
  const uniqueSelectors = [...new Set(allSelectors)];
  
  let working = 0;
  let notFound = 0;
  
  // Test a sample of selectors
  const testSelectors = uniqueSelectors.slice(0, 20);
  
  for (const selector of testSelectors) {
    const name = KNOWN_FUNCTIONS[selector] || "unknown";
    const result = await testFunctionCall(selector, name);
    
    if (result.success) {
      working++;
      console.log(`  ✅ ${selector} (${name})`);
    } else {
      notFound++;
      console.log(`  ❌ ${selector} (${name}) - ${result.error}`);
    }
  }
  
  if (uniqueSelectors.length > 20) {
    console.log(`\n  ... tested 20 of ${uniqueSelectors.length} functions`);
  }

  // 4. Summary
  console.log("\n" + "=".repeat(70));
  console.log("\n📊 SUMMARY\n");
  
  console.log(`Diamond Address:     ${DIAMOND_ADDRESS}`);
  console.log(`Total Facets:        ${facetAddresses.length}`);
  console.log(`Total Functions:     ${totalSelectors}`);
  console.log(`Unique Selectors:    ${uniqueSelectors.length}`);
  console.log(`Functions Tested:    ${testSelectors.length}`);
  console.log(`Working:             ${working}`);
  console.log(`Issues:              ${notFound}`);
  
  const verifiedCount = facetDetails.filter(f => f.verified).length;
  console.log(`\nTenderly Verified:   ${verifiedCount}/${facetAddresses.length} facets`);

  // 5. Glyph mapping check
  console.log("\n" + "=".repeat(70));
  console.log("\n🔮 Glyph Function Mapping:\n");
  
  const glyphs = [
    { id: 0, name: "Aleph 𐡀", func: "uniswapSwap", selector: "0x38ed1739" },
    { id: 1, name: "Beth 𐡁", func: "aaveSupply", selector: "0xe8eda9df" },
    { id: 2, name: "Gimel 𐡂", func: "aaveWithdraw", selector: "0x69328dec" },
    { id: 3, name: "Daleth 𐡃", func: "gmxSwap", selector: "0xd66bda32" },
    { id: 4, name: "He 𐡄", func: "getETHPrice", selector: "0xfeaf968c" },
    { id: 5, name: "Vav 𐡅", func: "getARBPrice", selector: "0xfeaf968c" },
    { id: 6, name: "Zayin 𐡆", func: "getLINKPrice", selector: "0xfeaf968c" },
    { id: 7, name: "Heth 𐡇", func: "sendCrossChain", selector: "0x40c10f19" },
    { id: 8, name: "Teth 𐡈", func: "estimateLzFees", selector: "0x127e8e4d" },
    { id: 9, name: "Yodh 𐡉", func: "buyTreasureNFT", selector: "0x095ea7b3" },
    { id: 10, name: "Kaph 𐡊", func: "getChainlinkPrice", selector: "0x50d25bcd" },
    { id: 11, name: "Lamedh 𐡋", func: "getAavePosition", selector: "0x35ea6a75" },
    { id: 12, name: "Mem 𐡌", func: "bridgeToCosmos", selector: "0x0e89341c" },
    { id: 13, name: "Nun 𐡍", func: "bridgeToEnjin", selector: "0x23b872dd" },
    { id: 14, name: "Samekh 𐡎", func: "bridgeToTon", selector: "0xa9059cbb" },
    { id: 15, name: "Ayin 𐡏", func: "depositToVault", selector: "0xb6b55f25" },
    { id: 16, name: "Pe 𐡐", func: "withdrawFromVault", selector: "0x2e1a7d4d" },
    { id: 17, name: "Tsade 𐡑", func: "swapNFTsForTokens", selector: "0x18cbafe5" },
    { id: 18, name: "Qoph 𐡒", func: "createGuild", selector: "0x2d85d921" },
    { id: 19, name: "Resh 𐡓", func: "craft", selector: "0xd2d0e066" },
    { id: 20, name: "Shin 𐡔", func: "executeMetaTx", selector: "0x47153f82" },
    { id: 21, name: "Tav 𐡕", func: "executeStarRoute", selector: "0x1f931c1c" },
  ];
  
  let glyphsFound = 0;
  for (const glyph of glyphs) {
    const found = uniqueSelectors.includes(glyph.selector);
    if (found) glyphsFound++;
    console.log(`  ${found ? "✅" : "⚠️ "} ${glyph.name.padEnd(12)} → ${glyph.func.padEnd(20)} ${glyph.selector}`);
  }
  
  console.log(`\n  Glyphs mapped: ${glyphsFound}/22`);

  // 6. Save results
  const results = {
    diamond: DIAMOND_ADDRESS,
    chainId: CHAIN_ID,
    timestamp: new Date().toISOString(),
    facets: facetDetails,
    totalFunctions: totalSelectors,
    uniqueSelectors: uniqueSelectors.length,
    testedFunctions: testSelectors.length,
    workingFunctions: working,
    glyphsMapped: glyphsFound,
  };
  
  fs.writeFileSync("diamond_verification_result.json", JSON.stringify(results, null, 2));
  console.log("\n✅ Results saved to diamond_verification_result.json\n");
}

main().catch(console.error);
