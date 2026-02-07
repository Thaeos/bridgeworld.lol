/**
 * Script Registry System
 * 
 * Records all scripts so that if used verbatim, royalties apply.
 * 
 * Purpose:
 * - Register scripts with hash/checksum
 * - Detect verbatim usage of registered scripts
 * - Apply royalties when verbatim code is detected
 * - Protect intellectual property
 * - Ensure proper attribution
 */

import * as fs from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';

interface RegisteredScript {
  scriptId: string;
  filename: string;
  filepath: string;
  hash: string; // SHA-256 hash of script content
  contentHash: string; // Hash of normalized content (whitespace removed)
  lineCount: number;
  characterCount: number;
  registeredAt: string;
  registeredBy: string;
  license: 'royalty_on_verbatim' | 'attribution_required' | 'open_source';
  royaltyPercentage?: number; // Royalty if used verbatim
  author: string;
  description?: string;
}

interface VerbatimUsage {
  usageId: string;
  detectedAt: string;
  originalScriptId: string;
  originalScript: RegisteredScript;
  detectedScript: {
    filename: string;
    filepath: string;
    hash: string;
    contentHash: string;
  };
  similarity: number; // 0-100 (100 = verbatim)
  verbatim: boolean; // True if exact match
  royaltiesApplied: boolean;
  royaltyAmount?: number;
  detectedIn: string; // Where it was detected (repo URL, contract address, etc.)
}

interface ScriptRegistry {
  scripts: RegisteredScript[];
  verbatimUsages: VerbatimUsage[];
  totalRoyaltiesGenerated: number;
  lastUpdated: string;
}

const REGISTRY_DIR = path.join(process.cwd(), 'script_registry');
const REGISTRY_FILE = path.join(REGISTRY_DIR, 'registry.json');
const VERBATIM_DETECTION_FILE = path.join(REGISTRY_DIR, 'verbatim_detections.json');

// Normalize script content for comparison (remove whitespace, comments, etc.)
function normalizeScriptContent(content: string): string {
  // Remove comments (single-line and multi-line)
  let normalized = content
    .replace(/\/\/.*$/gm, '') // Single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, ''); // Multi-line comments
  
  // Remove extra whitespace
  normalized = normalized
    .replace(/\s+/g, ' ') // Multiple spaces to single space
    .replace(/\s*{\s*/g, '{') // Spaces around braces
    .replace(/\s*}\s*/g, '}')
    .replace(/\s*\(\s*/g, '(')
    .replace(/\s*\)\s*/g, ')')
    .replace(/\s*=\s*/g, '=')
    .replace(/\s*;\s*/g, ';')
    .trim();
  
  return normalized;
}

// Calculate hash of script content
function calculateScriptHash(content: string, normalized: boolean = false): string {
  const contentToHash = normalized ? normalizeScriptContent(content) : content;
  return createHash('sha256').update(contentToHash).digest('hex');
}

// Register a script
function registerScript(
  filepath: string,
  author: string = 'System',
  license: 'royalty_on_verbatim' | 'attribution_required' | 'open_source' = 'royalty_on_verbatim',
  royaltyPercentage: number = 5.0, // Default 5% royalty on verbatim usage
  description?: string
): RegisteredScript {
  if (!fs.existsSync(filepath)) {
    throw new Error(`Script file not found: ${filepath}`);
  }
  
  const content = fs.readFileSync(filepath, 'utf-8');
  const filename = path.basename(filepath);
  const hash = calculateScriptHash(content, false);
  const contentHash = calculateScriptHash(content, true); // Normalized hash
  
  const script: RegisteredScript = {
    scriptId: createHash('md5').update(filepath + hash).digest('hex').substring(0, 16),
    filename,
    filepath,
    hash,
    contentHash,
    lineCount: content.split('\n').length,
    characterCount: content.length,
    registeredAt: new Date().toISOString(),
    registeredBy: author,
    license,
    royaltyPercentage: license === 'royalty_on_verbatim' ? royaltyPercentage : undefined,
    author,
    description
  };
  
  // Load registry
  let registry: ScriptRegistry = {
    scripts: [],
    verbatimUsages: [],
    totalRoyaltiesGenerated: 0,
    lastUpdated: new Date().toISOString()
  };
  
  if (fs.existsSync(REGISTRY_FILE)) {
    registry = JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf-8'));
  }
  
  // Check if already registered
  const existing = registry.scripts.find(s => s.hash === hash || s.contentHash === contentHash);
  if (existing) {
    console.log(`⚠️  Script already registered: ${existing.filename} (${existing.scriptId})`);
    return existing;
  }
  
  // Add to registry
  registry.scripts.push(script);
  registry.lastUpdated = new Date().toISOString();
  
  // Ensure directory exists
  if (!fs.existsSync(REGISTRY_DIR)) {
    fs.mkdirSync(REGISTRY_DIR, { recursive: true });
  }
  
  // Save registry
  fs.writeFileSync(REGISTRY_FILE, JSON.stringify(registry, null, 2));
  
  console.log(`\n✅ Script Registered!\n`);
  console.log(`   Script ID: ${script.scriptId}`);
  console.log(`   Filename: ${filename}`);
  console.log(`   Hash: ${hash.substring(0, 16)}...`);
  console.log(`   Content Hash: ${contentHash.substring(0, 16)}...`);
  console.log(`   License: ${license}`);
  if (royaltyPercentage) {
    console.log(`   Royalty on Verbatim: ${royaltyPercentage}%`);
  }
  console.log(`   Author: ${author}\n`);
  
  return script;
}

// Detect verbatim usage of registered scripts
function detectVerbatimUsage(
  scriptContent: string,
  detectedIn: string, // Repo URL, contract address, file path, etc.
  checkNormalized: boolean = true
): VerbatimUsage[] {
  if (!fs.existsSync(REGISTRY_FILE)) {
    return [];
  }
  
  const registry: ScriptRegistry = JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf-8'));
  const detectedHashes: VerbatimUsage[] = [];
  
  const scriptHash = calculateScriptHash(scriptContent, false);
  const scriptContentHash = calculateScriptHash(scriptContent, true);
  
  for (const registeredScript of registry.scripts) {
    let verbatim = false;
    let similarity = 0;
    
    // Check exact hash match
    if (scriptHash === registeredScript.hash) {
      verbatim = true;
      similarity = 100;
    }
    // Check normalized content hash match (verbatim logic, different formatting)
    else if (checkNormalized && scriptContentHash === registeredScript.contentHash) {
      verbatim = true;
      similarity = 100;
    }
    // Check similarity (for near-verbatim)
    else {
      // Calculate similarity percentage
      const normalizedOriginal = normalizeScriptContent(
        fs.readFileSync(registeredScript.filepath, 'utf-8')
      );
      const normalizedDetected = normalizeScriptContent(scriptContent);
      
      // Simple similarity calculation (can be improved)
      const longer = normalizedOriginal.length > normalizedDetected.length 
        ? normalizedOriginal 
        : normalizedDetected;
      const shorter = normalizedOriginal.length > normalizedDetected.length 
        ? normalizedDetected 
        : normalizedOriginal;
      
      if (longer.length === 0) {
        similarity = 100;
      } else {
        let matches = 0;
        for (let i = 0; i < shorter.length; i++) {
          if (longer.includes(shorter[i])) matches++;
        }
        similarity = (matches / longer.length) * 100;
      }
      
      // Consider verbatim if >95% similar
      verbatim = similarity >= 95;
    }
    
    if (verbatim) {
      const usage: VerbatimUsage = {
        usageId: createHash('sha256')
          .update(scriptContent + registeredScript.scriptId + detectedIn)
          .digest('hex')
          .substring(0, 16),
        detectedAt: new Date().toISOString(),
        originalScriptId: registeredScript.scriptId,
        originalScript: registeredScript,
        detectedScript: {
          filename: path.basename(detectedIn),
          filepath: detectedIn,
          hash: scriptHash,
          contentHash: scriptContentHash
        },
        similarity,
        verbatim: true,
        royaltiesApplied: false,
        detectedIn
      };
      
      // Calculate royalties if applicable
      if (registeredScript.license === 'royalty_on_verbatim' && registeredScript.royaltyPercentage) {
        // Royalty calculation would depend on context (contract value, transaction value, etc.)
        // For now, mark as detected
        usage.royaltiesApplied = true;
        usage.royaltyAmount = 0; // To be calculated based on usage context
      }
      
      detectedHashes.push(usage);
      
      // Save detection
      saveVerbatimDetection(usage);
      
      console.log(`\n⚠️  Verbatim Usage Detected!\n`);
      console.log(`   Original Script: ${registeredScript.filename} (${registeredScript.scriptId})`);
      console.log(`   Detected In: ${detectedIn}`);
      console.log(`   Similarity: ${similarity.toFixed(2)}%`);
      console.log(`   Verbatim: ${verbatim ? 'YES' : 'NO'}`);
      console.log(`   License: ${registeredScript.license}`);
      if (registeredScript.royaltyPercentage) {
        console.log(`   Royalty: ${registeredScript.royaltyPercentage}% (on verbatim usage)`);
      }
      console.log(`   Author: ${registeredScript.author}\n`);
    }
  }
  
  return detectedHashes;
}

// Save verbatim detection
function saveVerbatimDetection(usage: VerbatimUsage): void {
  let detections: VerbatimUsage[] = [];
  
  if (fs.existsSync(VERBATIM_DETECTION_FILE)) {
    detections = JSON.parse(fs.readFileSync(VERBATIM_DETECTION_FILE, 'utf-8'));
  }
  
  // Check if already detected
  const existing = detections.find(d => d.usageId === usage.usageId);
  if (existing) {
    return; // Already recorded
  }
  
  detections.push(usage);
  
  // Update registry totals
  if (fs.existsSync(REGISTRY_FILE)) {
    const registry: ScriptRegistry = JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf-8'));
    registry.verbatimUsages.push(usage);
    if (usage.royaltyAmount) {
      registry.totalRoyaltiesGenerated += usage.royaltyAmount;
    }
    registry.lastUpdated = new Date().toISOString();
    fs.writeFileSync(REGISTRY_FILE, JSON.stringify(registry, null, 2));
  }
  
  fs.writeFileSync(VERBATIM_DETECTION_FILE, JSON.stringify(detections, null, 2));
}

// Register all scripts in project
function registerAllScripts(
  directory: string = process.cwd(),
  author: string = 'System',
  license: 'royalty_on_verbatim' | 'attribution_required' | 'open_source' = 'royalty_on_verbatim',
  royaltyPercentage: number = 5.0
): RegisteredScript[] {
  const scripts: RegisteredScript[] = [];
  const scriptExtensions = ['.ts', '.js', '.sol', '.py', '.rs', '.go'];
  
  function walkDir(dir: string): void {
    try {
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const filepath = path.join(dir, file);
        
        try {
          const stat = fs.statSync(filepath);
          
          if (stat.isDirectory()) {
            // Skip node_modules, .git, etc.
            if (!file.startsWith('.') && file !== 'node_modules' && file !== 'light_codes' && file !== 'script_registry') {
              walkDir(filepath);
            }
          } else if (stat.isFile()) {
            const ext = path.extname(file);
            if (scriptExtensions.includes(ext)) {
              try {
                const registered = registerScript(filepath, author, license, royaltyPercentage);
                scripts.push(registered);
              } catch (error) {
                // Skip errors silently for now
              }
            }
          }
        } catch (error) {
          // Skip broken symlinks or inaccessible files
          continue;
        }
      }
    } catch (error) {
      // Skip inaccessible directories
      return;
    }
  }
  
  walkDir(directory);
  
  console.log(`\n✅ Registered ${scripts.length} scripts\n`);
  
  return scripts;
}

// Generate registry report
function generateRegistryReport(): void {
  if (!fs.existsSync(REGISTRY_FILE)) {
    console.log('❌ No scripts registered yet');
    return;
  }
  
  const registry: ScriptRegistry = JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf-8'));
  
  console.log(`\n📊 Script Registry Report\n`);
  console.log(`   Total Scripts Registered: ${registry.scripts.length}`);
  console.log(`   Verbatim Usages Detected: ${registry.verbatimUsages.length}`);
  console.log(`   Total Royalties Generated: ${registry.totalRoyaltiesGenerated.toFixed(6)} ETH`);
  console.log(`   Last Updated: ${registry.lastUpdated}\n`);
  
  if (registry.scripts.length > 0) {
    console.log(`   Registered Scripts:\n`);
    registry.scripts.forEach((script, i) => {
      console.log(`   ${i + 1}. ${script.filename} (${script.scriptId})`);
      console.log(`      Author: ${script.author}`);
      console.log(`      License: ${script.license}`);
      if (script.royaltyPercentage) {
        console.log(`      Royalty: ${script.royaltyPercentage}%`);
      }
      console.log(`      Hash: ${script.hash.substring(0, 16)}...\n`);
    });
  }
  
  if (registry.verbatimUsages.length > 0) {
    console.log(`   Verbatim Usages:\n`);
    registry.verbatimUsages.forEach((usage, i) => {
      console.log(`   ${i + 1}. ${usage.originalScript.filename} → ${usage.detectedIn}`);
      console.log(`      Similarity: ${usage.similarity.toFixed(2)}%`);
      console.log(`      Detected: ${usage.detectedAt}\n`);
    });
  }
}

// CLI interface
function main() {
  const args = process.argv.slice(2);
  
  if (args[0] === 'register' && args[1]) {
    const filepath = args[1];
    const author = args[2] || 'System';
    const license = (args[3] as any) || 'royalty_on_verbatim';
    const royalty = args[4] ? parseFloat(args[4]) : 5.0;
    
    try {
      registerScript(filepath, author, license, royalty);
    } catch (error) {
      console.error(`❌ Error: ${error}`);
    }
    return;
  }
  
  if (args[0] === 'register-all') {
    const author = args[1] || 'System';
    const license = (args[2] as any) || 'royalty_on_verbatim';
    const royalty = args[3] ? parseFloat(args[3]) : 5.0;
    
    registerAllScripts(process.cwd(), author, license, royalty);
    return;
  }
  
  if (args[0] === 'detect' && args[1]) {
    const filepath = args[1];
    const detectedIn = args[2] || filepath;
    
    if (!fs.existsSync(filepath)) {
      console.error(`❌ File not found: ${filepath}`);
      return;
    }
    
    const content = fs.readFileSync(filepath, 'utf-8');
    const detections = detectVerbatimUsage(content, detectedIn);
    
    if (detections.length === 0) {
      console.log(`✅ No verbatim usage detected in ${filepath}`);
    }
    return;
  }
  
  if (args[0] === 'report') {
    generateRegistryReport();
    return;
  }
  
  console.log(`
📝 Script Registry System

Records scripts so that if used verbatim, royalties apply.

Usage:
  npm run registry register <filepath> [author] [license] [royalty%]
  npm run registry register-all [author] [license] [royalty%]
  npm run registry detect <filepath> [detected-in]
  npm run registry report

Examples:
  npm run registry register script.ts "Author Name" royalty_on_verbatim 5.0
  npm run registry register-all "Author Name"
  npm run registry detect suspicious_script.ts "https://github.com/user/repo"
  npm run registry report

Licenses:
  royalty_on_verbatim - Royalty applies if used verbatim
  attribution_required - Attribution required, no royalty
  open_source - Open source, no restrictions

Features:
  - Register scripts with hash/checksum
  - Detect verbatim usage
  - Apply royalties when verbatim code detected
  - Protect intellectual property
  - Ensure proper attribution
`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  registerScript,
  registerAllScripts,
  detectVerbatimUsage,
  generateRegistryReport,
  RegisteredScript,
  VerbatimUsage,
  ScriptRegistry
};
