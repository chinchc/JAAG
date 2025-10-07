#!/usr/bin/env node
/**
 * Cross-platform patch application script
 * Applies patches to sugar-sketcher to fix GAG structure definitions
 */

const fs = require('fs');
const path = require('path');

const STRUCTURES_FILE = path.join(__dirname, 'node_modules', 'sugar-sketcher', 'src', 'js', 'models', 'glycomics', 'dictionary', 'Structures.js');

// Define the patches - complete structure replacements for accurate GAG definitions
const patches = [
  {
    name: 'gagdermatan - fix b-dido to a-lido (2 occurrences)',
    searchOld: 'b-dido-HEX',
    searchContext: 'gagdermatan',
    replaceWith: 'a-lido-HEX',
    occurrences: 2
  },
  {
    name: 'gagheparin - complete structure replacement (anomers, sulfates, linkages)',
    searchContext: 'gagheparin',
    fullReplacement: true,
    searchOld: 'glycoct: "RES\\n1b:b-dglc-HEX-1:5\\n2s:n-sulfate\\n3s:sulfate\\n4b:a-dido-HEX-1:5|6:a\\n5s:sulfate\\n6b:b-dglc-HEX-1:5\\n7s:n-sulfate\\n8s:sulfate\\n9b:a-dido-HEX-1:5|6:a\\n10s:sulfate\\n11s:sulfate\\nLIN\\n1:1d(2+-1)2n\\n2:1o(3+-1)3n\\n3:1o(4+1)4d\\n4:4o(2+-1)5n\\n5:4o(4+1)6d\\n6:6d(2+-1)7n\\n7:6o(3+-1)8n\\n8:6o(4+1)9d\\n9:6o(6+-1)10n\\n10:1o(6+-1)11n"',
    replaceWith: 'glycoct: "RES\\n1b:a-dglc-HEX-1:5\\n2s:sulfate\\n3b:a-lido-HEX-1:5|6:a\\n4b:a-dglc-HEX-1:5\\n5s:sulfate\\n6b:a-lido-HEX-1:5|6:a\\n7s:sulfate\\n8s:n-sulfate\\n9s:sulfate\\n10s:sulfate\\n11s:n-sulfate\\nLIN\\n1:1o(6+1)2n\\n2:1o(4+1)3d\\n3:3o(4+1)4d\\n4:4o(6+1)5n\\n5:4o(4+1)6d\\n6:4o(3+1)7n\\n7:4d(2+1)8n\\n8:3o(2+1)9n\\n9:1o(3+1)10n\\n10:1d(2+1)11n"'
  },
  {
    name: 'gagheparan - fix b-dglc to a-dglc (2 occurrences)',
    searchOld: 'b-dglc-HEX',
    searchContext: 'gagheparan',
    replaceWith: 'a-dglc-HEX',
    occurrences: 2
  },
  {
    name: 'gagheparan - fix a-dido to a-lido (2 occurrences)',
    searchOld: 'a-dido-HEX',
    searchContext: 'gagheparan',
    replaceWith: 'a-lido-HEX',
    occurrences: 2
  }
];

function applyPatches() {
  console.log('Applying sugar-sketcher GAG structure patches...');

  // Check if file exists
  if (!fs.existsSync(STRUCTURES_FILE)) {
    console.error(`Error: ${STRUCTURES_FILE} not found`);
    console.error('Make sure sugar-sketcher is installed (run npm install first)');
    process.exit(1);
  }

  // Read the file
  let content = fs.readFileSync(STRUCTURES_FILE, 'utf8');
  let totalPatchesApplied = 0;

  // Extract each GAG structure section for targeted patching
  const gagSections = {
    gagdermatan: extractSection(content, 'gagdermatan'),
    gagheparin: extractSection(content, 'gagheparin'),
    gagheparan: extractSection(content, 'gagheparan')
  };

  // Apply patches for each section
  for (const [sectionName, sectionContent] of Object.entries(gagSections)) {
    if (!sectionContent) {
      console.log(`✗ Section ${sectionName} not found`);
      continue;
    }

    let modifiedSection = sectionContent;
    const relevantPatches = patches.filter(p => p.searchContext === sectionName);

    for (const patch of relevantPatches) {
      if (patch.fullReplacement) {
        // Handle full glycoct replacement
        if (modifiedSection.includes(patch.searchOld)) {
          modifiedSection = modifiedSection.replace(patch.searchOld, patch.replaceWith);
          console.log(`✓ Applied: ${patch.name}`);
          totalPatchesApplied++;
        } else if (modifiedSection.includes(patch.replaceWith)) {
          console.log(`→ Already applied: ${patch.name}`);
        } else {
          console.log(`✗ Cannot apply: ${patch.name}`);
        }
      } else {
        // Handle simple string replacement
        const searchRegex = new RegExp(escapeRegex(patch.searchOld), 'g');
        const matches = modifiedSection.match(searchRegex);

        if (matches && matches.length > 0) {
          modifiedSection = modifiedSection.replace(searchRegex, patch.replaceWith);
          console.log(`✓ Applied: ${patch.name}`);
          totalPatchesApplied++;
        } else if (modifiedSection.includes(patch.replaceWith)) {
          console.log(`→ Already applied: ${patch.name}`);
        } else {
          console.log(`✗ Cannot apply: ${patch.name}`);
        }
      }
    }

    // Replace the section in the original content
    content = content.replace(sectionContent, modifiedSection);
  }

  // Write the file back if any patches were applied
  if (totalPatchesApplied > 0) {
    // Ensure a prominent modification header is present per Apache-2.0 §4(b)
    const hasModificationHeader = /This file has been modified by|Modified by JAAG/i.test(content);
    if (!hasModificationHeader) {
      const dateStr = new Date().toISOString().slice(0, 10);
      const headerLines = [
        '/*',
        ` * This file has been modified by Chin Huang at University of Georgia for JAAG (${dateStr}).`,
        ' * Changes: fixes to glycosaminoglycan structure definitions (dermatan, heparin, heparan).',
        ' * See apply-patches.js for details.',
        ' */',
        ''
      ];
      content = headerLines.join('\n') + content;
    }

    fs.writeFileSync(STRUCTURES_FILE, content, 'utf8');
    console.log(`\n✓ Successfully applied ${totalPatchesApplied} patch(es)`);
  } else {
    // Check if already patched
    const allAlreadyPatched = checkIfAllPatched(content);
    if (allAlreadyPatched) {
      console.log('\n✓ All patches already applied');
    } else {
      console.log('\n✗ No patches were applied');
      process.exit(1);
    }
  }
}

function extractSection(content, sectionName) {
  // Extract the section from the structure name to the next closing brace
  const startRegex = new RegExp(`${sectionName}:\\s*\\{`);
  const startMatch = content.match(startRegex);

  if (!startMatch) return null;

  const startIdx = content.indexOf(startMatch[0]);
  let braceCount = 1;
  let idx = startIdx + startMatch[0].length;

  while (idx < content.length && braceCount > 0) {
    if (content[idx] === '{') braceCount++;
    if (content[idx] === '}') braceCount--;
    idx++;
  }

  return content.substring(startIdx, idx);
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function checkIfAllPatched(content) {
  // Check if the corrected values exist
  const gagdermatan = content.match(/gagdermatan[\s\S]*?a-lido-HEX[\s\S]*?a-lido-HEX/);
  const gagheparin = content.match(/gagheparin[\s\S]*?a-lido-HEX[\s\S]*?a-lido-HEX[\s\S]*?1:1o\(6\+1\)2n/);
  const gagheparan = content.match(/gagheparan[\s\S]*?a-dglc-HEX[\s\S]*?a-lido-HEX/);

  return gagdermatan && gagheparin && gagheparan;
}

// Run the patches
try {
  applyPatches();
} catch (error) {
  console.error('Error applying patches:', error.message);
  process.exit(1);
}
