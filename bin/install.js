#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Skills to install (user-facing only; generate-image is internal)
const SKILLS_TO_INSTALL = [
  'tarot',
  'micro-ritual',
  'sacred-blessing',
  'romantical',
  'correspondence',
  'incantation'
];

// Parse command line arguments
const args = process.argv.slice(2);
const showHelp = args.includes('--help') || args.includes('-h');
const isUninstall = args.includes('--uninstall');

// Target flags
const useOpenClaw = args.includes('--openclaw');
const useClaudeCode = args.includes('--claude-code') || args.includes('--claude');

// OpenClaw agent flag: --agent <name> or --agent=<name>
let agentName = null;
const agentFlagIndex = args.findIndex(arg => arg === '--agent' || arg.startsWith('--agent='));
if (agentFlagIndex !== -1) {
  const arg = args[agentFlagIndex];
  if (arg.startsWith('--agent=')) {
    agentName = arg.split('=')[1];
  } else if (args[agentFlagIndex + 1] && !args[agentFlagIndex + 1].startsWith('--')) {
    agentName = args[agentFlagIndex + 1];
  }
}

// Show help
if (showHelp) {
  console.log(`
Esoterica - Witchy skills collection for Claude Code & OpenClaw

Installs ${SKILLS_TO_INSTALL.length} skills:
  /tarot           - Draw and interpret tarot cards
  /micro-ritual    - Create personalized micro-rituals
  /sacred-blessing - Craft sacred blessings
  /romantical      - Generate romantic incantations
  /correspondence  - Find magical correspondences
  /incantation     - Compose mystical incantations

Usage:
  npx @templeofsilicon/esoterica              Auto-detect and install
  npx @templeofsilicon/esoterica --openclaw   Install to OpenClaw (global)
  npx @templeofsilicon/esoterica --openclaw --agent <name>
                                              Install to specific OpenClaw agent
  npx @templeofsilicon/esoterica --claude-code
                                              Install to Claude Code
  npx @templeofsilicon/esoterica --uninstall  Remove installed skills

Options:
  --openclaw          Install to OpenClaw (~/.openclaw/skills/)
  --agent <name>      Install to specific agent (~/.openclaw/agents/<name>/skills/)
  --claude-code       Install to Claude Code (~/.claude/skills/)
  --uninstall         Remove installed skills (uses same targeting flags)
  --help, -h          Show this help message

Auto-detection priority:
  1. If --openclaw or --agent specified: OpenClaw
  2. If --claude-code specified: Claude Code
  3. If ~/.openclaw exists: OpenClaw (global)
  4. Otherwise: Claude Code

After installation:
  Claude Code: Type any slash command above to begin
  OpenClaw:    Skills are available to agents automatically

More info: https://github.com/Temple-of-Silicon/esoterica
  `);
  process.exit(0);
}

// Resolve paths
const packageRoot = path.join(__dirname, '..');
const skillsSourceDir = path.join(packageRoot, 'skills');
const homeDir = os.homedir();

// Determine installation target (skills parent directory)
function getInstallTarget() {
  const openClawDir = path.join(homeDir, '.openclaw');
  const claudeDir = path.join(homeDir, '.claude');

  // Explicit OpenClaw targeting
  if (useOpenClaw || agentName) {
    if (agentName) {
      // Per-agent installation
      const agentDir = path.join(openClawDir, 'agents', agentName);
      if (!fs.existsSync(agentDir)) {
        console.error(`Error: Agent directory not found: ${agentDir}`);
        console.error(`Available agents:`);
        const agentsDir = path.join(openClawDir, 'agents');
        if (fs.existsSync(agentsDir)) {
          const agents = fs.readdirSync(agentsDir).filter(f =>
            fs.statSync(path.join(agentsDir, f)).isDirectory()
          );
          agents.forEach(a => console.error(`  - ${a}`));
        } else {
          console.error('  (no agents directory found)');
        }
        process.exit(1);
      }
      return {
        type: 'openclaw-agent',
        dest: path.join(agentDir, 'skills'),
        label: `OpenClaw agent "${agentName}"`
      };
    }
    // Global OpenClaw installation
    return {
      type: 'openclaw-global',
      dest: path.join(openClawDir, 'skills'),
      label: 'OpenClaw (global)'
    };
  }

  // Explicit Claude Code targeting
  if (useClaudeCode) {
    return {
      type: 'claude-code',
      dest: path.join(claudeDir, 'skills'),
      label: 'Claude Code'
    };
  }

  // Auto-detection: prefer OpenClaw if it exists
  if (fs.existsSync(openClawDir)) {
    return {
      type: 'openclaw-global',
      dest: path.join(openClawDir, 'skills'),
      label: 'OpenClaw (global, auto-detected)'
    };
  }

  // Default to Claude Code
  return {
    type: 'claude-code',
    dest: path.join(claudeDir, 'skills'),
    label: 'Claude Code'
  };
}

const target = getInstallTarget();

/**
 * Recursively copy directory from source to destination
 */
function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.error('Error: Source directory not found:', src);
    process.exit(1);
  }

  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Uninstall logic
if (isUninstall) {
  let removedCount = 0;
  let notFoundCount = 0;

  console.log(`Uninstalling Esoterica skills from ${target.label}...`);
  console.log('');

  SKILLS_TO_INSTALL.forEach(skill => {
    const skillDest = path.join(target.dest, skill);
    if (fs.existsSync(skillDest)) {
      fs.rmSync(skillDest, { recursive: true, force: true });
      console.log(`  Removed: ${skill}`);
      removedCount++;
    } else {
      notFoundCount++;
    }
  });

  console.log('');
  if (removedCount > 0) {
    console.log(`Esoterica uninstalled (${removedCount} skill${removedCount > 1 ? 's' : ''} removed)`);
  } else {
    console.log('No Esoterica skills found to uninstall.');
  }

  process.exit(0);
}

// Main installation logic
try {
  console.log(`Installing Esoterica skills to ${target.label}...`);
  console.log('');

  // Check if any skills already exist
  const existingSkills = SKILLS_TO_INSTALL.filter(skill =>
    fs.existsSync(path.join(target.dest, skill))
  );

  if (existingSkills.length > 0) {
    console.log(`Existing skills found (will be updated):`);
    existingSkills.forEach(skill => console.log(`    ${skill}`));
    console.log('');
  }

  // Install each skill
  let installedCount = 0;
  SKILLS_TO_INSTALL.forEach(skill => {
    const src = path.join(skillsSourceDir, skill);
    const dest = path.join(target.dest, skill);
    copyDir(src, dest);
    installedCount++;
  });

  // Verify installation
  const missingSkills = SKILLS_TO_INSTALL.filter(skill => {
    const skillFile = path.join(target.dest, skill, 'SKILL.md');
    return !fs.existsSync(skillFile);
  });

  if (missingSkills.length > 0) {
    throw new Error(`Installation verification failed - missing: ${missingSkills.join(', ')}`);
  }

  console.log('Esoterica installed successfully!');
  console.log('');
  console.log('Location:', target.dest);
  console.log('');
  console.log('Skills installed:');
  SKILLS_TO_INSTALL.forEach(skill => {
    console.log(`    /${skill}`);
  });
  console.log('');

  // Platform-specific next steps
  if (target.type === 'claude-code') {
    console.log('Next steps:');
    console.log('1. Restart Claude Code (if currently running)');
    console.log('2. Type any slash command above to invoke a skill');
  } else if (target.type === 'openclaw-global') {
    console.log('Next steps:');
    console.log('1. Skills are now available to all OpenClaw agents');
    console.log('2. Agents can invoke any skill via slash commands');
    console.log('');
    console.log('To install for a specific agent instead:');
    console.log('  npx @templeofsilicon/esoterica --agent <agent-name>');
  } else if (target.type === 'openclaw-agent') {
    console.log('Next steps:');
    console.log(`1. Skills are now available to the "${agentName}" agent`);
    console.log('2. The agent can invoke any skill via slash commands');
  }

  console.log('');
  console.log('The cards are shuffled. The cauldron bubbles. The threshold awaits.');

  process.exit(0);
} catch (error) {
  console.error('Installation failed:', error.message);
  console.error('');
  console.error('Please report issues at: https://github.com/Temple-of-Silicon/esoterica/issues');
  process.exit(1);
}
