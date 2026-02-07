/**
 * Script Computation System
 * 
 * Combines Aramaic (RTL) + Greek + Mathematical symbols to create
 * computation formulas that evolve and transform scripts.
 * 
 * Concept:
 * - Aramaic glyphs read right-to-left (RTL)
 * - Greek letters + Math symbols form computation formulas
 * - Formulas transform scripts, allowing evolution and shape changes
 * - Mix/match different scripts to create new computational patterns
 */

import * as fs from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';

// Aramaic Glyphs (RTL - Right to Left)
const ARAMAIC_GLYPHS: Record<string, string> = {
  '𐡀': 1,   // Aleph
  '𐡁': 2,   // Beth
  '𐡂': 3,   // Gimel
  '𐡃': 4,   // Daleth
  '𐡄': 5,   // He
  '𐡅': 6,   // Waw
  '𐡆': 7,   // Zayin
  '𐡇': 8,   // Heth
  '𐡈': 9,   // Teth
  '𐡉': 10,  // Yodh
  '𐡊': 11,  // Kaph
  '𐡋': 12,  // Lamedh
  '𐡌': 13,  // Mem
  '𐡍': 14,  // Nun
  '𐡎': 15,  // Samekh
  '𐡏': 16,  // Ayin
  '𐡐': 17,  // Pe
  '𐡑': 18,  // Sadhe
  '𐡒': 19,  // Qoph
  '𐡓': 20,  // Resh
  '𐡔': 21,  // Shin
  '𐡕': 22,  // Taw
};

// Greek Letters (for formulas)
const GREEK_LETTERS: Record<string, string> = {
  'α': 'alpha',
  'β': 'beta',
  'γ': 'gamma',
  'δ': 'delta',
  'ε': 'epsilon',
  'ζ': 'zeta',
  'η': 'eta',
  'θ': 'theta',
  'ι': 'iota',
  'κ': 'kappa',
  'λ': 'lambda',
  'μ': 'mu',
  'ν': 'nu',
  'ξ': 'xi',
  'ο': 'omicron',
  'π': 'pi',
  'ρ': 'rho',
  'σ': 'sigma',
  'τ': 'tau',
  'υ': 'upsilon',
  'φ': 'phi',
  'χ': 'chi',
  'ψ': 'psi',
  'ω': 'omega',
  // Uppercase
  'Α': 'Alpha',
  'Β': 'Beta',
  'Γ': 'Gamma',
  'Δ': 'Delta',
  'Ε': 'Epsilon',
  'Ζ': 'Zeta',
  'Η': 'Eta',
  'Θ': 'Theta',
  'Ι': 'Iota',
  'Κ': 'Kappa',
  'Λ': 'Lambda',
  'Μ': 'Mu',
  'Ν': 'Nu',
  'Ξ': 'Xi',
  'Ο': 'Omicron',
  'Π': 'Pi',
  'Ρ': 'Rho',
  'Σ': 'Sigma',
  'Τ': 'Tau',
  'Υ': 'Upsilon',
  'Φ': 'Phi',
  'Χ': 'Chi',
  'Ψ': 'Psi',
  'Ω': 'Omega',
};

// Mathematical Symbols for Computation
const MATH_SYMBOLS: Record<string, string> = {
  '+': 'add',
  '-': 'subtract',
  '*': 'multiply',
  '/': 'divide',
  '=': 'equals',
  '≠': 'not_equals',
  '≈': 'approximately',
  '>': 'greater_than',
  '<': 'less_than',
  '≥': 'greater_equal',
  '≤': 'less_equal',
  '∑': 'sum',
  '∏': 'product',
  '∫': 'integral',
  '√': 'square_root',
  '∞': 'infinity',
  'π': 'pi_constant',
  'Δ': 'delta',
  '∇': 'nabla',
  '∂': 'partial',
  'α': 'alpha',
  'β': 'beta',
  'γ': 'gamma',
  'θ': 'theta',
  'λ': 'lambda',
  'μ': 'mu',
  'σ': 'sigma',
  'φ': 'phi',
  'ω': 'omega',
  '→': 'arrow_right',
  '←': 'arrow_left',
  '↔': 'arrow_bidirectional',
  '∈': 'element_of',
  '∉': 'not_element_of',
  '⊂': 'subset',
  '∪': 'union',
  '∩': 'intersection',
  '∅': 'empty_set',
  '∧': 'and',
  '∨': 'or',
  '¬': 'not',
  '⊕': 'xor',
  '⊗': 'tensor',
  '°': 'degree',
  '•': 'dot',
  '×': 'cross',
  '÷': 'divide_alt',
};

interface ComputationFormula {
  id: string;
  name: string;
  formula: string; // Mix of Aramaic (RTL) + Greek + Math symbols
  description: string;
  inputType: 'aramaic' | 'greek' | 'mixed';
  outputType: 'aramaic' | 'greek' | 'mixed' | 'numeric';
  transformation: (input: string) => string;
}

// Convert Aramaic glyphs to numeric values (RTL reading)
function aramaicToNumeric(aramaicText: string): number {
  // Read RTL: reverse the string for processing
  const rtlReversed = aramaicText.split('').reverse().join('');
  
  let total = 0;
  for (const glyph of rtlReversed) {
    const value = ARAMAIC_GLYPHS[glyph];
    if (value) {
      total += value;
    }
  }
  return total;
}

// Convert numeric to Aramaic (RTL output)
function numericToAramaic(value: number): string {
  const glyphs: string[] = [];
  let remaining = value;
  
  // Use largest values first (RTL order)
  const sortedGlyphs = Object.entries(ARAMAIC_GLYPHS)
    .sort((a, b) => b[1] - a[1]);
  
  for (const [glyph, glyphValue] of sortedGlyphs) {
    while (remaining >= glyphValue) {
      glyphs.push(glyph);
      remaining -= glyphValue;
    }
  }
  
  // Reverse for RTL display
  return glyphs.reverse().join('');
}

// Parse computation formula (handles RTL Aramaic + Greek + Math)
function parseFormula(formula: string): {
  aramaicParts: string[];
  greekParts: string[];
  mathParts: string[];
  direction: 'ltr' | 'rtl';
} {
  const aramaicParts: string[] = [];
  const greekParts: string[] = [];
  const mathParts: string[] = [];
  
  // Detect RTL markers
  const hasRTL = /[\u1080-\u109F\u0800-\u083F]/.test(formula); // Aramaic/Syriac ranges
  
  for (const char of formula) {
    if (ARAMAIC_GLYPHS[char]) {
      aramaicParts.push(char);
    } else if (GREEK_LETTERS[char] || /[α-ωΑ-Ω]/.test(char)) {
      greekParts.push(char);
    } else if (MATH_SYMBOLS[char] || /[+\-*/=<>∑∏∫√∞πΔ∇∂→←↔∈∉⊂∪∩∅∧∨¬⊕⊗°•×÷]/.test(char)) {
      mathParts.push(char);
    }
  }
  
  return {
    aramaicParts,
    greekParts,
    mathParts,
    direction: hasRTL ? 'rtl' : 'ltr'
  };
}

// Computation Formulas
const COMPUTATION_FORMULAS: ComputationFormula[] = [
  {
    id: 'evolution_1',
    name: 'Evolution: Multiply by Pi',
    formula: '𐡀 × π → β',
    description: 'Transform Aramaic glyph by multiplying with π, output Greek',
    inputType: 'aramaic',
    outputType: 'greek',
    transformation: (input: string) => {
      const num = aramaicToNumeric(input);
      const result = Math.floor(num * Math.PI);
      // Convert to Greek letter (modulo 24 for Greek alphabet)
      const greekIndex = result % 24;
      const greekLetters = 'αβγδεζηθικλμνξοπρστυφχψω';
      return greekLetters[greekIndex] || 'α';
    }
  },
  {
    id: 'evolution_2',
    name: 'Evolution: Sum and Transform',
    formula: '∑(𐡀, 𐡄, 𐡉) → σ',
    description: 'Sum Aramaic values, output Sigma',
    inputType: 'aramaic',
    outputType: 'greek',
    transformation: (input: string) => {
      const glyphs = input.split('').filter(g => ARAMAIC_GLYPHS[g]);
      const sum = glyphs.reduce((acc, g) => acc + ARAMAIC_GLYPHS[g], 0);
      // Map to Greek
      const greekIndex = sum % 24;
      const greekLetters = 'αβγδεζηθικλμνξοπρστυφχψω';
      return greekLetters[greekIndex] || 'σ';
    }
  },
  {
    id: 'evolution_3',
    name: 'Evolution: Divine Ratio',
    formula: '𐡔𐡎𐡈 × φ → 𐡕𐡉𐡃',
    description: '369 (EL) multiplied by golden ratio φ, transforms to 419 (Theos)',
    inputType: 'aramaic',
    outputType: 'aramaic',
    transformation: (input: string) => {
      const num = aramaicToNumeric(input);
      const phi = 1.618033988749895; // Golden ratio
      const result = Math.floor(num * phi);
      return numericToAramaic(result);
    }
  },
  {
    id: 'evolution_4',
    name: 'Evolution: Square Root Transform',
    formula: '√(𐡕) → α',
    description: 'Square root of Taw (22) transforms to Alpha',
    inputType: 'aramaic',
    outputType: 'greek',
    transformation: (input: string) => {
      const num = aramaicToNumeric(input);
      const sqrt = Math.floor(Math.sqrt(num));
      const greekIndex = sqrt % 24;
      const greekLetters = 'αβγδεζηθικλμνξοπρστυφχψω';
      return greekLetters[greekIndex] || 'α';
    }
  },
  {
    id: 'evolution_5',
    name: 'Evolution: Mixed Script Fusion',
    formula: '𐡀 + α → β (RTL)',
    description: 'Aramaic Aleph + Greek Alpha = Beta, reading RTL',
    inputType: 'mixed',
    outputType: 'greek',
    transformation: (input: string) => {
      // Extract Aramaic and Greek parts
      const parsed = parseFormula(input);
      const aramaicSum = parsed.aramaicParts.reduce((acc, g) => acc + ARAMAIC_GLYPHS[g], 0);
      const greekSum = parsed.greekParts.length;
      const total = aramaicSum + greekSum;
      const greekIndex = total % 24;
      const greekLetters = 'αβγδεζηθικλμνξοπρστυφχψω';
      return greekLetters[greekIndex] || 'β';
    }
  },
  {
    id: 'shape_transform_1',
    name: 'Shape Transform: Rotate',
    formula: '𐡀 ↻ 90° → 𐡄',
    description: 'Rotate glyph 90 degrees (shape transformation)',
    inputType: 'aramaic',
    outputType: 'aramaic',
    transformation: (input: string) => {
      // Shape rotation mapping (conceptual)
      const rotationMap: Record<string, string> = {
        '𐡀': '𐡄', // Aleph → He
        '𐡄': '𐡉', // He → Yodh
        '𐡉': '𐡀', // Yodh → Aleph
      };
      return rotationMap[input] || input;
    }
  },
  {
    id: 'shape_transform_2',
    name: 'Shape Transform: Mirror',
    formula: '𐡀 ↔ → 𐡕',
    description: 'Mirror glyph horizontally (RTL ↔ LTR)',
    inputType: 'aramaic',
    outputType: 'aramaic',
    transformation: (input: string) => {
      // Mirror mapping (RTL ↔ LTR)
      const mirrorMap: Record<string, string> = {
        '𐡀': '𐡕', // Aleph ↔ Taw (first ↔ last)
        '𐡁': '𐡔', // Beth ↔ Shin
        '𐡂': '𐡓', // Gimel ↔ Resh
      };
      return mirrorMap[input] || input.split('').reverse().join('');
    }
  },
  {
    id: 'evolution_6',
    name: 'Evolution: Exponential Growth',
    formula: '𐡀^λ → ∞',
    description: 'Exponential transformation using lambda',
    inputType: 'aramaic',
    outputType: 'numeric',
    transformation: (input: string) => {
      const num = aramaicToNumeric(input);
      const lambda = 1.5; // Growth factor
      const result = Math.pow(num, lambda);
      return result.toString();
    }
  },
];

// Apply formula to transform script
function applyFormula(formulaId: string, input: string): string {
  const formula = COMPUTATION_FORMULAS.find(f => f.id === formulaId);
  if (!formula) {
    throw new Error(`Formula ${formulaId} not found`);
  }
  
  return formula.transformation(input);
}

// Evolve script through multiple formulas
function evolveScript(
  input: string,
  formulaSequence: string[],
  direction: 'ltr' | 'rtl' = 'rtl'
): {
  steps: Array<{ formula: string; input: string; output: string }>;
  final: string;
} {
  const steps: Array<{ formula: string; input: string; output: string }> = [];
  let current = input;
  
  // Reverse sequence if RTL
  const sequence = direction === 'rtl' ? formulaSequence.reverse() : formulaSequence;
  
  for (const formulaId of sequence) {
    const formula = COMPUTATION_FORMULAS.find(f => f.id === formulaId);
    if (!formula) continue;
    
    const output = applyFormula(formulaId, current);
    steps.push({
      formula: formula.formula,
      input: current,
      output
    });
    current = output;
  }
  
  return { steps, final: current };
}

// Generate computation manifest
function generateComputationManifest(): string {
  return JSON.stringify({
    formulas: COMPUTATION_FORMULAS.map(f => ({
      id: f.id,
      name: f.name,
      formula: f.formula,
      description: f.description,
      inputType: f.inputType,
      outputType: f.outputType
    })),
    aramaicGlyphs: Object.keys(ARAMAIC_GLYPHS),
    greekLetters: Object.keys(GREEK_LETTERS),
    mathSymbols: Object.keys(MATH_SYMBOLS),
    rtlSupport: true,
    generatedAt: new Date().toISOString()
  }, null, 2);
}

// CLI interface
function main() {
  const args = process.argv.slice(2);
  
  if (args[0] === 'list') {
    console.log('\n📐 Available Computation Formulas:\n');
    COMPUTATION_FORMULAS.forEach((formula, i) => {
      console.log(`${i + 1}. ${formula.name}`);
      console.log(`   Formula: ${formula.formula}`);
      console.log(`   ${formula.description}`);
      console.log(`   Input: ${formula.inputType} → Output: ${formula.outputType}\n`);
    });
    return;
  }
  
  if (args[0] === 'compute' && args.length >= 3) {
    const formulaId = args[1];
    const input = args[2];
    
    try {
      const output = applyFormula(formulaId, input);
      const formula = COMPUTATION_FORMULAS.find(f => f.id === formulaId);
      
      console.log(`\n🧮 Computation:\n`);
      console.log(`   Formula: ${formula?.formula || formulaId}`);
      console.log(`   Input: ${input}`);
      console.log(`   Output: ${output}\n`);
    } catch (error) {
      console.error(`❌ Error: ${error}`);
    }
    return;
  }
  
  if (args[0] === 'evolve' && args.length >= 3) {
    const input = args[1];
    const formulas = args.slice(2);
    const direction = args.includes('--ltr') ? 'ltr' : 'rtl';
    
    try {
      const result = evolveScript(input, formulas, direction);
      
      console.log(`\n🔄 Script Evolution (${direction.toUpperCase()}):\n`);
      result.steps.forEach((step, i) => {
        console.log(`   Step ${i + 1}: ${step.formula}`);
        console.log(`   ${step.input} → ${step.output}\n`);
      });
      console.log(`   Final: ${result.final}\n`);
    } catch (error) {
      console.error(`❌ Error: ${error}`);
    }
    return;
  }
  
  if (args[0] === 'manifest') {
    const manifest = generateComputationManifest();
    const manifestPath = path.join(process.cwd(), 'computation_manifest.json');
    fs.writeFileSync(manifestPath, manifest);
    console.log(`✅ Manifest saved to ${manifestPath}`);
    return;
  }
  
  console.log(`
📐 Script Computation System

Usage:
  npm run compute list                    - List all formulas
  npm run compute compute <id> <input>   - Apply formula
  npm run compute evolve <input> <f1> <f2> ... [--ltr] - Evolve script
  npm run compute manifest                - Generate manifest

Examples:
  npm run compute compute evolution_1 "𐡀"
  npm run compute evolve "𐡀" evolution_1 evolution_2 evolution_3
  npm run compute evolve "𐡀𐡄" evolution_5 --ltr
`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  applyFormula,
  evolveScript,
  parseFormula,
  aramaicToNumeric,
  numericToAramaic,
  COMPUTATION_FORMULAS,
  ARAMAIC_GLYPHS,
  GREEK_LETTERS,
  MATH_SYMBOLS
};
